import type { AbilityContext } from '../../ability/AbilityContext';
import type { FormatMessage } from '../../chat/GameChat';
import type { Duration, EffectName } from '../../Constants';

export abstract class OngoingEffectImpl<TValue> {
    public duration?: Duration = null;
    public isConditional = false;
    protected context?: AbilityContext = null;

    public constructor(public readonly type: EffectName) {
    }

    public get effectDescription(): FormatMessage | undefined {
        return undefined;
    }

    // TODO: add type union in constants.ts for ability targets (player or card, anything else?)
    public abstract getValue(target?): TValue;
    public abstract apply(target): void;
    public abstract unapply(target): void;
    public abstract recalculate(target): boolean;

    public setContext(context: AbilityContext): void {
        this.context = context;
    }

    public getDebugInfo() {
        return {
            type: this.type
        };
    }
}
