import { Image } from "@hope-ui/solid";
import { Component } from "solid-js";

interface IProps {
    src: string;
    class: string;
    height: string;
}

// Kept getting a nonsense warning from HopeUI, this a dirty hack
export const CustomImage: Component<IProps | any> = (props: IProps | any) => {
    return (
        <Image
            {...props}
        />
    );
}
