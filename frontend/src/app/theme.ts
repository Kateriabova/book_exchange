import { createTheme, type MantineColorsTuple } from '@mantine/core';

const gold: MantineColorsTuple = [
  '#fdf8ec',
  '#f5ecd0',
  '#e8d79e',
  '#dac16a',
  '#cfaf42',
  '#c5a02e',
  '#b08a2e',
  '#977326',
  '#806220',
  '#6a5019',
];

const bordeaux: MantineColorsTuple = [
  '#fef2f2',
  '#fde8e8',
  '#fbc5c5',
  '#f89e9e',
  '#f47070',
  '#d44040',
  '#a81010',
  '#740001',
  '#5e0001',
  '#480001',
];

const sage: MantineColorsTuple = [
  '#f2f7ef',
  '#e4eddf',
  '#c8dbc0',
  '#a8c79c',
  '#8bb47c',
  '#78a16a',
  '#6e8b5e',
  '#5a734d',
  '#485c3e',
  '#37462f',
];

const ink: MantineColorsTuple = [
  '#f5f3f0',
  '#e8e4dd',
  '#d0c9bd',
  '#b5ab9a',
  '#9a8e7a',
  '#7f7260',
  '#5c4f3e',
  '#3d3225',
  '#2e2418',
  '#1a140d',
];

export const theme = createTheme({
  primaryColor: 'gold',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: '"PT Serif", Georgia, serif',
  },
  colors: {
    gold,
    bordeaux,
    sage,
    ink,
  },
  defaultRadius: 'sm',
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Card: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});

export const COLORS = {
  bg: '#F5EFE3',
  card: '#FBF7EE',
  ink: '#2E2418',
  header: '#2B2016',
  headerText: '#F0E6D2',
  border: '#D9CDB4',
  gold: '#B08A2E',
  bordeaux: '#740001',
  sage: '#6E8B5E',
};
