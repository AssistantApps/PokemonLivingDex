import { Box, Text } from "@hope-ui/solid";
import { Component } from "solid-js";
import { IMeta } from "../../../contracts/meta";
import { PokemonSpriteImage } from "../../pokemonSpriteImage";
import { IAutocompleteOption } from "../autocomplete";


export const PokemonAutocompleteTile: (meta: IMeta) => Component<IAutocompleteOption> = (meta: IMeta) => (props: IAutocompleteOption) => {

    const numCols = meta.totalColumns;
    const idInt = parseInt(props.value);
    const col = idInt % numCols;
    const row = Math.floor(idInt / numCols);

    return (
        <>
            <Box
                class="tile-img"
                borderRadius={5}
                ml="0.5em"
            >
                <PokemonSpriteImage
                    meta={meta}
                    col={col}
                    row={row}
                />
            </Box>
            <Text>{props.title}</Text>
        </>
    );
}