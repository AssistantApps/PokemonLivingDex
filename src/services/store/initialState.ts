import { IPokeDexState } from "./sections/pokedexState";
import { ISidebarState } from "./sections/sidebarState";

export interface IState {
    sidebar: ISidebarState;
    pokedex: IPokeDexState;
}

export const initialState: IState = {
    sidebar: {
        isOpen: true,
    },
    pokedex: {
        owned: [],
        shiny: [],
    }
}
