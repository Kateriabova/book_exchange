import { useState } from 'react';
import { Group, Text, Button, Box, Burger, Drawer, Stack, Divider } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  const navItems = [
    { path: '/catalog', label: 'Каталог' },
    { path: '/library', label: 'Мои книги' },
    { path: '/reservations', label: 'Мои брони' },
    { path: '/profile', label: 'Профиль' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setOpened(false);
  };

  return (
    <Box
      component="header"
      style={{
        backgroundColor: '#2B2016',
        borderBottom: '1px solid #D9CDB4',
        padding: '0 16px',
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
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate('/catalog')}
        >
          Обмен книгами
        </Text>

        {/* Desktop nav */}
        <Group gap="xs" visibleFrom="sm">
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

        {/* Mobile burger */}
        <Box hiddenFrom="sm">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            color="#F0E6D2"
            size="sm"
          />
        </Box>
      </Group>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="sm"
        position="right"
        styles={{
          body: { backgroundColor: '#2B2016' },
          header: { backgroundColor: '#2B2016' },
        }}
      >
        <Stack gap="xs">
          <Text
            fw={700}
            size="lg"
            style={{
              color: '#F0E6D2',
              fontFamily: '"PT Serif", Georgia, serif',
            }}
          >
            🪄 Обмен книгами
          </Text>
          <Divider color="dark.4" />
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'filled' : 'subtle'}
              color={location.pathname === item.path ? 'gold' : undefined}
              size="md"
              justify="flex-start"
              fullWidth
              style={{
                color: location.pathname === item.path ? '#2E2418' : '#F0E6D2',
              }}
              onClick={() => handleNav(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
}
