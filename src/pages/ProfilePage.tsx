import {
  Box,
  Title,
  Text,
  Paper,
  Stack,
  Button,
  Divider,
  Group,
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

  const handleLogout = () => {
    navigate('/auth');
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
                  { label: 'Книг моих', value: myBooks.length },
                  { label: 'На руках у других', value: lentOut, color: 'bordeaux' },
                  { label: 'Броней всего', value: totalLoans, color: 'sage' },
                ]}
              />
            </Box>

            <Divider />

            <Box>
              <Text fw={600} mb="sm" size="sm">
                Мои чтения
              </Text>
              <StatsStrip
                items={[
                  { label: 'Сейчас на руках', value: activeLoans.length, color: 'bordeaux' },
                  { label: 'Зарезервировано', value: reserved.length, color: 'gold' },
                  { label: 'Прочитано', value: returned.length, color: 'sage' },
                ]}
              />
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
