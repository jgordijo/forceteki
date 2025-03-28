import type { AbilityContext } from '../core/ability/AbilityContext';
import { TokenUpgradeName } from '../core/Constants';
import type { IGiveTokenUpgradeProperties } from './GiveTokenUpgradeSystem';
import { GiveTokenUpgradeSystem } from './GiveTokenUpgradeSystem';

export type IGiveShieldProperties = Omit<IGiveTokenUpgradeProperties, 'tokenType'> & {
    highPriorityRemoval?: boolean;
};

export class GiveShieldSystem<TContext extends AbilityContext = AbilityContext> extends GiveTokenUpgradeSystem<TContext> {
    public override readonly name = 'give shield';

    protected override getTokenType() {
        return TokenUpgradeName.Shield;
    }

    protected override generateToken(context: TContext) {
        const { highPriorityRemoval } = this.generatePropertiesFromContext(context) as IGiveShieldProperties;
        return context.game.generateToken(context.player, this.getTokenType(), { highPriorityRemoval });
    }
}
