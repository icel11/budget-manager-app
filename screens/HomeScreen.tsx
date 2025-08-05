import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import {
    CustomPicker,
    ExpensePieChart,
    ExpenseBarChart,
    ExpenseListView,
} from '../components';
import { colors, commonStyles, spacing, typography } from '../styles';
import { Expenses, Labels, ViewMode, CurrencyRates } from '../types';
import {
    loadExpenses,
    saveExpenses,
    loadLabels,
    loadCurrencyRates,
    saveCurrencyRates,
    migrateOldExpenses,
} from '../utils/storage';
import { convertCurrency, formatCurrency } from '../utils/currency';

export default function HomeScreen() {
    const [expenses, setExpenses] = useState<Expenses>({});
    const [labels, setLabels] = useState<Labels>({});
    const [currencyRates, setCurrencyRates] = useState<CurrencyRates>({});
    const [selectedCurrency, setSelectedCurrency] = useState<string>('ARS');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [total, setTotal] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const loadData = async () => {
        try {
            await migrateOldExpenses();
            const [loadedExpenses, loadedLabels, loadedRates] =
                await Promise.all([
                    loadExpenses(),
                    loadLabels(),
                    loadCurrencyRates(),
                ]);

            setExpenses(loadedExpenses);
            setLabels(loadedLabels);
            setCurrencyRates(loadedRates);

            // Set default currency to the default currency label
            const currencyLabel = loadedLabels.currency;
            if (currencyLabel) {
                const defaultCurrency = currencyLabel.values.find(
                    (v) => v.isDefault,
                );
                if (defaultCurrency) {
                    setSelectedCurrency(defaultCurrency.value);
                }
            }

            calculateTotal(loadedExpenses, selectedCurrency, loadedRates);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load data',
            });
        }
    };

    const calculateTotal = (
        expensesData: Expenses,
        currency: string,
        rates: CurrencyRates,
    ) => {
        const sum = Object.values(expensesData).reduce((acc, expense) => {
            const expenseCurrency = expense.labels.currency || 'ARS';
            return (
                acc +
                convertCurrency(expense.value, expenseCurrency, currency, rates)
            );
        }, 0);
        setTotal(sum);
    };

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency);
        calculateTotal(expenses, currency, currencyRates);
    };

    const deleteExpense = async (id: string) => {
        try {
            const updatedExpenses = { ...expenses };
            delete updatedExpenses[id];

            await saveExpenses(updatedExpenses);
            setExpenses(updatedExpenses);
            calculateTotal(updatedExpenses, selectedCurrency, currencyRates);

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Expense deleted successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete expense',
            });
        }
    };

    const getViewModeIcon = (mode: ViewMode) => {
        switch (mode) {
            case 'list':
                return 'list';
            case 'pie':
                return 'pie-chart';
            case 'chart':
                return 'bar-chart';
            default:
                return 'list';
        }
    };

    const renderViewModeButton = (mode: ViewMode, label: string) => (
        <TouchableOpacity
            key={mode}
            style={[
                styles.viewModeButton,
                viewMode === mode && styles.activeViewModeButton,
            ]}
            onPress={() => setViewMode(mode)}
        >
            <Ionicons
                name={getViewModeIcon(mode) as any}
                size={20}
                color={viewMode === mode ? colors.text : colors.textSecondary}
            />
            <Text
                style={[
                    styles.viewModeText,
                    viewMode === mode && styles.activeViewModeText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderContent = () => {
        switch (viewMode) {
            case 'pie':
                return (
                    <ExpensePieChart
                        expenses={expenses}
                        selectedCurrency={selectedCurrency}
                        currencyRates={currencyRates}
                    />
                );
            case 'chart':
                return (
                    <ExpenseBarChart
                        expenses={expenses}
                        selectedCurrency={selectedCurrency}
                        currencyRates={currencyRates}
                    />
                );
            case 'list':
            default:
                return (
                    <ExpenseListView
                        expenses={expenses}
                        labels={labels}
                        selectedCurrency={selectedCurrency}
                        currencyRates={currencyRates}
                        onDeleteExpense={deleteExpense}
                    />
                );
        }
    };

    const currencyOptions = labels.currency?.values.map((v) => v.value) || [
        'ARS',
    ];

    return (
        <View style={commonStyles.container}>
            <Text style={[typography.h1, styles.title]}>Expenses</Text>

            <View style={styles.headerContainer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                        {formatCurrency(total, selectedCurrency)}
                    </Text>
                </View>

                <CustomPicker
                    label="Display Currency"
                    selectedValue={selectedCurrency}
                    onValueChange={handleCurrencyChange}
                    items={currencyOptions}
                />
            </View>

            <View style={styles.viewModeContainer}>
                {renderViewModeButton('list', 'List')}
                {renderViewModeButton('pie', 'Pie Chart')}
                {renderViewModeButton('chart', 'Bar Chart')}
            </View>

            <View style={styles.contentContainer}>{renderContent()}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    headerContainer: {
        marginBottom: spacing.lg,
    },
    totalContainer: {
        ...commonStyles.row,
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
        justifyContent: 'center',
    },
    totalLabel: {
        ...typography.h2,
        marginRight: spacing.sm,
    },
    totalValue: {
        ...typography.h2,
        color: colors.success,
        fontWeight: 'bold',
    },
    viewModeContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.xs,
        marginBottom: spacing.lg,
        justifyContent: 'space-around',
    },
    viewModeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: 6,
    },
    activeViewModeButton: {
        backgroundColor: colors.accent,
    },
    viewModeText: {
        ...typography.bodySecondary,
        marginLeft: spacing.xs,
    },
    activeViewModeText: {
        ...typography.body,
        color: colors.text,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
    },
});
