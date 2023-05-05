import Swal, { SweetAlertInput } from "sweetalert2";
import { timeout } from "./asyncHelper";
import { copyTextToClipboard } from "./browserHelper";

export interface IConfirmationPopupProps {
    title: string;
    description?: string;
    confirmButtonText: string;
}
export const confirmationPopup = async (props: IConfirmationPopupProps): Promise<boolean> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        text: props.description,
        showCancelButton: true,
        confirmButtonText: props.confirmButtonText,
    });

    const { isConfirmed } = await firstSwalPromise;

    return isConfirmed;
}


export interface ICopyPopupProps {
    title: string;
    description: string;
    textToCopy: string;
}
export const CopyPopup = async (props: ICopyPopupProps): Promise<any> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        text: props.description,
        showCancelButton: true,
        confirmButtonText: 'Copy',
    });

    const { isConfirmed } = await firstSwalPromise;

    if (isConfirmed) {
        copyTextToClipboard(props.textToCopy);
    }
}

export interface IErrorPopupProps {
    title: string;
    description: string;
    onConfirm?: () => void;
}
export const errorPopup = async (props: IErrorPopupProps): Promise<any> => {

    const { isConfirmed } = await Swal.fire({
        icon: 'error',
        title: props.title,
        text: props.description,
    });

    if (isConfirmed && props.onConfirm != null) {
        props.onConfirm();
    }
}

export interface IStringInputPopupProps {
    title: string;
    input: SweetAlertInput | undefined;
    inputValue?: string;
    focusOnInput?: boolean;
}
export const stringInputPopup = async (props: IStringInputPopupProps): Promise<string> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        input: props.input,
        inputValue: props.inputValue ?? '',
        showCancelButton: true,
        inputAttributes: props.focusOnInput !== true ? undefined : {
            autofocus: 'true'
        }
    });

    if (props.focusOnInput) {
        await timeout(300);
        let queryStr = 'input.swal2-input';
        if (props.input == 'textarea') queryStr = 'textarea.swal2-textarea';
        const swalInput: any = document.querySelector(queryStr);
        swalInput?.focus?.();
    }
    const { value } = await firstSwalPromise;

    return value;
}
