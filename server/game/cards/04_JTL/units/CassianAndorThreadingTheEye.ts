import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { AbilityType } from '../../../core/Constants';

export default class CassianAndorThreadingTheEye extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '3475471540',
            internalName: 'cassian-andor#threading-the-eye'
        };
    }

    public override setupCardAbilities() {
        this.addPilotingGainAbilityTargetingAttached({
            type: AbilityType.Triggered,
            title: 'Discard a card from the defending player\'s deck',
            when: {
                onAttack: true,
            },
            immediateEffect: AbilityHelper.immediateEffects.discardFromDeck((context) => ({
                amount: 1,
                target: context.source.activeAttack.getSingleTarget().controller
            })),
            ifYouDo: {
                title: 'Draw a card',
                ifYouDoCondition: (ifYouDoContext) => ifYouDoContext.events[0].card.cost <= 3,
                immediateEffect: AbilityHelper.immediateEffects.draw()
            }
        });
    }
}
