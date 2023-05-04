import { createStore, produce, SetStoreFunction } from 'solid-js/store';
import { Container, Service } from 'typedi';
import { debounceLeading } from '../../helper/debounceHelper';
import { getStorage } from '../internal/localStorageService';

import { initialState, IState } from './initialState';

@Service()
export class StateService {
    private _internalState: IState;
    private _internalStateFunc: SetStoreFunction<IState>;
    private _stateKey = 'poke-living-dex';

    constructor() {
        const localInitialState = getStorage().get<IState>(this._stateKey) ?? initialState;
        const [state, setState] = createStore<IState>(localInitialState);
        this._internalState = state;
        this._internalStateFunc = setState;
    }

    getState = () => this._internalState;
    setState = (fn: (state: IState) => void) => this._internalStateFunc((currState: IState) => {
        const newStateFunc = produce(fn);
        const newState = newStateFunc(currState);

        this.saveToLocalStorage(newState);
        return newState;
    });

    saveToLocalStorage = debounceLeading((newState: IState) => {
        getStorage().set(this._stateKey, newState);
    }, 250);
}

export const getStateService = () => Container.get(StateService);
