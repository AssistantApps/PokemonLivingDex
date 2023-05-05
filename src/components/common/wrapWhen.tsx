import { Component, JSX, Show } from "solid-js";

interface IHasChildrenProps {
    children: JSX.Element;
}

interface IProps {
    condition: boolean;
    children: JSX.Element;
    wrapProps: any;
    wrapComp: Component<IHasChildrenProps>;
}

export const WrapWhen: Component<IProps> = (props: IProps) => {
    const WrapChild = props.wrapComp;
    return (
        <Show when={props.condition} fallback={props.children}>
            <WrapChild {...props.wrapProps}>
                {props.children}
            </WrapChild>
        </Show>
    );
}