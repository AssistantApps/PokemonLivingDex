export interface ITypesEffectiveness {
    name: string;
    value: number;
}

export const typesEffectiveness = (): Array<ITypesEffectiveness> => [
    { name: 'normal', value: 1 },
    { name: 'fighting', value: 1 },
    { name: 'flying', value: 1 },
    { name: 'poison', value: 1 },
    { name: 'ground', value: 1 },
    { name: 'rock', value: 1 },
    { name: 'bug', value: 1 },
    { name: 'ghost', value: 1 },
    { name: 'steel', value: 1 },
    { name: 'fire', value: 1 },
    { name: 'water', value: 1 },
    { name: 'grass', value: 1 },
    { name: 'electric', value: 1 },
    { name: 'psychic', value: 1 },
    { name: 'ice', value: 1 },
    { name: 'dragon', value: 1 },
    { name: 'dark', value: 1 },
    { name: 'fairy', value: 1 },
];