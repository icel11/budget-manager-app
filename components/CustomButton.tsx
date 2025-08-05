import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { colors, commonStyles, spacing } from '../styles';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
};

export default function CustomButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'medium',
}: CustomButtonProps) {
    const getButtonStyle = () => {
        const baseStyle = [commonStyles.button];

        if (variant === 'secondary') {
            baseStyle.push(styles.secondaryButton);
        } else if (variant === 'danger') {
            baseStyle.push(styles.dangerButton);
        }

        if (size === 'small') {
            baseStyle.push(styles.smallButton);
        } else if (size === 'large') {
            baseStyle.push(styles.largeButton);
        }

        if (disabled) {
            baseStyle.push(styles.disabledButton);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [commonStyles.buttonText];

        if (size === 'small') {
            baseStyle.push(styles.smallText);
        } else if (size === 'large') {
            baseStyle.push(styles.largeText);
        }

        if (disabled) {
            baseStyle.push(styles.disabledText);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={colors.text} size="small" />
            ) : (
                <Text style={getTextStyle()}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    dangerButton: {
        backgroundColor: colors.error,
    },
    smallButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    largeButton: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    disabledButton: {
        backgroundColor: colors.surfaceSecondary,
        opacity: 0.6,
    },
    smallText: {
        fontSize: 14,
    },
    largeText: {
        fontSize: 18,
    },
    disabledText: {
        color: colors.textTertiary,
    },
});
