describe('Detention Block Rescue', function() {
    integration(function(contextRef) {
        describe('Detention Block Rescue\'s ability', function() {
            it('should deal 3 damage to a unit or 6 if he is guarding a unit', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        hand: ['detention-block-rescue'],
                        groundArena: ['battlefield-marine']
                    },
                    player2: {
                        groundArena: ['wampa', { card: 'atst', capturedUnits: ['echo-base-defender'] }]
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });

                const { context } = contextRef;

                context.player1.clickCard(context.detentionBlockRescue);

                // should be able to select all unit
                expect(context.player1).toBeAbleToSelectExactly([context.battlefieldMarine, context.wampa, context.atst]);

                // deal only 3 damage to wampa as he does not guard anybody
                context.player1.clickCard(context.wampa);
                expect(context.wampa.damage).toBe(3);

                // reset
                context.player1.moveCard(context.detentionBlockRescue, 'hand');

                context.player2.passAction();

                // deal 6 damage to atst because he's guarding battlefield marine
                context.player1.clickCard(context.detentionBlockRescue);
                context.player1.clickCard(context.atst);
                expect(context.atst.damage).toBe(6);
            });
        });
    });
});
