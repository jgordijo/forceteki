import type Game from '../Game';
import type { Card } from '../card/Card';
import * as Contract from '../utils/Contract';
import { EffectName, KeywordName } from '../Constants';
import type { IAttackableCard } from '../card/CardInterfaces';
import type { IUnitCard } from '../card/propertyMixins/UnitProperties';


type StatisticTotal = number;

export class Attack {
    private readonly game: Game;
    public readonly attacker: IUnitCard;
    public readonly attackerInPlayId: number;
    public readonly isAmbush: boolean;
    public readonly target: IAttackableCard;
    public readonly targetInPlayId?: number;

    public previousAttack: Attack;

    public constructor(
        game: Game,
        attacker: IUnitCard,
        target: IAttackableCard,
        isAmbush: boolean = false
    ) {
        this.game = game;
        this.attacker = attacker;
        this.target = target;

        // we grab the in-play IDs of the attacker and defender cards in case other abilities need to refer back to them later.
        // e.g., to check if the defender was defeated
        this.attackerInPlayId = attacker.inPlayId;
        this.targetInPlayId = target.canBeInPlay() ? target.inPlayId : null;

        this.isAmbush = isAmbush;
    }

    public getAttackerTotalPower(): number | null {
        return this.getUnitPower(this.attacker);
    }

    public getTargetTotalPower(): number | null {
        return this.target.isBase()
            ? null
            : this.getUnitPower(this.target);
    }

    public hasOverwhelm(): boolean {
        return this.attacker.hasSomeKeyword(KeywordName.Overwhelm);
    }

    public attackerDealsDamageBeforeDefender(): boolean {
        return this.attacker.hasOngoingEffect(EffectName.DealsDamageBeforeDefender);
    }

    public isAttackerInPlay(): boolean {
        return this.attacker.isInPlay();
    }

    public isAttackTargetLegal(): boolean {
        return this.target.isBase() || this.target.isInPlay();
    }

    public isInvolved(card: Card): boolean {
        return (
            ([this.attacker as Card, this.target as Card].includes(card))
        );
    }

    // TODO: if we end up using this we need to refactor it to reflect attacks in SWU (i.e., show HP)
    public getTotalsForDisplay(): string {
        return `${this.attacker.name}: ${this.getAttackerTotalPower()} vs ${this.getTargetTotalPower()}: ${this.target.name}`;
    }

    private getUnitPower(involvedUnit: IUnitCard): StatisticTotal {
        Contract.assertTrue(involvedUnit.isInPlay(), `Unit ${involvedUnit.name} zone is ${involvedUnit.zoneName}, cannot participate in combat`);

        return involvedUnit.getPower();
    }
}
