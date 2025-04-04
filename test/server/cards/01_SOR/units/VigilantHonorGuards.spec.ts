describe('Vigilant Honor Guards', function() {
    integration(function(contextRef) {
        describe('Vigilant Honor Guards\' ability', function() {
            beforeEach(function () {
                return contextRef.setupTestAsync({
                    phase: 'action',
                    player1: {
                        groundArena: ['consular-security-force']
                    },
                    player2: {
                        groundArena: ['vigilant-honor-guards'],
                        hand: ['repair']
                    },

                    // IMPORTANT: this is here for backwards compatibility of older tests, don't use in new code
                    autoSingleTarget: true
                });
            });

            it('should give it sentinel only as long as it is undamaged', function () {
                const { context } = contextRef;

                context.player1.clickCard(context.consularSecurityForce);
                // Honor Guards automatically selected due to sentinel
                expect(context.player2).toBeActivePlayer();
                expect(context.vigilantHonorGuards.damage).toBe(3);
                expect(context.consularSecurityForce.damage).toBe(4);

                context.player2.passAction();
                context.readyCard(context.consularSecurityForce);

                context.player1.clickCard(context.consularSecurityForce);
                expect(context.player1).toBeAbleToSelectExactly([context.vigilantHonorGuards, context.p2Base]); // no sentinel
                context.player1.clickCard(context.p2Base);

                // checking if they regain sentinel when fully healed
                context.player2.clickCard(context.repair);
                context.player2.clickCard(context.vigilantHonorGuards);
                expect(context.vigilantHonorGuards.damage).toBe(0);

                context.readyCard(context.consularSecurityForce);

                context.player1.clickCard(context.consularSecurityForce);
                // Honor Guards automatically selected due to sentinel
                expect(context.player2).toBeActivePlayer();
                expect(context.vigilantHonorGuards.damage).toBe(3);
                expect(context.consularSecurityForce).toBeInZone('discard');
            });
        });
    });
});
