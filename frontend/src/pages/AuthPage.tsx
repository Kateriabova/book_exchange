import { useState } from 'react';
import {
  Box,
  TextInput,
  PasswordInput,
  Button,
  Tabs,
  Title,
  Text,
  Stack,
  Paper,
  Center,
  useMantineTheme,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  
  const [tab, setTab] = useState<string | null>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (tab === 'register' && password !== passwordConfirm) {
      notifications.show({
        title: 'Ошибка валидации',
        message: 'Пароли не совпадают',
        color: 'bordeaux',
      });
      return;
    }

    setIsLoading(true);

    // Имитация задержки сети (как при реальном запросе на бэкенд)
    setTimeout(() => {
      setIsLoading(false);
      notifications.show({
        title: 'Успех',
        message: tab === 'login' ? 'Добро пожаловать в библиотеку!' : 'Регистрация прошла успешно',
        color: 'sage',
      });
      navigate('/catalog');
    }, 600);
  };

  const isLoginDisabled = !login.trim() || !password.trim() || isLoading;
  const isRegisterDisabled = !login.trim() || !password.trim() || !passwordConfirm.trim() || isLoading;

  return (
    <Center
      style={{
        minHeight: '100vh',
        backgroundColor: theme.other.bg,
      }}
    >
      <Paper
        p="xl"
        shadow="md"
        withBorder
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: theme.other.card,
          borderColor: theme.other.border,
        }}
      >
        <Stack gap="md">
          <Box ta="center">
            <Title
              order={2}
              style={{
                fontFamily: theme.headings.fontFamily,
                color: theme.other.ink,
              }}
            >
              Сервис обмена книгами
            </Title>
            <Text c="dimmed" size="sm" mt="xs">
              Обмен книгами между студентами
            </Text>
          </Box>

          <Tabs value={tab} onChange={setTab} color="gold">
            <Tabs.List grow>
              <Tabs.Tab value="login">Вход</Tabs.Tab>
              <Tabs.Tab value="register">Регистрация</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="login" pt="md">
              <Stack gap="sm">
                <TextInput
                  label="Логин"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.currentTarget.value)}
                  withAsterisk
                  disabled={isLoading}
                />
                <PasswordInput
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  withAsterisk
                  disabled={isLoading}
                />
                <Button
                  color="gold"
                  fullWidth
                  mt="md"
                  onClick={handleSubmit}
                  disabled={isLoginDisabled}
                  leftSection={isLoading ? <Loader size="xs" color="white" /> : null}
                >
                  {isLoading ? 'Вход...' : 'Войти в библиотеку'}
                </Button>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="register" pt="md">
              <Stack gap="sm">
                <TextInput
                  label="Логин"
                  placeholder="Придумайте логин"
                  value={login}
                  onChange={(e) => setLogin(e.currentTarget.value)}
                  withAsterisk
                  disabled={isLoading}
                />
                <PasswordInput
                  label="Пароль"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  withAsterisk
                  disabled={isLoading}
                />
                <PasswordInput
                  label="Пароль ещё раз"
                  placeholder="Повторите пароль"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
                  withAsterisk
                  disabled={isLoading}
                  error={
                    passwordConfirm && password !== passwordConfirm
                      ? 'Пароли не совпадают'
                      : undefined
                  }
                />
                <Button
                  color="gold"
                  fullWidth
                  mt="md"
                  onClick={handleSubmit}
                  disabled={isRegisterDisabled}
                  leftSection={isLoading ? <Loader size="xs" color="white" /> : null}
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Paper>
    </Center>
  );
}