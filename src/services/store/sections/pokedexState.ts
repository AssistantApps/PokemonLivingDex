import { IState, initialState } from "../initialState";
import { StateService } from "../stateService";

export interface IPokeDexState {
    owned: Array<string>;
    shiny: Array<string>;
}

const handleEmptySection = (state: IState) => {
    if (state.pokedex == null) state.pokedex = initialState.pokedex;
}

export const getOwned = (stateService: StateService): [state: () => Array<string>, setState: (state: Array<string>) => void] => [
    () => stateService.getState().pokedex?.owned ?? initialState.pokedex.owned,
    (owned: Array<string>) => stateService.setState(s => {
        handleEmptySection(s);
        s.pokedex.owned = owned;
    }),
];

export const getShiny = (stateService: StateService): [state: () => Array<string>, setState: (state: Array<string>) => void] => [
    () => stateService.getState().pokedex?.shiny ?? initialState.pokedex.shiny,
    (shiny: Array<string>) => stateService.setState(s => {
        handleEmptySection(s);
        s.pokedex.shiny = shiny;
    }),
];