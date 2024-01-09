import { Box, Button, Flex, HStack, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spacer, Text, VStack, classNames, createDisclosure, notificationService } from '@hope-ui/solid';
import { Link } from '@solidjs/router';
import { Component, For, Show, createSignal, onMount } from 'solid-js';

import { LivingDexMode } from '../constants/enum/livingDexMode';
import { NetworkState } from '../constants/enum/networkState';
import { livingDexModeOptions } from '../constants/livingDexModeOptions';
import { IMeta } from '../contracts/meta';
import { IPokeDexByRegion } from '../contracts/pokedexByRegion';
import { IPokemon } from '../contracts/pokemonByGame';
import { IPokemonInBox } from '../contracts/pokemonInBox';
import { timeout } from '../helper/asyncHelper';
import { initSticky, scrollIdIntoView } from '../helper/documentHelper';
import { capitalizeFirstLetter, getBulbaUrl } from '../helper/stringHelper';
import { anyObject } from '../helper/typescriptHacks';
import { getGames, getOwned, getShiny } from '../services/store/sections/pokedexState';
import { getStateService } from '../services/store/stateService';
import { Autocomplete } from './common/autocomplete';
import { PokemonAutocompleteTile } from './common/autocompleteTile/pokemonTile';
import { Dropdown, IDropdownOption } from './common/dropdown';
import { CenterLoading } from './core/loading';
import { PokemonBox } from './pokemonBox';

export const LivingDexLookup: Component = () => {
    const findPokemonDropdownId = 'find-pokemon';
    const latestGameDropdownId = 'latest-game';

    const stateServ = getStateService();
    const [owned, setOwned] = getOwned(stateServ);
    const [shiny, setShiny] = getShiny(stateServ);
    const [games, setGames] = getGames(stateServ);

    const { isOpen, onOpen, onClose } = createDisclosure();

    const [mode, setMode] = createSignal<LivingDexMode>(LivingDexMode.finding);
    const [networkState, setNetworkState] = createSignal<NetworkState>(NetworkState.Loading);

    const [meta, setMeta] = createSignal<IMeta>(anyObject);
    const [pokemonByGame, setPokemonByGame] = createSignal<Array<IPokemonInBox>>([]);
    const [pokedexByRegion, setPokedexByRegion] = createSignal<Array<IPokeDexByRegion>>([]);
    const [pokemonOptionsToDisplay, setPokemonOptionsToDisplay] = createSignal<Array<IDropdownOption>>([]);
    const [selectedPokemon, setSelectedPokemon] = createSignal<string>();
    const [selectedPokemonName, setSelectedPokemonName] = createSignal<string>();
    const [infoBoxPokedexs, setInfoBoxSelectedPokedexs] = createSignal<Array<IPokeDexByRegion>>([]);

    onMount(() => {
        const promiseArr: Array<Promise<any>> = [
            getMeta(),
            getAllData(),
            getAllPokeDexData(),
        ];
        Promise.all(promiseArr)
            .then(() => setNetworkState(NetworkState.Success))
            .then(() => initStickyForFindPokemonDropdown());
    });

    const initStickyForFindPokemonDropdown = async () => {
        await timeout(1000);
        initSticky([findPokemonDropdownId, latestGameDropdownId]);
    }

    const getMeta = async () => {
        const metaJson: string = '/assets/json/meta.json';
        const metaResp = await fetch(metaJson);
        const metaData = await metaResp.json();

        setMeta(metaData);
    }

    const getAllData = async () => {
        const pokemonByGameJson: string = '/assets/json/pokemonByGame.json';
        const allPokeResp = await fetch(pokemonByGameJson);
        const allPokeData = await allPokeResp.json();

        const boxes: Array<IPokemonInBox> = [];
        let allPokemon: Array<IDropdownOption> = [];
        for (const pkmByGame of allPokeData) {
            const chunkSize = 30;
            let boxNum = 0;
            for (let pkmIndex = 0; pkmIndex < pkmByGame.pokemon.length; pkmIndex += chunkSize) {
                const chunk: Array<IPokemon> = pkmByGame.pokemon.slice(pkmIndex, pkmIndex + chunkSize);
                boxNum++;

                boxes.push({
                    ...pkmByGame,
                    boxNum: boxNum,
                    pokemon: chunk,
                });
                allPokemon = [...allPokemon, ...chunk.map(c => ({
                    title: c.name,
                    value: c.id,
                }))]
            }
        }

        setPokemonByGame(boxes);
        setPokemonOptionsToDisplay(allPokemon);
    }

    const getAllPokeDexData = async () => {
        const pokemonByGameJson: string = '/assets/json/pokedexByGame.json';
        try {
            const allPokeResp = await fetch(pokemonByGameJson);
            const allPokeData: Array<IPokeDexByRegion> = await allPokeResp.json();

            setPokedexByRegion(allPokeData);

            if (games().length == 0) {
                setGames(allPokeData.map(pd => pd.game));
            }
        } catch (e) {
            setPokedexByRegion([]);
        }
    }

    const addOrRemoveFromGeneric = (currOwned: Array<string>, ids: Array<string>) => {
        const itemsToAdd: Array<string> = [];
        const itemsToRemove: Array<string> = [];

        for (const id of ids) {
            const isOwned = currOwned.includes(id);
            if (isOwned) {
                itemsToRemove.push(id);
            } else {
                itemsToAdd.push(id);
            }
        }

        const result = [
            ...currOwned.filter(i => itemsToRemove.includes(i) == false),
            ...itemsToAdd,
        ];

        return result;
    }

    const addOrRemoveFromOwned = (ids: Array<string>) => {
        const result = addOrRemoveFromGeneric(owned(), ids);
        setOwned(result);
    }

    const addOrRemoveFromShiny = (ids: Array<string>) => {
        const result = addOrRemoveFromGeneric(shiny(), ids);
        setShiny(result);
    }

    const showInfoBox = (id: string) => {
        const pokeDexi = pokedexByRegion().filter(pd => pd.pokemon.includes(id));
        const pokeDetails = pokemonOptionsToDisplay().find(po => po.value.includes(id));

        if (pokeDetails == null) return;

        setSelectedPokemon(pokeDetails.value);
        setSelectedPokemonName(pokeDetails.title);

        setInfoBoxSelectedPokedexs(pokeDexi);
        onOpen();
    }

    return (
        <>
            <Show when={networkState() == NetworkState.Error}>
                <h1>Error</h1>
            </Show>
            <Show when={networkState() == NetworkState.Loading}>
                <CenterLoading />
            </Show>
            <Show when={networkState() == NetworkState.Success}>
                <Flex class="controls" p="0.5em 1em" justifyContent="right">
                    <Flex flex={2} justifyContent="center" flexDirection="column" mb="1em">
                        <Dropdown
                            title="Dex mode"
                            onSelect={((value: any) => setMode(LivingDexMode[value] as any))}
                            placeholder={livingDexModeOptions[0].title}
                            options={livingDexModeOptions}
                        />
                    </Flex>
                    <Spacer flex={1} />
                    <Show when={mode() == LivingDexMode.tracking || mode() == LivingDexMode.finding}>
                        <Spacer flex={1} />
                        <Box id={findPokemonDropdownId} flex={2} maxWidth="500px">
                            <HStack>
                                <IconButton
                                    icon={
                                        <Image
                                            src="/assets/img/info.png"
                                            opacity={(selectedPokemon() == null) ? 0.2 : 1}
                                            alt="info"
                                            p="0.5em"
                                        />
                                    }
                                    disabled={selectedPokemon() == null}
                                    onClick={() => showInfoBox(selectedPokemon()!)}
                                    aria-label="info"
                                    mt="1.725em"
                                    mr="0.25em"
                                />
                                <Autocomplete
                                    placeholder="Pokemon"
                                    title="Find specific Pokémon's place in the Living Dex"
                                    options={pokemonOptionsToDisplay()}
                                    maxHeight="50vh"
                                    autocompleteTile={PokemonAutocompleteTile(meta())}
                                    searchFilter={(searchStr: string) => (p => p.title.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()))}
                                    selectedValues={selectedPokemonName() != null ? [capitalizeFirstLetter(selectedPokemonName()!)] : undefined}
                                    onSelectOptionMapper={(selectedOpts: string | Array<string>) => {
                                        const itemsToLookup: Array<string> = [];
                                        if (Array.isArray(selectedOpts) == false) {
                                            itemsToLookup.push(selectedOpts as any);
                                        }

                                        const result: Array<string> = [];
                                        for (const item of itemsToLookup) {
                                            const found = pokemonOptionsToDisplay().find(p => p.value == item);
                                            if (found == null) continue;

                                            result.push(found.title);
                                        }

                                        return result;
                                    }}
                                    onSelect={(value: string | string[]) => {
                                        const selectedPoke = pokemonOptionsToDisplay().find(p => p.value == value);
                                        if (selectedPoke == null) return;

                                        const pokeBox = pokemonByGame().filter(pd => pd.pokemon.find(p => p.id == selectedPoke.value) != null);
                                        if (pokeBox.length > 0) {
                                            const box = pokeBox[0];
                                            const poke = box.pokemon.find(p => p.id == selectedPoke.value);

                                            scrollIdIntoView(`${box.name}-${box.boxNum}`.toLocaleLowerCase());

                                            notificationService.show({
                                                render: (props) => (
                                                    <HStack
                                                        bg="$loContrast"
                                                        rounded="$md"
                                                        border="1px solid $neutral7"
                                                        shadow="$lg"
                                                        p="$4"
                                                        w="$full"
                                                    >
                                                        <Box>
                                                            {box.name} {box.boxNum}<br />
                                                            col {poke?.boxCol ?? '??'} row {poke?.boxRow ?? '??'}
                                                        </Box>
                                                    </HStack>
                                                ),
                                            });
                                        }

                                        setSelectedPokemonName(selectedPoke.title);
                                        setSelectedPokemon(selectedPoke.value);
                                    }}
                                />
                            </HStack>
                        </Box>
                    </Show>
                    <Show when={mode() == LivingDexMode.latestGame || mode() == LivingDexMode.firstGame}>
                        <Spacer flex={1} />
                        <Flex id={latestGameDropdownId} flex={2} justifyContent="center" flexDirection="column">
                            <Dropdown
                                title="Owned Games"
                                multiple={true}
                                maxHeight="50vh"
                                onSelect={(newValues: any) => setGames(newValues)}
                                selectedValues={games()}
                                customValueRenderer={(opt?: IDropdownOption) => {
                                    return (
                                        <Image
                                            src={opt?.image ?? '/assets/img/unknown.png'}
                                            alt={opt?.title ?? 'unknown'}
                                            borderRadius={3}
                                            height="1.5em"
                                            width="1.5em"
                                            mr="0.5em"
                                        />
                                    );
                                }}
                                placeholder="e.g. Emerald, Platinum"
                                options={pokedexByRegion().map(pbr => ({
                                    title: pbr.game,
                                    value: pbr.game,
                                    image: `/assets/img/game/${pbr.icon}.png`
                                }))}
                            />
                        </Flex>
                    </Show>
                </Flex>
                <Box p="1em 1em 8em 1em" class={classNames('noselect', LivingDexMode[mode()])}>
                    <SimpleGrid minChildWidth="310px" gap="1em">
                        <For each={pokemonByGame()}>
                            {(pkmByGame) => (
                                <PokemonBox
                                    {...pkmByGame}
                                    meta={meta()}
                                    mode={mode()}
                                    pokemonId={selectedPokemon()}
                                    owned={[...owned()]}
                                    shiny={[...shiny()]}
                                    pokedexByRegion={pokedexByRegion()}
                                    selectedPokedexes={games()}
                                    addOrRemoveFromOwned={addOrRemoveFromOwned}
                                    addOrRemoveFromShiny={addOrRemoveFromShiny}
                                    showInfoBox={showInfoBox}
                                />
                            )}
                        </For>
                    </SimpleGrid>
                </Box>
                <Modal opened={isOpen()} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent class="noselect">
                        <ModalCloseButton />
                        <ModalHeader>{selectedPokemonName()}</ModalHeader>
                        <ModalBody>
                            <Box>
                                <VStack
                                    as="form"
                                    spacing="$5"
                                    alignItems="stretch"
                                    maxW="$96"
                                    mx="auto"
                                >
                                    <For each={infoBoxPokedexs()}>
                                        {(pokiDex) => (
                                            <HStack>
                                                <Image src={`/assets/img/game/${pokiDex.icon}.png`} maxH="50px" mr="1em" />
                                                <Box>
                                                    {pokiDex.game}
                                                </Box>
                                            </HStack>
                                        )}
                                    </For>
                                    <Show when={infoBoxPokedexs().length == 0}>
                                        <Text>This might be an event only pokemon 🤷‍♂️</Text>
                                    </Show>
                                    <Button as={Link} href={getBulbaUrl(selectedPokemonName())} title="View on Bulbapedia" target="_blank" rel="noopener noreferrer">
                                        View on Bulbapedia
                                    </Button>
                                </VStack>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Show>
        </>
    );
};

