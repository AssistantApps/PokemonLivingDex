import { FormControl, FormLabel, Input, Select, SelectContent, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectTrigger } from "@hope-ui/solid";
import { Accessor, Component, For, JSX, Show, createEffect, createSignal } from "solid-js";
import { capitalizeFirstLetter } from "../../helper/stringHelper";
import { CustomImage } from "./image";

export interface IAutocompleteOption {
    title: string;
    value: string;
    image?: string;
}

interface IProps {
    title?: string;
    placeholder?: string;
    multiple?: boolean;
    maxHeight?: string;
    selectedValues?: Array<string>;
    options: Array<IAutocompleteOption>;
    autocompleteTile?: (item: IAutocompleteOption, index: Accessor<number>) => JSX.Element;
    onSelectOptionMapper?: (selectedOpts: string | Array<string>) => Array<string>;
    searchFilter?: (searchStr: string) => (value: IAutocompleteOption) => boolean;
    onSelect?: (values: string | Array<string>) => void;
}

export const Autocomplete: Component<IProps> = (props: IProps) => {
    const [selectedOptions, setSelectedOptions] = createSignal(props.selectedValues ?? [], { equals: false });
    const [optionsToDisplay, setOptionsToDisplay] = createSignal<Array<IAutocompleteOption>>(props.options);
    const [searchText, setSearchText] = createSignal<string>(props.selectedValues?.[0] ?? '');

    createEffect(() => {
        setSelectedOptions(props.selectedValues ?? []);
    })

    const onSelectOption = (selectedOpts: any) => {
        if (props.onSelectOptionMapper != null) {
            const mapped = props.onSelectOptionMapper(selectedOpts);

            if (Array.isArray(selectedOpts) == false) {
                setSearchText(capitalizeFirstLetter(mapped[0].toString()));
            }
        }

        setSelectedOptions(selectedOpts);
        props.onSelect?.(selectedOpts);
    }

    return (
        <FormControl>
            <Show when={props.title != null}>
                <FormLabel>{props.title}</FormLabel>
            </Show>
            <Select
                variant="unstyled"
                multiple={props.multiple}
                value={selectedOptions()}
                onChange={onSelectOption}
            >
                <SelectTrigger onKeyDown={() => { }}>
                    <Input
                        placeholder={props.placeholder ?? ''}
                        value={searchText()}
                        onFocus={() => setSearchText('')}
                        onInput={(event) => {
                            const searchStr = event.target.value;
                            if (searchStr.length < 1) {
                                setOptionsToDisplay(props.options);
                                return;
                            }

                            const searchFilter: (value: IAutocompleteOption) => boolean = (props.searchFilter != null)
                                ? (props.searchFilter(searchStr))
                                : (p => p.value.includes(searchStr));

                            setSearchText(searchStr);
                            setOptionsToDisplay(
                                props.options.filter(searchFilter)
                            );
                        }}
                    />
                </SelectTrigger>
                <SelectContent tabindex="-1" onKeyDown={() => { }}>
                    <SelectListbox maxHeight={props.maxHeight} tabindex="-1" onKeyDown={() => { }}>
                        <For each={optionsToDisplay()}>
                            {props.autocompleteTile ?? (item => (
                                <SelectOption value={item.value} tabindex="-1">
                                    <Show when={item.image != null}>
                                        <CustomImage
                                            src={item.image}
                                            alt={item.title}
                                            borderRadius={5}
                                            maxHeight="2em"
                                            maxWidth="2em"
                                            ml="0.5em"
                                        />
                                    </Show>
                                    <SelectOptionText>{item.title}</SelectOptionText>
                                    <SelectOptionIndicator />
                                </SelectOption>
                            ))}
                        </For>
                    </SelectListbox>
                </SelectContent>
            </Select>
        </FormControl>
    );
}