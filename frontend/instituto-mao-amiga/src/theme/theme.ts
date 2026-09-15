export const theme = {
    colors: {
        background: '#121214',
        modalBackground: 'rgba(0, 0, 0, 0.75)',
        cardBackground: '#202024',
        cardBorder: '#29292e',
        primary: '#007aff',
        text: '#f1f1f1',
        textSecondary: '#c4c4cc',
        textMuted: '#8d8d99',
        textWhite: '#ffffff',
        placeholder: '#7c7c8a',
        danger: '#f75a68',
        shadow: '#000',
        iconSurface: 'rgba(0, 122, 255, 0.12)',
    },
    fontSize: {
        xs: 12,
        sm: 13,
        md: 14,
        lg: 15,
        xl: 16,
        '2xl': 18,
        '3xl': 22,
        '4xl': 24,
    },
    borderRadius: {
        sm: 8,
        lg: 12,
        xl: 16,
    },
    spacing: {
        xs: 4,
        sm: 6,
        md: 8,
        lg: 10,
        xl: 12,
        '2xl': 16,
        '3xl': 32,
        '4xl': 40,
    },
} as const;

export type Theme = typeof theme;