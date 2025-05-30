import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { AbilityType, WildcardRelativePlayer } from '../../../core/Constants';

export default class TraceMartezTrustingSister extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '2532510371',
            internalName: 'trace-martez#trusting-sister',
        };
    }

    public override setupCardAbilities () {
        this.addPilotingGainAbilityTargetingAttached({
            type: AbilityType.Triggered,
            title: 'Heal 2 total damage from any number of units',
            when: {
                onAttack: true,
            },
            immediateEffect: AbilityHelper.immediateEffects.distributeHealingAmong({
                amountToDistribute: 2,
                controller: WildcardRelativePlayer.Any,
                canChooseNoTargets: true,
                canDistributeLess: false,
                cardCondition: (card) => card.isUnit()
            })
        });
    }
}