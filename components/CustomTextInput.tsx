import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { colors, commonStyles, spacing, typography } from '../styles';

type CustomTextInputProps = TextInputProps & {
    label?: string;
    error?: string;
};

export default function CustomTextInput({
    label,
    error,
    style,
    ...props
}: CustomTextInputProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    commonStyles.textInput,
                    error && styles.errorInput,
                    style,
                ]}
                placeholderTextColor={colors.textTertiary}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
        width: '100%',
    },
    label: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    errorInput: {
        borderColor: colors.error,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
});
