const { BaseStepWithPipeline } = require('./BaseStepWithPipeline.js');
const { SimpleStep } = require('./SimpleStep.js');
const { ZoneName, Stage, CardType, EventName, AbilityType, RelativePlayer } = require('../Constants.js');
const { GameEvent } = require('../event/GameEvent.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context, optional = false, canCancel = null, earlyTargetingOverride = null, ignoredRequirements = []) {
        super(game);

        this.context = context;
        this.events = [];
        this.targetResults = {};
        this.costResults = this.getCostResults();
        this.earlyTargetingOverride = earlyTargetingOverride;
        this.ignoredRequirements = ignoredRequirements;
        this.initialise();

        /** Indicates that we should skip all remaining ability resolution steps */
        this.cancelled = false;

        /**
         * Indicates to the calling pipeline that this ability is done resolving.
         * Otherwise, repeat ability resolution (e.g. if the user clicked "cancel" halfway through)
         */
        this.resolutionComplete = false;

        // if canCancel is not provided, we default to true if there is no previous ability resolver
        // this prevents us from trying to cancel an "inner" ability while the outer one still resolves
        // TODO: fix this flow so cancelling is more flexible
        if (canCancel == null) {
            this.canCancel = game.currentAbilityResolver == null;
        } else {
            this.canCancel = canCancel;
        }

        this.currentAbilityResolver = game.currentAbilityResolver;
        game.currentAbilityResolver = this;

        // this is used when a triggered ability is marked optional to ensure that a "Pass" button
        // appears at the appropriate times during the prompt flow for that ability
        // TODO: add interface for this in Interfaces.ts when we convert to TS
        if (this.context.ability.optionalButtonTextOverride) {
            this.passButtonText = this.context.ability.optionalButtonTextOverride;
        } else {
            this.passButtonText = this.context.ability.isAttackAction() ? 'Pass attack' : 'Pass';
        }

        this.passAbilityHandler = (!!this.context.ability.optional || optional) ? {
            buttonText: this.passButtonText,
            arg: 'passAbility',
            hasBeenShown: false,
            playerChoosing: (this.context.ability.playerChoosingOptional ?? RelativePlayer.Self) === RelativePlayer.Self
                ? this.context.player
                : this.context.player.opponent,
            handler: () => {
                this.cancelled = true;
                this.resolutionComplete = true;
            }
        } : null;
    }

    initialise() {
        this.pipeline.initialise([
            // new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.checkAbility(), 'checkAbility'),
            new SimpleStep(this.game, () => this.resolveEarlyTargets(), 'resolveEarlyTargets'),
            new SimpleStep(this.game, () => this.checkForCancelOrPass(), 'checkForCancelOrPass'),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow(), 'openInitiateAbilityEventWindow'),
            new SimpleStep(this.game, () => this.resetGameAbilityResolver(), 'resetGameAbilityResolver')
        ]);
    }

    checkAbility() {
        if (this.cancelled) {
            return;
        }

        this.context.stage = Stage.PreTarget;

        if (this.context.ability.meetsRequirements(this.context, this.ignoredRequirements, true) !== '') {
            this.cancelled = true;
            this.resolutionComplete = true;
            return;
        }

        // if the opponent is choosing whether or not to pass, show that prompt at this stage before any targeting / costs happen
        if (this.passAbilityHandler?.playerChoosing !== this.context.player) {
            this.checkForPass();
        }
    }

    resolveEarlyTargets() {
        if (this.cancelled) {
            return;
        }

        if (this.earlyTargetingOverride) {
            this.targetResults = this.earlyTargetingOverride;
            return;
        }

        if (!this.context.ability.cannotTargetFirst) {
            // if the opponent is the one choosing whether to pass or not, we don't include the pass handler in the target resolver
            const passAbilityHandler = this.passAbilityHandler?.playerChoosing === this.context.player ? this.passAbilityHandler : null;

            this.targetResults = this.context.ability.resolveEarlyTargets(this.context, passAbilityHandler, this.canCancel);
        }
    }

    checkForCancelOrPass() {
        if (this.cancelled) {
            return;
        }

        this.checkTargetResultCancelState();

        if (!this.cancelled && this.passAbilityHandler && !this.passAbilityHandler.hasBeenShown) {
            this.checkForPass();
        }
    }

    // TODO: figure out our story for snapshots
    // createSnapshot() {
    //     if([CardType.Unit, CardType.Base, CardType.Leader, CardType.Upgrade].includes(this.context.source.getType())) {
    //         this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
    //     }
    // }

    openInitiateAbilityEventWindow() {
        if (this.cancelled) {
            this.checkResolveIfYouDoNot();
            return;
        }
        let eventName = EventName.OnAbilityResolverInitiated;
        let eventProps = {};
        if (this.context.ability.isCardAbility()) {
            eventName = EventName.OnCardAbilityInitiated;
            eventProps = {
                card: this.context.source,
                ability: this.context.ability
            };
            if (this.context.ability.isPlayCardAbility()) {
                this.events.push(new GameEvent(EventName.OnCardPlayed, this.context, {
                    player: this.context.player,
                    card: this.context.source,
                    originalZone: this.context.source.zoneName,
                    originallyOnTopOfDeck:
                        this.context.player && this.context.player.drawDeck && this.context.player.drawDeck[0] === this.context.source,
                    onPlayCardSource: this.context.onPlayCardSource,
                    playType: this.context.playType,
                    resolver: this
                }));
            }
            if (this.context.ability.isActivatedAbility()) {
                this.events.push(new GameEvent(EventName.OnCardAbilityTriggered, this.context, {
                    player: this.context.player,
                    card: this.context.source
                }));
            }
        }
        this.events.push(new GameEvent(eventName, this.context, eventProps, () => this.queueInitiateAbilitySteps()));
        this.game.openEventWindow(this.events, this.context.ability.triggerHandlingMode);
    }

    // if there is an "if you do not" part of this ability, we need to resolve it if the main ability doesn't resolve
    checkResolveIfYouDoNot() {
        if (!this.cancelled || !this.resolutionComplete) {
            return;
        }

        if (this.context.ability.properties?.ifYouDoNot) {
            const ifYouDoNotAbilityContext = this.context.ability.getSubAbilityStepContext(this.context);
            if (ifYouDoNotAbilityContext) {
                this.game.resolveAbility(ifYouDoNotAbilityContext);
            }
        }
    }

    queueInitiateAbilitySteps() {
        this.game.queueSimpleStep(() => this.resolveCosts(), 'resolveCosts');
        this.game.queueSimpleStep(() => this.payCosts(), 'payCosts');
        this.game.queueSimpleStep(() => this.checkCostsWerePaid(), 'checkCostsWerePaid');
        this.game.queueSimpleStep(() => this.resolveTargets(), 'resolveTargets');
        this.game.queueSimpleStep(() => this.checkForCancel(), 'checkForCancel');
        this.game.queueSimpleStep(() => this.executeHandler(), 'executeHandler');
    }

    checkForCancel() {
        if (this.cancelled) {
            return;
        }

        this.checkTargetResultCancelState();
    }

    checkTargetResultCancelState() {
        this.cancelled = this.targetResults.cancelled;

        if (
            !this.cancelled &&
            this.targetResults.hasEffectiveTargets === false &&
            (!this.context.ability.cost || this.context.ability.cost?.length === 0)
        ) {
            this.cancelled = true;
            this.resolutionComplete = true;
        }
    }

    // TODO: add passHandler support here
    resolveCosts() {
        if (this.cancelled) {
            return;
        }
        this.costResults.canCancel = this.canCancel;
        this.context.stage = Stage.Cost;
        this.context.ability.resolveCosts(this.context, this.costResults);
    }

    getCostResults() {
        return {
            cancelled: false,
            canCancel: this.canCancel,
            events: [],
            playCosts: true,
            triggerCosts: true
        };
    }

    checkForPass() {
        if (this.cancelled) {
            return;
        } else if (this.costResults.cancelled) {
            this.cancelled = true;
            return;
        }

        if (this.passAbilityHandler && !this.passAbilityHandler.hasBeenShown) {
            this.passAbilityHandler.hasBeenShown = true;
            this.game.promptWithHandlerMenu(this.passAbilityHandler.playerChoosing, {
                activePromptTitle: `Trigger the ability '${this.getAbilityPromptTitle(this.context)}' or pass`,
                choices: ['Trigger', this.passAbilityHandler.buttonText],
                handlers: [
                    () => {},
                    () => {
                        this.passAbilityHandler.handler();
                    }
                ]
            });
        }
    }

    getAbilityPromptTitle(context) {
        if (context.overrideTitle) {
            return context.overrideTitle;
        }
        return context.ability.title;
    }

    payCosts() {
        if (this.cancelled) {
            return;
        } else if (this.costResults.cancelled) {
            this.cancelled = true;
            return;
        }

        this.resolutionComplete = true;
        if (this.costResults.events.length > 0) {
            this.game.openEventWindow(this.costResults.events);
        }
    }

    checkCostsWerePaid() {
        if (this.cancelled) {
            return;
        }
        this.cancelled = this.costResults.events.some((event) => event.isCancelled);
        if (this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }
    }

    resolveTargets() {
        if (this.cancelled) {
            return;
        }
        this.context.stage = Stage.Target;

        const ability = this.context.ability;

        if (this.context.ability.hasTargets() && !ability.hasSomeLegalTarget(this.context) && !ability.canResolveWithoutLegalTargets) {
            // Ability cannot resolve, so display a message and cancel it
            this.game.addMessage('{0} attempted to use {1}, but there are insufficient legal targets', this.context.player, this.context.source);
            this.cancelled = true;
        } else if (this.targetResults.delayTargeting) {
            // Targeting was delayed due to an opponent needing to choose targets (which shouldn't happen until costs have been paid), so continue
            this.targetResults = ability.resolveRemainingTargets(this.context, this.targetResults.delayTargeting, null);
        } else if (this.targetResults.payCostsFirst || !ability.checkAllTargets(this.context)) {
            // Targeting was stopped by the player choosing to pay costs first, or one of the chosen targets is no longer legal. Retarget from scratch
            this.targetResults = ability.resolveTargets(this.context, null);
        }
    }

    executeHandler() {
        if (this.cancelled) {
            this.checkResolveIfYouDoNot();
            for (const event of this.events) {
                event.cancel();
            }
            return;
        }

        // Increment limits (limits aren't used up on cards in hand)
        if (this.context.ability.limit && this.context.source.zoneName !== ZoneName.Hand &&
          (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.zoneName === this.context.source.zoneName)) {
            this.context.ability.limit.increment(this.context.player);
        }

        this.context.ability.displayMessage(this.context);
        this.context.stage = Stage.Effect;

        this.context.ability.executeHandler(this.context);
    }

    resetGameAbilityResolver() {
        this.game.currentAbilityResolver = this.currentAbilityResolver;
    }

    /** @override */
    continue() {
        try {
            return this.pipeline.continue(this.game);
        } catch (err) {
            this.game.reportError(err, true);

            // if we hit an error resolving an ability, try to close out the ability gracefully and move on
            // to see if we can preserve a playable game state
            this.cancelled = true;
            this.resolutionComplete = true;

            return true;
        }
    }

    /** @override */
    toString() {
        return `'AbilityResolver: ${this.context.ability}'`;
    }
}

module.exports = AbilityResolver;
