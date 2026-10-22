import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { theme } from './app/theme';
import { AppRouter } from './app/router';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <AppRouter />
    </MantineProvider>
  );
}
