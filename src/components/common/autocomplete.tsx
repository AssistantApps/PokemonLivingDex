import { FormControl, FormLabel, Input, Text, SelectContent, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectTrigger, createDisclosure } from "@hope-ui/solid";
import { Accessor, Component, For, JSX, Show, createEffect, createSignal } from "solid-js";
import { capitalizeFirstLetter } from "../../helper/stringHelper";
import { CustomImage } from "./image";
import classNames from "classnames";

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

    const { isOpen, onOpen, onClose } = createDisclosure();

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
        onClose();
    }

    return (
        <FormControl>
            <Show when={props.title != null}>
                <FormLabel>{props.title}</FormLabel>
            </Show>
            <div class="auto-complete-dropdown">
                <Input
                    class="auto-complete-link"
                    placeholder={props.placeholder ?? ''}
                    value={searchText()}
                    onFocus={() => {
                        setSearchText('');
                        setOptionsToDisplay(props.options);
                        onOpen();
                    }}
                    onBlur={() => setTimeout(() => onClose(), 200)}
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
                <svg aria-hidden="true" viewBox="0 0 15 15" class="icon"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                <ul class={classNames('auto-complete-dropdown-list', { 'is-open': isOpen() })}>
                    <For each={optionsToDisplay()}>
                        {(item, index) => (
                            <li value={item.value} onClick={() => onSelectOption(item.value)}>
                                <Show
                                    when={props.autocompleteTile != null}
                                    fallback={
                                        <>
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
                                            <Text>{item.title} test</Text>
                                        </>
                                    }
                                >
                                    {props.autocompleteTile!(item, index)}
                                </Show>
                            </li>
                        )}
                    </For>
                </ul>
            </div>
            {/* <Select
                variant="unstyled"
                multiple={props.multiple}
                value={selectedOptions()}
                onChange={onSelectOption}
            >
            </Select> */}
        </FormControl>
    );
}