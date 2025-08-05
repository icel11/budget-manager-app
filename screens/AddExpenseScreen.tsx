import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Keyboard, View, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { CustomButton, CustomTextInput, CustomPicker } from '../components';
import { colors, commonStyles, spacing, typography } from '../styles';
import { Labels, Expense } from '../types';
import {
    loadLabels,
    loadExpenses,
    saveExpenses,
    migrateOldExpenses,
} from '../utils/storage';

export default function AddExpenseScreen() {
    const [textInputData, setTextInputData] = useState('');
    const [labels, setLabels] = useState<Labels>({});
    const [selectedValues, setSelectedValues] = useState<{
        [labelName: string]: string;
    }>({});

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const loadData = async () => {
        try {
            await migrateOldExpenses();
            const loadedLabels = await loadLabels();
            setLabels(loadedLabels);

            // Set default values for each label
            const defaults: { [labelName: string]: string } = {};
            Object.entries(loadedLabels).forEach(([labelName, label]) => {
                const defaultValue = label.values.find((v) => v.isDefault);
                if (defaultValue) {
                    defaults[labelName] = defaultValue.value;
                }
            });
            setSelectedValues(defaults);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load labels',
            });
        }
    };

    const hideKeyboard = () => {
        Keyboard.dismiss();
    };

    const isNumericAndPositive = (value: string): boolean => {
        const number = parseFloat(value);
        return !isNaN(number) && isFinite(number) && number > 0;
    };

    const addExpense = async () => {
        if (!isNumericAndPositive(textInputData)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid number greater than 0.',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            const value = parseFloat(textInputData);
            const existingExpenses = await loadExpenses();
            const expenseId = Date.now().toString();

            const newExpense: Expense = {
                id: expenseId,
                time: new Date().toISOString(),
                value: value,
                labels: { ...selectedValues },
            };

            existingExpenses[expenseId] = newExpense;
            await saveExpenses(existingExpenses);

            setTextInputData('');
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Expense stored successfully',
                position: 'top',
                visibilityTime: 3000,
            });
            hideKeyboard();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save data.',
                position: 'top',
                visibilityTime: 3000,
            });
            console.error(error);
        }
    };

    const handleLabelChange = (labelName: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [labelName]: value,
        }));
    };

    return (
        <View style={commonStyles.container}>
            <Text style={[typography.h1, styles.title]}>New Expense</Text>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <CustomTextInput
                    placeholder="0.00"
                    value={textInputData}
                    onChangeText={setTextInputData}
                    keyboardType="numeric"
                    style={styles.amountInput}
                />

                {Object.entries(labels).map(([labelName, label]) => (
                    <CustomPicker
                        key={labelName}
                        label={label.name}
                        selectedValue={selectedValues[labelName] || ''}
                        onValueChange={(value) =>
                            handleLabelChange(labelName, value)
                        }
                        items={label.values.map((v) => v.value)}
                        enabled={!label.isFixed || labelName !== 'currency'}
                    />
                ))}

                <View style={styles.buttonContainer}>
                    <CustomButton title="Add Expense" onPress={addExpense} />
                </View>
            </ScrollView>

            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    scrollView: {
        flex: 1,
    },
    amountInput: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    buttonContainer: {
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
});
