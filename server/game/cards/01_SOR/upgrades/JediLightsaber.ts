import AbilityHelper from '../../../AbilityHelper';
import type { Attack } from '../../../core/attack/Attack';
import type { Card } from '../../../core/card/Card';
import { UpgradeCard } from '../../../core/card/UpgradeCard';
import { Trait } from '../../../core/Constants';

export default class JediLightsaber extends UpgradeCard {
    protected override getImplementationId() {
        return {
            id: '8495694166',
            internalName: 'jedi-lightsaber',
        };
    }

    public override setupCardAbilities() {
        this.setAttachCondition((card: Card) => !card.hasSomeTrait(Trait.Vehicle));

        this.addGainOnAttackAbilityTargetingAttached({
            title: 'Give the defender -2/-2 for this phase',
            gainCondition: (context) => context.source.parentCard?.hasSomeTrait(Trait.Force),

            // need to check if the target is a base - if so, don't apply the stat modifier effect
            immediateEffect: AbilityHelper.immediateEffects.conditional({
                condition: (context) => context.event.attack.targetIsUnit(),
                onTrue: AbilityHelper.immediateEffects.forThisPhaseCardEffect((context) => ({
                    effect: AbilityHelper.ongoingEffects.modifyStats({ power: -2, hp: -2 }),
                    target: (context.event.attack as Attack).getAllTargets()
                }))
            })
        });
    }
}
