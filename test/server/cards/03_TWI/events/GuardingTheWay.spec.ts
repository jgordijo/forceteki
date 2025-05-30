describe('Guarding the Way', function () {
    integration(function (contextRef) {
        describe('Guarding the Way\'s ability', function () {
            it('should give a unit Sentinel and +2/+2 for the phase when the controller has initiative', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        hand: ['guarding-the-way'],
                        groundArena: ['luke-skywalker#jedi-knight']
                    },
                    player2: {
                        groundArena: ['chewbacca#pykesbane']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });

                const { context } = contextRef;

                context.player1.clickCard(context.guardingTheWay);
                expect(context.player1).toBeAbleToSelectExactly([context.lukeSkywalkerJediKnight, context.chewbaccaPykesbane]);

                context.player1.clickCard(context.lukeSkywalkerJediKnight);
                expect(context.lukeSkywalkerJediKnight.getPower()).toBe(8);
                expect(context.lukeSkywalkerJediKnight.getHp()).toBe(9);
                expect(context.player2).toBeActivePlayer();
                expect(context.getChatLogs(1)).toContain('player1 plays Guarding the Way to give Sentinel to Luke Skywalker for this phase and to give +2/+2 to Luke Skywalker for this phase');

                // Attack verifying Sentinel and +2/+2 were applied
                context.player2.clickCard(context.chewbaccaPykesbane);
                expect(context.chewbaccaPykesbane.damage).toBe(8);
                expect(context.lukeSkywalkerJediKnight.damage).toBe(4);

                context.moveToNextActionPhase();
                expect(context.lukeSkywalkerJediKnight.getPower()).toBe(6);
                expect(context.lukeSkywalkerJediKnight.getHp()).toBe(7);
            });

            it('should give a unit Sentinel for the phase when the controller does not have initiative', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        hand: ['pyke-sentinel'],
                        groundArena: ['chewbacca#pykesbane'],
                    },
                    player2: {
                        hand: ['guarding-the-way'],
                        groundArena: ['luke-skywalker#jedi-knight']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });

                const { context } = contextRef;

                context.player1.clickCard(context.pykeSentinel);
                expect(context.player2).toBeActivePlayer();

                context.player2.clickCard(context.guardingTheWay);
                expect(context.player2).toBeAbleToSelectExactly([context.lukeSkywalkerJediKnight, context.chewbaccaPykesbane, context.pykeSentinel]);

                context.player2.clickCard(context.lukeSkywalkerJediKnight);
                expect(context.lukeSkywalkerJediKnight.getPower()).toBe(6);
                expect(context.lukeSkywalkerJediKnight.getHp()).toBe(7);
                expect(context.player1).toBeActivePlayer();
                expect(context.getChatLogs(1)).toContain('player2 plays Guarding the Way to give Sentinel to Luke Skywalker for this phase');

                // Attack verifying Sentinel was applied
                context.player1.clickCard(context.chewbaccaPykesbane);
                expect(context.lukeSkywalkerJediKnight.damage).toBe(4);
                expect(context.chewbaccaPykesbane.damage).toBe(6);
            });
        });
    });
});
