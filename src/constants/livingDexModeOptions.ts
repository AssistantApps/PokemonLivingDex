import { IDropdownOption } from "../components/common/dropdown";
import { LivingDexMode } from "./enum/livingDexMode";

export const livingDexModeOptions: Array<IDropdownOption> = [
    {
        title: 'Find a specific Pokémon\'s box position',
        value: LivingDexMode[LivingDexMode.finding].toString(),
    },
    {
        title: 'Keep track of collected Pokémon',
        value: LivingDexMode[LivingDexMode.tracking].toString(),
    },
    {
        title: 'Find the latest game a Pokémon is available in',
        value: LivingDexMode[LivingDexMode.latestGame].toString(),
    },
]