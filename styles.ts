import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    tertiary: '#404040',
    accent: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    textTertiary: '#6b7280',
    border: '#374151',
    background: '#111111',
    surface: '#1f2937',
    surfaceSecondary: '#374151',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        color: colors.text,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: colors.text,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: colors.text,
    },
    body: {
        fontSize: 16,
        color: colors.text,
    },
    bodySecondary: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    caption: {
        fontSize: 12,
        color: colors.textTertiary,
    },
};

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
        paddingHorizontal: spacing.md,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    button: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    textInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: 16,
        color: colors.text,
        marginVertical: spacing.sm,
    },
    picker: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
