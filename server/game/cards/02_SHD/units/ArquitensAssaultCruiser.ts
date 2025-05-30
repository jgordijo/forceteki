import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { DefeatCardSystem } from '../../../gameSystems/DefeatCardSystem';

export default class ArquitensAssaultCruiser extends NonLeaderUnitCard {
    protected override getImplementationId() {
        return {
            id: '1086021299',
            internalName: 'arquitens-assault-cruiser',
        };
    }

    public override setupCardAbilities() {
        this.addTriggeredAbility({
            title: 'Put the defeated unit into play as a resource under your control',
            when: {
                onCardDefeated: (event, context) =>
                    event.isDefeatedByAttacker &&
                    event.card.isNonLeaderUnit() &&
                    DefeatCardSystem.defeatSourceCard(event) === context.source
            },
            immediateEffect: AbilityHelper.immediateEffects.resourceCard((context) => ({ target: context.event.card }))
        });
    }
}
