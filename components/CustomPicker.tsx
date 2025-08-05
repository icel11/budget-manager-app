import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, commonStyles, spacing, typography } from '../styles';

type CustomPickerProps = {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: string[];
    enabled?: boolean;
};

export default function CustomPicker({
    label,
    selectedValue,
    onValueChange,
    items,
    enabled = true,
}: CustomPickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.pickerContainer, !enabled && styles.disabled]}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) =>
                        onValueChange(itemValue as string)
                    }
                    style={[commonStyles.picker, styles.picker]}
                    enabled={enabled}
                    dropdownIconColor={colors.textSecondary}
                >
                    {items.map((item, index) => (
                        <Picker.Item
                            label={item}
                            value={item}
                            key={index}
                            color={colors.text}
                        />
                    ))}
                </Picker>
            </View>
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
    pickerContainer: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: colors.text,
    },
    disabled: {
        opacity: 0.6,
    },
});
