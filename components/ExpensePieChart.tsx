import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, typography, spacing } from '../styles';
import { Expenses } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';

type ExpensePieChartProps = {
    expenses: Expenses;
    selectedCurrency: string;
    currencyRates: { [currency: string]: number };
    categoryLabel?: string;
};

const screenWidth = Dimensions.get('window').width;

export default function ExpensePieChart({
    expenses,
    selectedCurrency,
    currencyRates,
    categoryLabel = 'category',
}: ExpensePieChartProps) {
    const chartColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#C9CBCF',
        '#4BC0C0',
        '#FF6384',
    ];

    const getCategoryData = () => {
        const categoryTotals: { [category: string]: number } = {};

        Object.values(expenses).forEach((expense) => {
            const category = expense.labels[categoryLabel] || 'Unknown';
            const expenseCurrency = expense.labels.currency || 'EUR';
            const convertedAmount = convertCurrency(
                expense.value,
                expenseCurrency,
                selectedCurrency,
                currencyRates,
            );

            categoryTotals[category] =
                (categoryTotals[category] || 0) + convertedAmount;
        });

        return Object.entries(categoryTotals)
            .map(([name, population], index) => ({
                name,
                population,
                color: chartColors[index % chartColors.length],
                legendFontColor: colors.text,
                legendFontSize: 12,
            }))
            .sort((a, b) => b.population - a.population);
    };

    const data = getCategoryData();

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses to display</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PieChart
                data={data}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                        `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: item.color },
                            ]}
                        />
                        <Text style={styles.legendText}>
                            {item.name}:{' '}
                            {formatCurrency(item.population, selectedCurrency)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginVertical: spacing.sm,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.xl,
        marginVertical: spacing.sm,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    legendContainer: {
        marginTop: spacing.md,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.sm,
    },
    legendText: {
        ...typography.bodySecondary,
        flex: 1,
    },
});
