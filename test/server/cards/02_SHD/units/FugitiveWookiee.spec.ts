describe('Fugitive Wookiee', function() {
    integration(function(contextRef) {
        describe('Fugitive Wookiee\'s Bounty ability', function() {
            it('should exhaust a unit when triggered by defeat', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        groundArena: ['fugitive-wookiee', 'battlefield-marine']
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['cartel-spacer']
                    }
                });

                const { context } = contextRef;

                context.player1.clickCard(context.fugitiveWookiee);
                context.player1.clickCard(context.wampa);

                expect(context.player2).toBeAbleToSelectExactly([context.wampa, context.battlefieldMarine, context.cartelSpacer]);
                expect(context.player2).toHavePassAbilityButton();
                context.player2.clickCard(context.cartelSpacer);
                expect(context.cartelSpacer.exhausted).toBeTrue();
                expect(context.player2).toBeActivePlayer();
            });

            it('should exhaust a unit when triggered by capture', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        groundArena: ['fugitive-wookiee', 'battlefield-marine']
                    },
                    player2: {
                        groundArena: ['wampa'],
                        spaceArena: ['cartel-spacer'],
                        hand: ['take-captive']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });

                const { context } = contextRef;

                context.player1.passAction();

                context.player2.clickCard(context.takeCaptive);
                // Wampa is automatically selected as captor b/c there is nothing for Cartel Spacer to capture
                context.player2.clickCard(context.fugitiveWookiee);

                expect(context.player2).toBeAbleToSelectExactly([context.wampa, context.battlefieldMarine, context.cartelSpacer]);
                expect(context.player2).toHavePassAbilityButton();
                context.player2.clickCard(context.cartelSpacer);
                expect(context.cartelSpacer.exhausted).toBeTrue();

                expect(context.player1).toBeActivePlayer();
            });
        });
    });
});
