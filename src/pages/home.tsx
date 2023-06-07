import { Box, Button, Center, Divider, HStack, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from '@hope-ui/solid';
import { useNavigate } from '@solidjs/router';
import { Component, For, Show } from 'solid-js';

import { CommonLayout } from '../components/common/layout';
import { PageHeader } from '../components/common/pageHeader';
import { CenterLoading } from '../components/core/loading';
import { LivingDexLookup } from '../components/livingDexLookup';
import { TutorialState } from '../constants/enum/tutorialState';
import { livingDexModeOptions } from '../constants/livingDexModeOptions';
import { routes } from '../constants/route';
import { preventDefault } from '../helper/documentHelper';
import { getTutorialState } from '../services/store/sections/tutorialState';
import { getStateService } from '../services/store/stateService';

export const HomePage: Component = () => {

    const stateServ = getStateService();
    const [tutorialState, setTutorialState] = getTutorialState(stateServ);



    return (
        <CommonLayout>
            <Center mt="2em">
                <Image src="/assets/img/tutorial-logo.png" />
            </Center>
            <PageHeader text="Simple Living Dex" />
            <Center>
                <a href="/#/tutorial" onClick={(e: any) => {
                    preventDefault(e);
                    setTutorialState(TutorialState.NotStarted);
                }}>Tutorial</a>
            </Center>
            <LivingDexLookup />
            <Modal
                size="4xl"
                opened={tutorialState() != TutorialState.Completed}
                onClose={() => setTutorialState(TutorialState.Completed)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader></ModalHeader>
                    <ModalBody>
                        <VStack>
                            <HStack mb="1em">
                                <Image src="/assets/img/tutorial.png" height="100px" />
                                <Heading size="2xl" ml="1em">How do I even use this site!?</Heading>
                            </HStack>
                            <Box maxW="500px">
                                There are 3 modes, you can switch between them using the top left dropdown that is labelled "Dex mode".
                                <br /><br />
                                <For each={livingDexModeOptions}>
                                    {(opt: any) => (
                                        <Box mt="0.5em">
                                            <Heading>{opt.title}</Heading>
                                            <Text ml="2em">{opt.desc}</Text>
                                        </Box>
                                    )}
                                </For>
                            </Box>
                            <Divider m="2em auto 1.5em auto" width="80%" />
                            <HStack mb="1em">
                                <Image src="/assets/img/tutorial2.png" height="100px" />
                                <Heading size="2xl" ml="1em">Clicking does different things?</Heading>
                            </HStack>
                            <Box maxW="500px">
                                <For each={livingDexModeOptions}>
                                    {(opt: any) => (
                                        <Box mt="0.5em">
                                            <Heading>{opt.title}</Heading>
                                            <Show
                                                when={opt.click == null}
                                                fallback={<Text ml="2em"><b class="primary">Left or Right click: </b>{opt.click}</Text>}
                                            >
                                                <Show when={opt.leftClick}>
                                                    <Text ml="2em"><b class="primary">Left click: </b>{opt.leftClick}</Text>
                                                </Show>
                                                <Show when={opt.rightClick}>
                                                    <Text ml="2em"><b class="primary">Right click: </b>{opt.rightClick}</Text>
                                                </Show>
                                            </Show>
                                            <Show when={opt.middleClick}>
                                                <Text ml="2em"><b class="primary">Middle click: </b>{opt.middleClick}</Text>
                                            </Show>
                                        </Box>
                                    )}
                                </For>
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setTutorialState(TutorialState.Completed)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </CommonLayout>
    );
};

export const RedirectToHome: Component = () => {
    const navigate = useNavigate();
    navigate(routes.actualHome);

    return (
        <CenterLoading />
    );
};
