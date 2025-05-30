describe('Breaking In', function () {
    integration(function (contextRef) {
        it('Breaking In\'s ability should initiate an attack and give +2/+0 and Saboteur', async function () {
            await contextRef.setupTestAsync({
                phase: 'action',
                player1: {
                    hand: ['breaking-in'],
                    groundArena: ['battlefield-marine']
                },
                player2: {
                    groundArena: ['niima-outpost-constables']
                }
            });

            const { context } = contextRef;

            context.player1.clickCard(context.breakingIn);
            context.player1.clickCard(context.battlefieldMarine);

            expect(context.player1).toBeAbleToSelectExactly([context.niimaOutpostConstables, context.p2Base]);
            context.player1.clickCard(context.p2Base);
            expect(context.p2Base.damage).toBe(5);

            // second attack to confirm the effect is gone
            context.player2.passAction();
            context.readyCard(context.battlefieldMarine);
            context.player1.clickCard(context.battlefieldMarine);

            expect(context.player1).toBeAbleToSelectExactly([context.niimaOutpostConstables]);
            context.player1.clickCard(context.niimaOutpostConstables);
            expect(context.niimaOutpostConstables.damage).toBe(3);
        });
    });
});
