import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
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
    const getButtonStyle = (): ViewStyle => {
        let buttonStyle: ViewStyle = { ...commonStyles.button };

        if (variant === 'secondary') {
            buttonStyle = {
                ...buttonStyle,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.accent,
            };
        } else if (variant === 'danger') {
            buttonStyle = {
                ...buttonStyle,
                backgroundColor: colors.error,
            };
        }

        if (size === 'small') {
            buttonStyle = {
                ...buttonStyle,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
            };
        } else if (size === 'large') {
            buttonStyle = {
                ...buttonStyle,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
            };
        }

        if (disabled) {
            buttonStyle = {
                ...buttonStyle,
                backgroundColor: colors.surfaceSecondary,
                opacity: 0.6,
            };
        }

        return buttonStyle;
    };

    const getTextStyle = (): TextStyle => {
        let textStyle: TextStyle = { ...commonStyles.buttonText };

        if (size === 'small') {
            textStyle = {
                ...textStyle,
                fontSize: 14,
            };
        } else if (size === 'large') {
            textStyle = {
                ...textStyle,
                fontSize: 18,
            };
        }

        if (disabled) {
            textStyle = {
                ...textStyle,
                color: colors.textTertiary,
            };
        }

        return textStyle;
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

