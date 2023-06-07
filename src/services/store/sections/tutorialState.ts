import { TutorialState } from "../../../constants/enum/tutorialState";
import { IState, initialState } from "../initialState";
import { StateService } from "../stateService";

export interface ITutorialState {
    state: TutorialState;
}

const handleEmptySection = (state: IState) => {
    if (state.tutorial == null) state.tutorial = initialState.tutorial;
}

export const getTutorialState = (stateService: StateService): [state: () => TutorialState, setState: (state: TutorialState) => void] => [
    () => stateService.getState().tutorial?.state ?? initialState.tutorial.state,
    (newState: TutorialState) => stateService.setState(s => {
        handleEmptySection(s);
        s.tutorial.state = newState;
    }),
];