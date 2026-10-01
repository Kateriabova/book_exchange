import { Group, Text, Button, Box } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/catalog', label: 'Каталог' },
    { path: '/library', label: 'Мои книги' },
    { path: '/reservations', label: 'Мои брони' },
    { path: '/profile', label: 'Профиль' },
  ];

  return (
    <Box
      component="header"
      style={{
        backgroundColor: '#2B2016',
        borderBottom: '1px solid #D9CDB4',
        padding: '0 24px',
      }}
    >
      <Group h={56} justify="space-between" wrap="nowrap">
        <Text
          fw={700}
          size="lg"
          style={{
            color: '#F0E6D2',
            fontFamily: '"PT Serif", Georgia, serif',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/catalog')}
        >
          Обмен книгами
        </Text>
        <Group gap="xs">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'filled' : 'subtle'}
              color={location.pathname === item.path ? 'gold' : undefined}
              size="sm"
              style={{
                color: location.pathname === item.path ? '#2E2418' : '#F0E6D2',
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Group>
      </Group>
    </Box>
  );
}
