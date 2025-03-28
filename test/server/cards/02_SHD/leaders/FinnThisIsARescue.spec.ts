describe('Finn, This is a Rescue', function () {
    integration(function (contextRef) {
        describe('Finn\'s undeployed ability', function () {
            beforeEach(function () {
                return contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        leader: { card: 'finn#this-is-a-rescue', deployed: false },
                        groundArena: [{ card: 'battlefield-marine', upgrades: ['jedi-lightsaber', { card: 'top-target', ownerAndController: 'player2' }] }],
                        resources: 4
                    },
                    player2: {
                        groundArena: [{ card: 'wampa', upgrades: [{ card: 'entrenched', ownerAndController: 'player1' }] }],
                        resources: 5
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });
            });

            it('should defeat a friendly upgrade and give a shield token', function () {
                const { context } = contextRef;

                // Scenario 1: Defeat a friendly upgrade on a friendly unit
                context.player1.clickCard(context.finn);
                expect(context.player1).toBeAbleToSelectExactly([context.entrenched, context.jediLightsaber]);
                context.player1.clickCard(context.jediLightsaber);
                expect(context.player2).toBeActivePlayer();
                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['shield', 'top-target']);
                expect(context.jediLightsaber).toBeInZone('discard');
                context.player2.passAction();
                // Finn should be exhausted
                expect(context.finn).not.toHaveAvailableActionWhenClickedBy(context.player1);

                // A bit of a hack to get the shield token. Since multiple shield tokens are
                // created, we want to ensure we get the correct one in the scenario below.
                context.shield = context.battlefieldMarine.upgrades.filter((u) => u.name === 'Shield')[0];

                // Reset
                context.readyCard(context.finn);

                // Scenario 2: Defeat a friendly upgrade on an opponent's unit
                context.player1.clickCard(context.finn);
                // There are now two friendly upgrades (entrenched and shield token), so we are prompted to select one
                expect(context.player1).toBeAbleToSelectExactly([context.entrenched, context.shield]);
                context.player1.clickCard(context.entrenched);
                expect(context.player2).toBeActivePlayer();
                expect(context.wampa).toHaveExactUpgradeNames(['shield']);
                expect(context.entrenched).toBeInZone('discard');

                context.player2.passAction();
                // Finn should be exhausted
                expect(context.finn).not.toHaveAvailableActionWhenClickedBy(context.player1);
            });
        });

        describe('Finn\'s deployed ability', function () {
            beforeEach(function () {
                return contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        leader: { card: 'finn#this-is-a-rescue', deployed: true },
                        groundArena: [{ card: 'battlefield-marine', upgrades: ['jedi-lightsaber', { card: 'top-target', ownerAndController: 'player2' }] }],
                        resources: 5
                    },
                    player2: {
                        groundArena: ['wampa', { card: 'atst', upgrades: [{ card: 'entrenched', ownerAndController: 'player1' }] }, 'pyke-sentinel'],
                        resources: 5
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });
            });

            it('should defeat a friendly upgrade and give a shield token on attack', function () {
                const { context } = contextRef;

                const reset = (passAction = true) => {
                    context.readyCard(context.finn);
                    context.setDamage(context.finn, 0);
                    context.setDamage(context.wampa, 0);
                    if (passAction) {
                        context.player2.passAction();
                    }
                };

                // Scenario 1: Pass on defeating an upgrade on attack
                context.player1.clickCard(context.finn);
                expect(context.player1).toBeAbleToSelectExactly([context.jediLightsaber, context.entrenched]);
                expect(context.player1).toHavePassAbilityButton();
                context.player1.clickPrompt('Pass');
                expect(context.player2).toBeActivePlayer();
                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['jedi-lightsaber', 'top-target']);
                expect(context.pykeSentinel).toBeInZone('discard', context.player2);

                reset();

                // Scenario 2: Defeat a friendly upgrade on a friendly unit on attack
                context.player1.clickCard(context.finn);
                context.player1.clickCard(context.wampa);
                expect(context.player1).toBeAbleToSelectExactly([context.jediLightsaber, context.entrenched]);
                context.player1.clickCard(context.jediLightsaber);
                expect(context.player2).toBeActivePlayer();
                expect(context.battlefieldMarine).toHaveExactUpgradeNames(['shield', 'top-target']);
                expect(context.jediLightsaber).toBeInZone('discard');
                expect(context.wampa.damage).toBe(4);

                reset();

                // Scenario 3: Defeat a friendly upgrade on an opponent's unit on attack
                // Attach a friendly upgrade to an opponent's unit

                // Attack with Finn
                context.player1.clickCard(context.finn);
                context.player1.clickCard(context.p2Base);
                context.player1.clickCard(context.entrenched);
                expect(context.player2).toBeActivePlayer();
                expect(context.atst).toHaveExactUpgradeNames(['shield']);
                expect(context.entrenched).toBeInZone('discard');
            });
        });
    });
});
