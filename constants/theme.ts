import { DarkTheme, DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';

// Base palette
const palette = {
  blue: {
    light: '#0a7ea4',
    dark: '#38bdf8',
  },
  accent: {
    light: '#6366f1',
    dark: '#818cf8',
  },
  text: {
    light: '#11181C',
    dark: '#ECEDEE',
  },
  grey: {
    100: '#ECEDEE',
    200: '#9BA1A6',
    300: '#687076',
  },
  background: {
    light: '#ffffff',
    dark: '#0f1115',
  },
  success: '#008000',
  error: '#FF0000',
  warning: '#F5A623',
  info: '#2196F3',
} as const;

// Design tokens
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const fontSize = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, xxl: 28 } as const;

export const fontWeight = { normal: '400', medium: '500', semibold: '600', bold: '700' } as const;

export const borderRadius = { sm: 4, md: 8, lg: 12, xl: 20, full: 9999 } as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;

// Semantic tokens
const tokens = {
  light: {
    text: palette.text.light,
    textSecondary: palette.grey[300],
    textSuccess: palette.success,
    textError: palette.error,
    textContrast: palette.text.dark,
    background: palette.background.light,
    surface: '#F6F6F6',
    border: palette.grey[100],
    tint: palette.blue.light,
    primary: palette.blue.light,
    accent: palette.accent.light,
    warning: palette.warning,
    info: palette.info,
    icon: palette.grey[300],
    tabIconDefault: palette.grey[300],
    surfaceHighlight: '#eef0f3',
    tabIconSelected: palette.blue.light,
  },
  dark: {
    text: palette.text.dark,
    textSecondary: palette.grey[200],
    textSuccess: palette.success,
    textError: palette.error,
    textContrast: palette.text.light,
    background: palette.background.dark,
    surface: '#22262e',
    border: palette.grey[300],
    tint: palette.blue.dark,
    primary: palette.blue.dark,
    accent: palette.accent.dark,
    warning: palette.warning,
    info: palette.info,
    icon: palette.grey[200],
    tabIconDefault: palette.grey[200],
    surfaceHighlight: '#2a2f3a',
    tabIconSelected: palette.blue.dark,
  },
} as const;

// Theme interface
export interface CustomColors {
  text: string;
  textSecondary: string;
  textContrast: string;
  textSuccess: string;
  textError: string;
  background: string;
  surface: string;
  surfaceHighlight: string;
  border: string;
  tint: string;
  primary: string;
  accent: string;
  warning: string;
  info: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface CustomTheme extends NavigationTheme {
  colors: CustomColors & NavigationTheme['colors'];
  spacing: typeof spacing;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

const sharedTokens = { spacing, fontSize, fontWeight, borderRadius, shadows };

// Theme objects
export const lightTheme: CustomTheme = {
  ...DefaultTheme,
  ...sharedTokens,
  colors: {
    ...DefaultTheme.colors,
    ...tokens.light,
  },
};

export const darkTheme: CustomTheme = {
  ...DarkTheme,
  ...sharedTokens,
  colors: {
    ...DarkTheme.colors,
    ...tokens.dark,
  },
};

// Export tokens for direct usage if needed
export const Colors = tokens;
