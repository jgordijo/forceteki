import { CardType } from '../Constants';
import type { Player } from '../Player';
import * as Contract from '../utils/Contract';
import { BaseCard } from './BaseCard';
import { Card } from './Card';
import { EventCard } from './EventCard';
import { NonLeaderUnitCard } from './NonLeaderUnitCard';
import { TokenUnitCard, TokenUpgradeCard } from './TokenCards';
import { UpgradeCard } from './UpgradeCard';
import { LeaderUnitCard } from './LeaderUnitCard';
import type { ICardDataJson } from '../../../utils/cardData/CardDataInterfaces';


/**
 * Create a default implementation for a card from cardData by calling the appropriate
 * derived class constructor based on the card type
 */
export function createUnimplementedCard(owner: Player, cardData: ICardDataJson): Card {
    Contract.assertNotNullLike(cardData?.types);
    const cardType = Card.buildTypeFromPrinted(cardData.types);

    switch (cardType) {
        case CardType.Event:
            return new EventCard(owner, cardData);
        case CardType.Base:
            return new BaseCard(owner, cardData);
        case CardType.BasicUpgrade:
            return new UpgradeCard(owner, cardData);
        case CardType.Leader:
            return new LeaderUnitCard(owner, cardData);
        case CardType.BasicUnit:
            return new NonLeaderUnitCard(owner, cardData);
        case CardType.TokenUnit:
            return new TokenUnitCard(owner, cardData);
        case CardType.TokenUpgrade:
            return new TokenUpgradeCard(owner, cardData);
        default:
            throw new Error(`Unexpected card type: ${cardType}`);
    }
}