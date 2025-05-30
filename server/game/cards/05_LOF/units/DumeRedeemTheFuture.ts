import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { PhaseName, Trait } from '../../../core/Constants';

export default class DumeRedeemTheFuture extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: 'dume#redeem-the-future-id',
            internalName: 'dume#redeem-the-future',
        };
    }

    public override setupCardAbilities() {
        this.addTriggeredAbility({
            title: 'Give an Experience token to each other friendly non-Vehicle unit.',
            when: {
                onPhaseStarted: (context) => context.phase === PhaseName.Regroup
            },
            immediateEffect: AbilityHelper.immediateEffects.giveExperience((context) => ({
                amount: 1,
                target: context.player.getArenaUnits({ otherThan: context.source, condition: (card) => !card.hasSomeTrait(Trait.Vehicle) })
            }))
        });
    }
}
