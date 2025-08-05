import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors, typography, spacing } from '../styles';
import { Expenses } from '../types';
import { convertCurrency } from '../utils/currency';

type ExpenseBarChartProps = {
    expenses: Expenses;
    selectedCurrency: string;
    currencyRates: { [currency: string]: number };
    categoryLabel?: string;
};

const screenWidth = Dimensions.get('window').width;

export default function ExpenseBarChart({
    expenses,
    selectedCurrency,
    currencyRates,
    categoryLabel = 'category',
}: ExpenseBarChartProps) {
    const getMonthlyData = () => {
        const monthlyData: {
            [monthYear: string]: { [category: string]: number };
        } = {};
        const categories = new Set<string>();

        Object.values(expenses).forEach((expense) => {
            const date = new Date(expense.time);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const category = expense.labels[categoryLabel] || 'Unknown';
            const expenseCurrency = expense.labels.currency || 'ARS';

            categories.add(category);

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {};
            }

            const convertedAmount = convertCurrency(
                expense.value,
                expenseCurrency,
                selectedCurrency,
                currencyRates,
            );

            monthlyData[monthYear][category] =
                (monthlyData[monthYear][category] || 0) + convertedAmount;
        });

        // Get last 6 months of data
        const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
        const categoryArray = Array.from(categories);

        const datasets = categoryArray.map((category, index) => ({
            data: sortedMonths.map(
                (month) => monthlyData[month][category] || 0,
            ),
            color: (opacity = 1) => {
                const colors = [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ];
                return colors[index % colors.length];
            },
        }));

        return {
            labels: sortedMonths.map((month) => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: '2-digit',
                });
            }),
            datasets,
        };
    };

    const chartData = getMonthlyData();

    if (chartData.labels.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses to display</Text>
            </View>
        );
    }

    // Calculate total for each dataset to show in legend
    const totals = chartData.datasets.map((dataset) =>
        dataset.data.reduce((sum, value) => sum + value, 0),
    );

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={{
                        labels: chartData.labels,
                        datasets: [{ data: totals }], // Show total for simplicity
                    }}
                    width={Math.max(
                        screenWidth - 32,
                        chartData.labels.length * 80,
                    )}
                    height={220}
                    chartConfig={{
                        backgroundColor: colors.surface,
                        backgroundGradientFrom: colors.surface,
                        backgroundGradientTo: colors.surface,
                        decimalPlaces: 0,
                        color: (opacity = 1) => colors.accent,
                        labelColor: (opacity = 1) => colors.text,
                        style: {
                            borderRadius: 16,
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: '',
                            stroke: colors.border,
                            strokeWidth: 1,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    fromZero
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
});
