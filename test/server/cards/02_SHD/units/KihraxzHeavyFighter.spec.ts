describe('Kihraxz Heavy Fighter', function () {
    integration(function (contextRef) {
        describe('Kihraxz Heavy Fighter\'s ability', function() {
            it('should gain +3 on attack if you exhaust another friendly unit and self is not selectable', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        groundArena: ['battlefield-marine', 'pyke-sentinel'],
                        spaceArena: ['kihraxz-heavy-fighter']
                    },
                    player2: {
                        spaceArena: ['devastator#inescapable']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });
                const { context } = contextRef;

                const reset = (passAction = true) => {
                    if (context.kihraxzHeavyFighter.zoneName === 'discard') {
                        context.player1.moveCard(context.kihraxzHeavyFighter, 'spaceArena');
                    }
                    context.readyCard(context.kihraxzHeavyFighter);
                    context.exhaustCard(context.pykeSentinel);
                    context.setDamage(context.devastatorInescapable, 0);
                    if (passAction) {
                        context.player2.passAction();
                    }
                };

                // CASE 1: should gain +3 on attack if you exhaust another friendly unit
                context.player1.clickCard(context.kihraxzHeavyFighter);
                expect(context.player1).toBeAbleToSelectExactly(['battlefield-marine', 'pyke-sentinel']);
                context.player1.clickCard(context.battlefieldMarine);
                expect(context.devastatorInescapable.damage).toBe(6);

                // CASE 2: should do normal attack if no unit can be exhausted
                reset();
                context.player1.clickCard(context.kihraxzHeavyFighter);
                expect(context.player2).toBeActivePlayer();
                expect(context.devastatorInescapable.damage).toBe(3);
            });

            it('should not be able to exhaust another friendly unit if all are already exhausted', async function () {
                await contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        groundArena: [{ card: 'battlefield-marine', exhausted: true }, {
                            card: 'pyke-sentinel',
                            exhausted: true
                        }],
                        spaceArena: ['kihraxz-heavy-fighter']
                    },
                    player2: {
                        spaceArena: ['devastator#inescapable']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });
                const { context } = contextRef;

                context.player1.clickCard(context.kihraxzHeavyFighter);
                // context.player1.clickPrompt('Exhaust another unit.');
                expect(context.devastatorInescapable.damage).toBe(3);
                expect(context.player2).toBeActivePlayer();
            });
        });
    });
});
