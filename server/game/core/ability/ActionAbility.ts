import type { AbilityContext } from './AbilityContext.js';
import { CardAbility } from './CardAbility';
import { PhaseName } from '../Constants.js';
import type { IActionAbilityProps } from '../../Interfaces.js';
import type { Card } from '../card/Card.js';
import type Game from '../Game.js';

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * condition    - optional function that should return true when the action is
 *                allowed, false otherwise. It should generally be used to check
 *                if the action can modify game state (step #1 in ability
 *                resolution in the rules).
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * zone     - string indicating the zone the card should be in in order
 *                to activate the action. Defaults to 'play area'.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * clickToActivate - boolean that indicates the action should be activated when
 *                   the card is clicked.
 */
export class ActionAbility extends CardAbility {
    protected anyPlayer: boolean;
    protected doesNotTarget: boolean;
    protected phase: string;

    public readonly condition?: (context?: AbilityContext) => boolean;

    public constructor(game: Game, card: Card, properties: IActionAbilityProps) {
        super(game, card, properties);

        this.phase = properties.phase ?? PhaseName.Action;
        this.condition = properties.condition;
        this.doesNotTarget = (properties as any).doesNotTarget;

        if (!card.canRegisterActionAbilities()) {
            throw Error(`Card '${card.internalName}' cannot have action abilities`);
        }
    }

    public override meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements = [], thisStepOnly = false) {
        if (!ignoredRequirements.includes('zone') && !this.isInValidZone(context)) {
            return 'zone';
        }

        if (!ignoredRequirements.includes('phase') && this.phase !== 'any' && this.phase !== this.game.currentPhase) {
            return 'phase';
        }

        if (!ignoredRequirements.includes('condition') && this.condition && !this.condition(context)) {
            return 'condition';
        }

        return super.meetsRequirements(context, ignoredRequirements, thisStepOnly);
    }
}
