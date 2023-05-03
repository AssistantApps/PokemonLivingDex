import { Route, Routes } from "@solidjs/router";
import { Component } from 'solid-js';

import { routes } from './constants/route';
import { HomePage, RedirectToHome } from "./pages/home";
import { NotFoundPage } from "./pages/notFound";


export const AppShell: Component = () => {

    return (
        <Routes>
            <Route path={routes.actualHome} component={HomePage} />
            <Route path={routes.home} component={RedirectToHome} />
            <Route path={"*"} element={<NotFoundPage />} />
        </Routes>
    );
};