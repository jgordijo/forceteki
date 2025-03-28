import AbilityHelper from '../../../AbilityHelper';
import { NonLeaderUnitCard } from '../../../core/card/NonLeaderUnitCard';
import { KeywordName, Trait } from '../../../core/Constants';

export default class BunkerDefender extends NonLeaderUnitCard {
    protected override getImplementationId () {
        return {
            id: '8248876187',
            internalName: 'bunker-defender'
        };
    }

    public override setupCardAbilities () {
        this.addConstantAbility({
            title: 'While you control a Vehicle unit, this unit gains Sentinel',
            condition: (context) => context.player.isTraitInPlay(Trait.Vehicle),
            matchTarget: (card, context) => card === context.source,
            ongoingEffect: AbilityHelper.ongoingEffects.gainKeyword(KeywordName.Sentinel)
        });
    }
}
