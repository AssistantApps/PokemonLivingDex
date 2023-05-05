import { Flex, hope } from "@hope-ui/solid";
import { Component, JSX, Suspense } from "solid-js";
import { Sidebar } from "./sidebar";
import { CenterLoading } from "../core/loading";

interface IProps {
    children: JSX.Element;
}

export const CommonLayout: Component<IProps> = (props: IProps) => {
    return (
        <Flex maxH="100vh">
            <Sidebar />
            <hope.main w="$full" h="100vh" class="main">
                <Suspense fallback={<CenterLoading />}>
                    {props.children}
                </Suspense>
            </hope.main>
        </Flex>
    );
}