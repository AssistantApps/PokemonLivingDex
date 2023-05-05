import { IPokemon } from "./pokemonByGame";

export interface IPokemonInBox {
    id: string;
    name: string;
    boxNum: number;
    pokemon: Array<IPokemon>;
}
