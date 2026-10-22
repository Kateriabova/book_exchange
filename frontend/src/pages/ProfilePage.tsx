import { useState } from 'react';
import {
  Box,
  Title,
  Text,
  Paper,
  Stack,
  Button,
  Divider,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
  currentUser,
  getMyBooks,
  getMyBooksLentOut,
  getMyBooksTotalLoans,
  getMyActiveLoans,
  getMyReserved,
  getMyReturned,
} from '../mock/data';
import { StatsStrip } from '../components/ui/StatsStrip';

export function ProfilePage() {
  const navigate = useNavigate();

  const myBooks = getMyBooks();
  const lentOut = getMyBooksLentOut();
  const totalLoans = getMyBooksTotalLoans();
  const activeLoans = getMyActiveLoans();
  const reserved = getMyReserved();
  const returned = getMyReturned();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleLogout = () => {
    navigate('/auth');
  };

  const handleChangePassword = () => {
    setPasswordMessage(null);

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      setPasswordMessage({ type: 'error', text: 'Заполните все поля' });
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordMessage({ type: 'error', text: 'Новые пароли не совпадают' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordMessage({ type: 'error', text: 'Пароль слишком короткий (минимум 4 символа)' });
      return;
    }

    // Демо: принимаем любой старый пароль
    setPasswordMessage({ type: 'success', text: 'Пароль успешно изменён ✨' });
    setOldPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  return (
    <Box p="md" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Stack gap="md">
        <Title
          order={2}
          style={{ fontFamily: '"PT Serif", Georgia, serif', color: '#2E2418' }}
        >
          Профиль
        </Title>

        <Paper
          p="xl"
          withBorder
          style={{
            backgroundColor: '#FBF7EE',
            borderColor: '#D9CDB4',
          }}
        >
          <Stack gap="md">
            <Box>
              <Text
                fw={700}
                size="xl"
                style={{ fontFamily: '"PT Serif", Georgia, serif' }}
              >
                {currentUser.display_name}
              </Text>
              <Text c="dimmed" size="sm">
                @{currentUser.login}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fw={600} mb="sm" size="sm">
                Моя библиотека
              </Text>
              <StatsStrip
                items={[
                  { label: 'Моих книг', value: myBooks.length },
                  { label: 'На руках у других', value: lentOut, color: 'bordeaux' },
                  { label: 'Общее количество броней', value: totalLoans, color: 'sage' },
                ]}
              />
            </Box>

            <Divider />

            <Box>
              <Text fw={600} mb="sm" size="sm">
                История обмена
              </Text>
              <StatsStrip
                items={[
                  { label: 'Сейчас на руках', value: activeLoans.length, color: 'bordeaux' },
                  { label: 'В ожидании', value: reserved.length, color: 'gold' },
                  { label: 'Прочитано', value: returned.length, color: 'sage' },
                ]}
              />
            </Box>

            <Divider />

            <Box>
              <Text fw={600} mb="sm" size="sm">
                Сменить пароль
              </Text>
              <Stack gap="sm">
                <PasswordInput
                  label="Старый пароль"
                  placeholder="Введите текущий пароль"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.currentTarget.value)}
                />
                <PasswordInput
                  label="Новый пароль"
                  placeholder="Введите новый пароль"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.currentTarget.value)}
                />
                <PasswordInput
                  label="Повторите новый пароль"
                  placeholder="Повторите новый пароль"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.currentTarget.value)}
                />
                {passwordMessage && (
                  <Alert
                    color={passwordMessage.type === 'success' ? 'sage' : 'bordeaux'}
                    variant="light"
                  >
                    {passwordMessage.text}
                  </Alert>
                )}
                <Button
                  color="gold"
                  onClick={handleChangePassword}
                  disabled={!oldPassword || !newPassword || !newPasswordConfirm}
                >
                  Сменить пароль
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" color="bordeaux" onClick={handleLogout}>
                Выйти
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
