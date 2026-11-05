import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { theme } from './app/theme';
import { AppRouter } from './app/router';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {/* Контейнер для всплывающих уведомлений */}
      <Notifications position="top-right" autoClose={3000} />
      
      <AppRouter />
    </MantineProvider>
  );
}