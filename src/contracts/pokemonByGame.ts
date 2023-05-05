export interface IPokemonByGame {
    id: string;
    name: string;
    pokemon: Array<IPokemon>;
}

export interface IPokemon {
    id: string;
    name: string;
    col: number;
    row: number;
    boxCol: number;
    boxRow: number;
}
