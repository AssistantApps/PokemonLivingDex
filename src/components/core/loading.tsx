import { Center, Spinner } from "@hope-ui/solid";
import { Component } from "solid-js";

export const CenterLoading: Component = () => {
    return (
        <Center height="75vh">
            <LoadingSpinner />
        </Center>
    );
}

export const LoadingSpinner: Component = () => {
    return (
        <Spinner size="lg" thickness="3px" color="$primary9" />
    );
}

export const SmolLoadingSpinner: Component = () => {
    return (
        <Spinner size="md" thickness="3px" color="$primary9" />
    );
}