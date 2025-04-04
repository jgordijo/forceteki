describe('Tactical Advantage', function () {
    integration(function (contextRef) {
        describe('Tactical Advantage\'s ability', function () {
            beforeEach(function () {
                return contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        hand: ['tactical-advantage'],
                        groundArena: ['pyke-sentinel']
                    },
                    player2: {
                        groundArena: ['wampa']
                    }
                });
            });

            it('can buff a unit', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.tacticalAdvantage);
                expect(context.player1).toBeAbleToSelectExactly([context.pykeSentinel, context.wampa]);
                expect(context.player1).toHaveEnabledPromptButton('Cancel');

                context.player1.clickCard(context.pykeSentinel);
                expect(context.pykeSentinel.getPower()).toBe(4);
                expect(context.pykeSentinel.getHp()).toBe(5);

                context.player2.clickCard(context.wampa);
                context.player2.clickCard(context.pykeSentinel);
                expect(context.wampa.damage).toBe(4);
                expect(context.pykeSentinel.damage).toBe(4);
                expect(context.pykeSentinel).toBeInZone('groundArena');
            });
        });
    });
});
