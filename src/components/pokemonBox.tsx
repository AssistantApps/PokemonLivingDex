import { Box, Grid, Heading, Text } from "@hope-ui/solid";
import classNames from "classNames";
import { Component, For, Show } from "solid-js";

import { LivingDexMode } from "../constants/enum/livingDexMode";
import { IMeta } from "../contracts/meta";
import { IPokeDexByRegion } from "../contracts/pokedexByRegion";
import { IPokemon } from "../contracts/pokemonByGame";
import { IPokemonInBox } from "../contracts/pokemonInBox";
import { PokemonBoxItem } from "./pokemonBoxItem";

interface IProps extends IPokemonInBox {
    meta: IMeta;
    owned: Array<string>;
    shiny: Array<string>;
    mode: LivingDexMode;
    pokemonId?: string;
    pokedexByRegion: Array<IPokeDexByRegion>;
    selectedPokedexes: Array<string>;
    addOrRemoveFromOwned: (ids: Array<string>) => void
    addOrRemoveFromShiny: (ids: Array<string>) => void;
    showInfoBox: (ids: string) => void;
}

export const PokemonBox: Component<IProps> = (props: IProps) => {

    const getNumberofOwned = (pokemon: Array<IPokemon>) => {
        const ownedPkmn: Array<string> = [];
        const notOwnedPkmn: Array<string> = [];

        for (const pkmn of pokemon) {
            const exists = props.owned.find(o => o.includes(pkmn.id)) != null;
            if (exists) {
                ownedPkmn.push(pkmn.id);
            }
            else {
                notOwnedPkmn.push(pkmn.id);
            }
        }

        const complete = ownedPkmn.length == pokemon.length;
        return (
            <Text
                class={classNames('extra', { complete })}
                onClick={() => props.addOrRemoveFromOwned(complete ? ownedPkmn : notOwnedPkmn)}
            >
                {`${ownedPkmn.length} / ${pokemon.length}`}
            </Text>
        );
    }

    return (
        <Box
            id={(`${props.name}-${props.boxNum}`).toLocaleLowerCase()}
            class="pkm-box"
            border="1px solid $neutral5"
            p="$4"
            borderTopRadius="$lg"
            borderBottomRadius="$lg"
            overflowY="auto"
        >
            <Box class="header">
                <Heading textAlign="center" pb="1em">{props.name} {props.boxNum}</Heading>
                <Show when={props.mode == LivingDexMode.tracking}>
                    {getNumberofOwned(props.pokemon)}
                </Show>
            </Box>
            <Grid class="content" templateColumns="repeat(6, 1fr)" gap="0.1em">
                <For each={props.pokemon}>
                    {(pkm) => (
                        <PokemonBoxItem
                            {...pkm}
                            meta={props.meta}
                            owned={props.owned}
                            shiny={props.shiny}
                            mode={props.mode}
                            pokemonId={props.pokemonId}
                            pokedexByRegion={props.pokedexByRegion}
                            selectedPokedexes={props.selectedPokedexes}
                            addOrRemoveFromOwned={props.addOrRemoveFromOwned}
                            addOrRemoveFromShiny={props.addOrRemoveFromShiny}
                            showInfoBox={props.showInfoBox}
                        />
                    )}
                </For>
            </Grid>
        </Box>
    );
}