const { color } = require('console-log-colors');

const mockCards = [
    buildMockCard({
        title: 'Aggression Force Base',
        hp: 28,
        hasNonKeywordAbility: true,
        aspects: ['aggression'],
        types: ['base'],
        setId: {
            set: 'LOF',
            number: 25
        },
        unique: false,
        internalName: 'aggression-force-base'
    }),
    buildMockCard({
        title: 'Cunning Force Base',
        hp: 28,
        hasNonKeywordAbility: true,
        aspects: ['cunning'],
        types: ['base'],
        setId: {
            set: 'LOF',
            number: 27
        },
        unique: false,
        internalName: 'cunning-force-base'
    }),
    buildMockCard({
        title: 'Anakin Skywalker, Champion of Mortis',
        hp: 7,
        power: 5,
        hasNonKeywordAbility: true,
        aspects: ['vigilance'],
        types: ['unit'],
        traits: ['force', 'jedi', 'republic'],
        setId: {
            set: 'LOF',
            number: 70
        },
        cost: 6,
        arena: 'ground',
        unique: true,
        internalName: 'anakin-skywalker#champion-of-mortis'
    }),
    buildMockCard({
        title: 'Darth Tyranus, Servant of Sidious',
        hp: 3,
        power: 4,
        hasNonKeywordAbility: true,
        aspects: ['villainy'],
        types: ['unit'],
        traits: ['force', 'separatist', 'sith'],
        setId: {
            set: 'LOF',
            number: 231
        },
        cost: 4,
        unique: true,
        arena: 'ground',
        keywords: ['shielded'],
        internalName: 'darth-tyranus#servant-of-sidious'
    }),
    buildMockCard({
        title: 'Constructed Lightsaber',
        hp: 3,
        power: 2,
        upgradeHp: 3,
        upgradePower: 2,
        hasNonKeywordAbility: true,
        aspects: [],
        types: ['upgrade'],
        traits: ['item', 'weapon', 'lightsaber'],
        setId: {
            set: 'LOF',
            number: 261
        },
        cost: 3,
        unique: false,
        internalName: 'constructed-lightsaber'
    }),
    buildMockCard({
        title: 'Dume, Redeem the Future',
        power: 2,
        hp: 7,
        hasNonKeywordAbility: true,
        aspects: ['vigilance', 'vigilance'],
        types: ['unit'],
        traits: ['force', 'creature'],
        setId: {
            set: 'LOF',
            number: 55
        },
        cost: 4,
        unique: true,
        arena: 'ground',
        internalName: 'dume#redeem-the-future'
    }),
    buildMockCard({
        title: 'Nightsister Warrior',
        power: 2,
        hp: 2,
        hasNonKeywordAbility: true,
        aspects: ['vigilance'],
        types: ['unit'],
        traits: ['force', 'night'],
        setId: {
            set: 'LOF',
            number: 59
        },
        cost: 2,
        unique: false,
        arena: 'ground',
        internalName: 'nightsister-warrior'
    }),
    buildMockCard({
        title: 'Malakili, Loving Rancor Keeper',
        power: 1,
        hp: 4,
        hasNonKeywordAbility: true,
        aspects: ['command'],
        types: ['unit'],
        traits: ['underworld'],
        setId: {
            set: 'LOF',
            number: 108
        },
        cost: 2,
        unique: true,
        arena: 'ground',
        internalName: 'malakili#loving-rancor-keeper'
    }),
    buildMockCard({
        title: 'Mind Trick',
        hasNonKeywordAbility: true,
        aspects: ['cunning', 'heroism'],
        types: ['event'],
        traits: ['force', 'trick'],
        setId: {
            set: 'LOF',
            number: 202
        },
        cost: 2,
        unique: false,
        internalName: 'mind-trick'
    }),
    buildMockCard({
        title: 'Curious Flock',
        power: 1,
        hp: 1,
        hasNonKeywordAbility: true,
        aspects: [],
        types: ['unit'],
        traits: ['creature'],
        setId: {
            set: 'LOF',
            number: 255
        },
        cost: 1,
        unique: false,
        arena: 'ground',
        internalName: 'curious-flock'
    })
];

/** @param {{ title: string, subtitle: string?, hasNonKeywordAbility: boolean, cost: number?, hp: number?, arena?: string, unique: boolean, upgradeHp: number?, upgradePower: number?, aspects: string[]?, traits: string[]?, keywords: string[]?, types: string[], setId: { set: string, number: number }, internalName: string }} cardData */
function buildMockCard(cardData) {
    let textElements = [];
    if (cardData.keywords) {
        const capitalizedKeywords = cardData.keywords?.map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1));
        textElements.push(...capitalizedKeywords);
    }
    if (cardData.hasNonKeywordAbility) {
        textElements.push('mock ability text');
    }

    return {
        title: cardData.title,
        subtitle: cardData.subtitle || '',
        cost: cardData.cost || null,
        hp: cardData.hp || null,
        power: cardData.power || null,
        text: textElements.join('\n'),
        deployBox: null,
        epicAction: '',
        unique: cardData.unique,
        rules: null,
        reprints: {
            data: []
        },
        upgradePower: cardData.upgradePower || null,
        upgradeHp: cardData.upgradeHp || null,
        id: cardData.internalName + '-id',
        aspects: cardData.aspects || [],
        traits: cardData.traits || [],
        keywords: cardData.keywords || [],
        types: cardData.types,
        setId: cardData.setId,
        internalName: cardData.internalName,
        arena: cardData.arena || null,
    };
}

function buildSetStr(card) {
    return `${card.setId.set}_${card.setId.number}`;
}

function addMockCards(cards) {
    const setIds = new Set();
    const mockCardNames = [];

    for (const card of cards) {
        setIds.add(buildSetStr(card));
    }

    for (const card of mockCards) {
        const setStr = buildSetStr(card);

        if (setIds.has(setStr)) {
            console.log(color(`\nCard '${setStr}' found in official data. The mock can now be safely removed from mockdata.js\n`, 'yellow'));
        } else {
            cards.push(card);
            mockCardNames.push(card.internalName);
        }
    }

    return mockCardNames;
}

module.exports = { addMockCards };
