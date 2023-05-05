import { Box, Center, Divider, ElementType, Flex, Heading, IconButton, Text, TextProps, VStack } from '@hope-ui/solid';
import { Component } from 'solid-js';

import { Link } from '@solidjs/router';
import { externalUrl } from '../../constants/external';
import { routes } from '../../constants/route';
import { getSidebarIsOpen } from '../../services/store/sections/sidebarState';
import { getStateService } from '../../services/store/stateService';
import { OpenInNewIcon } from './icon/openInNewIcon';
import { CustomImage } from './image';
import { SidebarNavLink } from './sidebarNavLink';

export const Sidebar: Component = () => {
    const stateRef = getStateService();
    const [isOpen, setIsOpen] = getSidebarIsOpen(stateRef);

    const SidebarTitle = <C extends ElementType = "p">(props: TextProps<C>) => {
        return (
            <Text
                fontSize="$sm"
                fontWeight="$bold"
                textTransform="uppercase"
                mb="$2"
                {...props}
            />
        );
    }

    return (
        <Flex
            as="nav"
            class={isOpen() ? 'hide-scrollbar noselect expand' : 'hide-scrollbar noselect close'}
            position="sticky"
            display="flex"
            direction="column"
            flexShrink="0"
            width={isOpen() ? '$72' : '$10'}
            height="100vh"
            p={isOpen() ? '$6' : '0'}
        >
            <>
                <Box class="content" opacity={isOpen() ? '1' : '0'}>
                    <Box position="relative">
                        <Link href={routes.home}>
                            <Flex>
                                <CustomImage src="/assets/img/logo.png" alt="logo" maxHeight="75px" />
                                <Box m="$2" />
                                <Center>
                                    <Heading>Very Simple<br />living dex</Heading>
                                </Center>
                            </Flex>
                            <Box m={20} />
                            <Divider />
                        </Link>
                    </Box>
                    <Box m={20} />
                    <SidebarTitle>Quick links</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <SidebarNavLink href={routes.actualHome}>Home</SidebarNavLink>
                        <SidebarNavLink href={externalUrl.assistantapps} target="_blank" rel="noopener noreferrer">AssistantApps Homepage <OpenInNewIcon /></SidebarNavLink>
                        <SidebarNavLink href={externalUrl.assistantappsDiscord} target="_blank" rel="noopener noreferrer">Discord <OpenInNewIcon /></SidebarNavLink>
                        <SidebarNavLink href={externalUrl.assistantappsMastodon} target="_blank" rel="noopener noreferrer">Mastodon <OpenInNewIcon /></SidebarNavLink>
                        <SidebarNavLink href={externalUrl.githubRepo} target="_blank" rel="noopener noreferrer">Github Repository <OpenInNewIcon /></SidebarNavLink>
                    </VStack>
                    <Box m={20} />
                    <SidebarTitle>Data from</SidebarTitle>
                    <VStack alignItems="flex-start" spacing="$1" mb="$6">
                        <SidebarNavLink href={externalUrl.pokeAPI} target="_blank" rel="noopener noreferrer">PokeApi <OpenInNewIcon /></SidebarNavLink>
                    </VStack>
                </Box>
                <IconButton
                    colorScheme="primary"
                    aria-label="Close drawer"
                    borderRadius="2em"
                    class={isOpen() ? 'drawer-icon expand' : 'drawer-icon close'}
                    onClick={() => setIsOpen(!isOpen())}
                    icon={<span>☰</span>}
                />
            </>
        </Flex>
    );
}