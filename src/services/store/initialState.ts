import { TutorialState } from "../../constants/enum/tutorialState";
import { IPokeDexState } from "./sections/pokedexState";
import { ISidebarState } from "./sections/sidebarState";
import { ITutorialState } from "./sections/tutorialState";

export interface IState {
    sidebar: ISidebarState;
    pokedex: IPokeDexState;
    tutorial: ITutorialState;
}

export const initialState: IState = {
    sidebar: {
        isOpen: true,
    },
    pokedex: {
        owned: [],
        shiny: [],
        games: [],
    },
    tutorial: {
        state: TutorialState.NotStarted,
    }
}
