import 'reflect-metadata';
import { render } from 'solid-js/web';
import { Router, hashIntegration } from '@solidjs/router';

import { AppShell } from './appShell';
import { CustomThemeProvider } from './themeProvider';

import './scss/custom.scss';

render(() => (
  <CustomThemeProvider>
    <Router source={hashIntegration()}>
      <AppShell />
    </Router>
  </CustomThemeProvider>
),
  document.getElementById('pokemon-game') as HTMLElement
);