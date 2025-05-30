describe('Black Squadron Scout Wing', function() {
    integration(function(contextRef) {
        it('Black Squadron Scout Wing\'s ability should attack when an upgrade is played on this unit giving it a +1/0 for this attack', async function () {
            await contextRef.setupTestAsync({
                phase: 'action',
                player1: {
                    hand: ['academy-training', 'armed-to-the-teeth'],
                    spaceArena: ['black-squadron-scout-wing']
                },
                player2: {
                    hand: ['bounty-hunters-quarry']
                }
            });

            const { context } = contextRef;

            context.player1.clickCard(context.academyTraining);
            context.player1.clickCard(context.blackSquadronScoutWing);

            expect(context.player1).toHavePassAbilityPrompt('Attack with this unit. It gets +1/+0 for this attack.');

            context.player1.clickPrompt('Trigger');
            context.player1.clickCard(context.p2Base);

            // Player 2's base should have 7 damage (4 from Black Squadron Scout Wing + 2 from Academy Training + 1 from card text)
            expect(context.p2Base.damage).toBe(7);
            expect(context.blackSquadronScoutWing).toHaveExactUpgradeNames(['academy-training']);
            expect(context.player2).toBeActivePlayer();

            // Should not be able to attack when Black Squadron Scout Wing is exhausted
            context.moveToNextActionPhase();
            context.exhaustCard(context.blackSquadronScoutWing);

            context.player1.clickCard(context.armedToTheTeeth);
            context.player1.clickCard(context.blackSquadronScoutWing);

            expect(context.blackSquadronScoutWing).toHaveExactUpgradeNames(['academy-training', 'armed-to-the-teeth']);
            expect(context.player2).toBeActivePlayer();

            // Should not attach when an upgrade is played by another player
            context.moveToNextActionPhase();
            context.player1.passAction();
            context.player2.clickCard(context.bountyHuntersQuarry);
            context.player2.clickCard(context.blackSquadronScoutWing);

            expect(context.blackSquadronScoutWing).toHaveExactUpgradeNames(['academy-training', 'armed-to-the-teeth', 'bounty-hunters-quarry']);
            expect(context.player1).toBeActivePlayer();
        });

        it('Black Squadron Scout Wing\'s ability should trigger when played an upgrade owned by the opponent', async function () {
            await contextRef.setupTestAsync({
                phase: 'action',
                player1: {
                    hand: ['takedown', 'a-fine-addition'],
                    spaceArena: ['black-squadron-scout-wing']
                },
                player2: {
                    groundArena: ['battlefield-marine'],
                    discard: ['twin-laser-turret'],
                }
            });

            const { context } = contextRef;

            context.player1.clickCard(context.takedown);
            context.player1.clickCard(context.battlefieldMarine);

            context.player2.passAction();

            context.player1.clickCard(context.aFineAddition);
            context.player1.clickCard(context.twinLaserTurret);
            context.player1.clickCard(context.blackSquadronScoutWing);

            expect(context.player1).toHavePassAbilityPrompt('Attack with this unit. It gets +1/+0 for this attack.');

            context.player1.clickPrompt('Pass');

            expect(context.player2).toBeActivePlayer();
        });
    });
});
