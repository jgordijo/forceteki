import { BaseCard } from './BaseCard';
import { EventCard } from './EventCard';
import { LeaderCard } from './LeaderCard';
import { LeaderUnitCard } from './LeaderUnitCard';
import { NonLeaderUnitCard } from './NonLeaderUnitCard';
import { TokenUnitCard, TokenUpgradeCard } from './TokenCards';
import { UpgradeCard } from './UpgradeCard';

export type UnitCard =
    NonLeaderUnitCard |
    LeaderUnitCard |
    TokenUnitCard;

export type TokenCard =
    TokenUpgradeCard |
    TokenUnitCard;

export type CardWithDamageProperty =
    NonLeaderUnitCard |
    LeaderUnitCard |
    TokenUnitCard |
    BaseCard;

export type CardWithPrintedHp =
    NonLeaderUnitCard |
    LeaderUnitCard |
    TokenUnitCard |
    BaseCard |
    UpgradeCard |
    TokenUpgradeCard;

export type CardWithPrintedPower =
    NonLeaderUnitCard |
    LeaderUnitCard |
    TokenUnitCard |
    UpgradeCard |
    TokenUpgradeCard;

export type CardWithTriggeredAbilities = InPlayCard;
export type CardWithConstantAbilities = InPlayCard;

export type CardWithExhaustProperty = PlayableOrDeployableCard;

export type AnyCard =
    BaseCard |
    EventCard |
    UpgradeCard |
    TokenUpgradeCard |
    LeaderCard |
    NonLeaderUnitCard |
    LeaderUnitCard |
    TokenUnitCard;

// Base is the only type of card that isn't in the PlayableOrDeployable subclass
type PlayableOrDeployableCard = Exclude<AnyCard, BaseCard>;

type InPlayCard = Exclude<AnyCard, BaseCard | EventCard>;
