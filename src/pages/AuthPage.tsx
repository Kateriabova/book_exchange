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
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string | null>('login');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = () => {
    // Демо: любой логин/пароль подходит
    if (tab === 'login') {
      if (login && password) {
        navigate('/catalog');
      }
    } else {
      if (login && password && password === passwordConfirm) {
        navigate('/catalog');
      }
    }
  };

  return (
    <Center
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5EFE3',
      }}
    >
      <Paper
        p="xl"
        shadow="md"
        withBorder
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#FBF7EE',
          borderColor: '#D9CDB4',
        }}
      >
        <Stack gap="md">
          <Box ta="center">
            <Title
              order={2}
              style={{
                fontFamily: '"PT Serif", Georgia, serif',
                color: '#2E2418',
              }}
            >
              Сервис обмена книгами
            </Title>
            <Text c="dimmed" size="sm" mt="xs">
              Обменивайтесь книгами с единомышленниками
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
                />
                <PasswordInput
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button
                  color="gold"
                  fullWidth
                  mt="md"
                  onClick={handleSubmit}
                  disabled={!login || !password}
                >
                  Войти в библиотеку
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
                />
                <PasswordInput
                  label="Пароль"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <PasswordInput
                  label="Пароль ещё раз"
                  placeholder="Повторите пароль"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
                />
                <Button
                  color="gold"
                  fullWidth
                  mt="md"
                  onClick={handleSubmit}
                  disabled={!login || !password || password !== passwordConfirm}
                >
                  Зарегистрироваться
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Paper>
    </Center>
  );
}
