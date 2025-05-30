import AbilityHelper from '../../../AbilityHelper';
import { CardType, KeywordName, RelativePlayer, ZoneName } from '../../../core/Constants';
import { EventCard } from '../../../core/card/EventCard';
import { ResolutionMode } from '../../../gameSystems/SimultaneousOrSequentialSystem';

export default class TimelyIntervention extends EventCard {
    protected override getImplementationId() {
        return {
            id: '6847268098',
            internalName: 'timely-intervention',
        };
    }

    public override setupCardAbilities() {
        this.setEventAbility({
            title: 'Play a unit from your hand. Give it ambush for this phase',
            cannotTargetFirst: true,
            targetResolver: {
                cardTypeFilter: CardType.BasicUnit,
                controller: RelativePlayer.Self,
                zoneFilter: ZoneName.Hand,
                immediateEffect: AbilityHelper.immediateEffects.simultaneous({
                    gameSystems: [
                        AbilityHelper.immediateEffects.playCardFromHand(),
                        AbilityHelper.immediateEffects.forThisPhaseCardEffect({
                            effect: AbilityHelper.ongoingEffects.gainKeyword(KeywordName.Ambush)
                        }),
                    ],
                    resolutionMode: ResolutionMode.AllGameSystemsMustBeLegal,
                })
            }
        });
    }
}
