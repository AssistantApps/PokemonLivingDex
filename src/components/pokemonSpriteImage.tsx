import { Box } from "@hope-ui/solid";
import { Component } from "solid-js";

import { IMeta } from "../contracts/meta";

interface IProps {
    meta: IMeta;
    col: number;
    row: number;
}

export const PokemonSpriteImage: Component<IProps> = (props: IProps) => {
    return (
        <Box class="pokemon-sprite-item" style={{
            'width': `${props.meta.itemWidth}px`,
            'height': `${props.meta.itemWidth}px`,
            'background-position-x': `${(props.col * (-props.meta.itemWidth))}px`,
            'background-position-y': `${(props.row * (-props.meta.itemWidth))}px`,
        }}></Box>
    );
}