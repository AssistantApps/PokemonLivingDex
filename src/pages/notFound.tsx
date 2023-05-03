
import { Box, Center } from '@hope-ui/solid';
import { Component } from 'solid-js';
import { PageHeader } from '../components/common/pageHeader';
import { CommonLayout } from '../components/common/layout';

export const NotFoundPage: Component = () => {

    return (
        <CommonLayout>
            <PageHeader text="Not Found"></PageHeader>
            <Box m={50}></Box>

            <Center>Page not found</Center>
        </CommonLayout>
    );
};
