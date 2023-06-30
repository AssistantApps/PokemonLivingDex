import { IDropdownOption } from "../components/common/dropdown";
import { LivingDexMode } from "./enum/livingDexMode";

export const livingDexModeOptions: Array<IDropdownOption> = [
    {
        title: 'Find a specific Pokémon\'s box position',
        value: LivingDexMode[LivingDexMode.finding].toString(),
        desc: 'Search for a Pokémon using the top right dropdown. On selecting a Pokémon, the page will scroll to the location of the Pokémon in the box.',
        click: 'View the games a Pokémon appears in',
        middleClick: 'Open Pokémon\'s Bulbapedia page in new tab',
    } as any,
    {
        title: 'Keep track of collected Pokémon',
        value: LivingDexMode[LivingDexMode.tracking].toString(),
        desc: 'Keep track of Pokémon that are owned or still need to be owned. This data is tracked locally and not synced',
        leftClick: 'Toggle owned (switches between greyed-out and not greyed-out)',
        rightClick: 'View the games a Pokémon appears in',
        middleClick: 'Open Pokémon\'s Bulbapedia page in new tab',
    } as any,
    {
        title: 'Find the latest game a Pokémon is available in',
        value: LivingDexMode[LivingDexMode.latestGame].toString(),
        desc: 'Displays the logo of the latest game a Pokémon is available in. Use the top right dropdown to select and deselect the games that you own.',
        click: 'View the games a Pokémon appears in',
        middleClick: 'Open Pokémon\'s Bulbapedia page in new tab',
    } as any,
    {
        title: 'Find the first game a Pokémon became available in',
        value: LivingDexMode[LivingDexMode.firstGame].toString(),
        desc: 'Displays the logo of the first game a Pokémon became available in. Use the top right dropdown to select and deselect the games that you own.',
        click: 'View the games a Pokémon appears in',
        middleClick: 'Open Pokémon\'s Bulbapedia page in new tab',
    } as any,
]