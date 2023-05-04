import { StateService } from "../stateService";

export interface ISidebarState {
    isOpen: boolean;
}

export const getSidebarIsOpen = (stateService: StateService): [state: () => boolean, setState: (state: boolean) => void] => [
    () => stateService.getState().sidebar.isOpen,
    (isOpen: boolean) => stateService.setState(s => s.sidebar.isOpen = isOpen),
];