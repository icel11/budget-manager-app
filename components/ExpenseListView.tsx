import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomPicker } from './CustomPicker';
import { colors, commonStyles, spacing, typography } from '../styles';
import { Expenses, Labels, FilterPeriod } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';

type ExpenseListViewProps = {
    expenses: Expenses;
    labels: Labels;
    selectedCurrency: string;
    currencyRates: { [currency: string]: number };
    onDeleteExpense: (id: string) => void;
};

export default function ExpenseListView({
    expenses,
    labels,
    selectedCurrency,
    currencyRates,
    onDeleteExpense,
}: ExpenseListViewProps) {
    const [selectedLabel, setSelectedLabel] = useState<string>('all');
    const [selectedLabelValue, setSelectedLabelValue] = useState<string>('all');
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');

    const getFilteredExpenses = () => {
        let filtered = Object.entries(expenses);

        // Filter by period
        if (filterPeriod !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();

            switch (filterPeriod) {
                case 'week':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filtered = filtered.filter(
                ([_, expense]) => new Date(expense.time) >= cutoffDate,
            );
        }

        // Filter by label
        if (selectedLabel !== 'all' && selectedLabelValue !== 'all') {
            filtered = filtered.filter(
                ([_, expense]) =>
                    expense.labels[selectedLabel] === selectedLabelValue,
            );
        }

        return filtered.sort(
            ([_, a], [__, b]) =>
                new Date(b.time).getTime() - new Date(a.time).getTime(),
        );
    };

    const filteredExpenses = getFilteredExpenses();

    const getTotalAmount = () => {
        return filteredExpenses.reduce((total, [_, expense]) => {
            const expenseCurrency = expense.labels.currency || 'ARS';
            return (
                total +
                convertCurrency(
                    expense.value,
                    expenseCurrency,
                    selectedCurrency,
                    currencyRates,
                )
            );
        }, 0);
    };

    const renderExpenseItem = ({
        item: [id, expense],
    }: {
        item: [string, (typeof expenses)[string]];
    }) => {
        const expenseCurrency = expense.labels.currency || 'ARS';
        const convertedAmount = convertCurrency(
            expense.value,
            expenseCurrency,
            selectedCurrency,
            currencyRates,
        );

        return (
            <View style={styles.expenseItem}>
                <View style={styles.expenseContent}>
                    <Text style={styles.expenseValue}>
                        {formatCurrency(convertedAmount, selectedCurrency)}
                    </Text>
                    <Text style={styles.expenseDate}>
                        {new Date(expense.time).toLocaleDateString()}
                    </Text>
                    <View style={styles.labelsContainer}>
                        {Object.entries(expense.labels).map(
                            ([labelName, value]) => (
                                <Text key={labelName} style={styles.labelText}>
                                    {labels[labelName]?.name || labelName}:{' '}
                                    {value}
                                </Text>
                            ),
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Delete Expense',
                            'Are you sure you want to delete this expense?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => onDeleteExpense(id),
                                },
                            ],
                        );
                    }}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        );
    };

    const labelOptions = ['all', ...Object.keys(labels)];
    const labelValueOptions =
        selectedLabel === 'all'
            ? ['all']
            : [
                  'all',
                  ...(labels[selectedLabel]?.values.map((v) => v.value) || []),
              ];

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <CustomPicker
                    label="Filter by Period"
                    selectedValue={filterPeriod}
                    onValueChange={(value) =>
                        setFilterPeriod(value as FilterPeriod)
                    }
                    items={['all', 'week', 'month', 'year']}
                />

                <CustomPicker
                    label="Filter by Label"
                    selectedValue={selectedLabel}
                    onValueChange={(value) => {
                        setSelectedLabel(value);
                        setSelectedLabelValue('all');
                    }}
                    items={labelOptions}
                />

                {selectedLabel !== 'all' && (
                    <CustomPicker
                        label={`Filter by ${labels[selectedLabel]?.name || selectedLabel}`}
                        selectedValue={selectedLabelValue}
                        onValueChange={setSelectedLabelValue}
                        items={labelValueOptions}
                    />
                )}
            </View>

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total: </Text>
                <Text style={styles.totalValue}>
                    {formatCurrency(getTotalAmount(), selectedCurrency)}
                </Text>
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={([id]) => id}
                renderItem={renderExpenseItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No expenses match the current filters
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filtersContainer: {
        marginBottom: spacing.md,
    },
    totalContainer: {
        ...commonStyles.row,
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    totalLabel: {
        ...typography.h3,
    },
    totalValue: {
        ...typography.h3,
        color: colors.success,
    },
    expenseItem: {
        ...commonStyles.card,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    expenseContent: {
        flex: 1,
    },
    expenseValue: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    expenseDate: {
        ...typography.bodySecondary,
        marginBottom: spacing.sm,
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    labelText: {
        ...typography.caption,
        backgroundColor: colors.tertiary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 4,
    },
    deleteButton: {
        padding: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
