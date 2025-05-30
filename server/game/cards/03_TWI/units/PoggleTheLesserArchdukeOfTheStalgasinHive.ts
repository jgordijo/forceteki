import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { CardType } from '../../../core/Constants';

export default class PoggleTheLesserArchdukeOfTheStalgasinHive extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '9610332938',
            internalName: 'poggle-the-lesser#archduke-of-the-stalgasin-hive',
        };
    }

    public override setupCardAbilities() {
        this.addTriggeredAbility({
            title: 'Exhaust this unit',
            when: {
                onCardPlayed: (event, context) =>
                    event.cardTypeWhenInPlay === CardType.BasicUnit &&
                    event.player === context.player &&
                    event.card !== context.source
            },
            optional: true,
            immediateEffect: AbilityHelper.immediateEffects.exhaust(),
            ifYouDo: {
                title: 'Create a Battle Droid token',
                immediateEffect: AbilityHelper.immediateEffects.createBattleDroid()
            }
        });
    }
}

