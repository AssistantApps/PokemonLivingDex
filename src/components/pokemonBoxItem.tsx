import { Box, Image } from "@hope-ui/solid";
import classNames from "classNames";
import { Component, Show, createEffect, createSignal } from "solid-js";

import { LivingDexMode } from "../constants/enum/livingDexMode";
import { IMeta } from "../contracts/meta";
import { IPokeDexByRegion } from "../contracts/pokedexByRegion";
import { IPokemon } from "../contracts/pokemonByGame";
import { preventDefault } from "../helper/documentHelper";
import { PokemonSpriteImage } from "./pokemonSpriteImage";

interface IProps extends IPokemon {
    meta: IMeta;
    owned: Array<string>;
    shiny: Array<string>;
    mode: LivingDexMode;
    pokemonId: string | undefined;
    pokedexByRegion: Array<IPokeDexByRegion>;
    selectedPokedexes: Array<string>;
    addOrRemoveFromOwned: (ids: Array<string>) => void
    addOrRemoveFromShiny: (ids: Array<string>) => void;
    showInfoBox: (ids: string) => void;
}

const defaultImgUrl = '/assets/img/pokeball-loader.png';

export const PokemonBoxItem: Component<IProps> = (props: IProps) => {

    const [isOwned, setIsOwned] = createSignal<boolean>(false);
    const [isShiny, setIsShiny] = createSignal<boolean>(false);
    const [imgUrl, setImgUrl] = createSignal<string | undefined>(defaultImgUrl);

    createEffect(() => {
        switch (props.mode) {
            case LivingDexMode.finding:
                setIsOwned(props.id == props.pokemonId);
                setIsShiny(false);
                break;
            case LivingDexMode.tracking:
                setIsOwned(props.owned.includes(props.id));
                setIsShiny(props.shiny.includes(props.id));
                break;
            case LivingDexMode.latestGame:
                setIsOwned(true);
                break;
        }

        switch (props.mode) {
            case LivingDexMode.finding:
            case LivingDexMode.tracking:
                setImgUrl(undefined);
                break;
            case LivingDexMode.latestGame:
                const pokeDexi = props.pokedexByRegion
                    .filter(pd => props.selectedPokedexes.includes(pd.game))
                    .filter(pd => pd.pokemon.includes(props.id));
                if (pokeDexi.length < 1) {
                    setImgUrl(defaultImgUrl);
                    return;
                }

                const last = pokeDexi.slice(-1);
                setImgUrl(`/assets/img/game/${last[0].icon}.png`);
                break;
        }
    });

    const getBulbaUrl = (name: string) => {
        const localName = name.replaceAll('-', '_');
        return `https://bulbapedia.bulbagarden.net/wiki/${localName}`;
    }

    const onClick = (id: string) => (e: any) => {
        preventDefault(e);
        if (props.mode == LivingDexMode.finding) {
            props.showInfoBox(id);
        }
        if (props.mode == LivingDexMode.tracking) {
            props.addOrRemoveFromOwned([id]);
        }
        if (props.mode == LivingDexMode.latestGame) {
            props.showInfoBox(id);
        }
    }

    const onContextMenu = (id: string) => (e: any) => {
        preventDefault(e);
        if (props.mode == LivingDexMode.finding) {
            props.showInfoBox(id);
        }
        if (props.mode == LivingDexMode.tracking) {
            props.addOrRemoveFromShiny([id]);
        }
        if (props.mode == LivingDexMode.latestGame) {
            window.open(getBulbaUrl(props.name), "_blank");
        }
    }

    return (
        <a
            href={getBulbaUrl(props.name)}
            onClick={onClick(props.id)}
            onContextMenu={onContextMenu(props.id)}
            class={classNames('box-item', {
                'owned': isOwned(),
                'shiny': isShiny(),
            })}
            title={props.name}
            target="_blank" rel="noopener noreferrer"
        >
            <Show
                when={imgUrl() == null}
                fallback={
                    <Image
                        src={imgUrl()}
                        alt={props.id}
                        fallback={<Image src={defaultImgUrl} height="100%" />}
                    />
                }
            >
                <PokemonSpriteImage
                    meta={props.meta}
                    col={props.col}
                    row={props.row}
                />
            </Show>
        </a>
    );
}