import AsyncStorage from '@react-native-async-storage/async-storage';
import { Labels, Expenses, CurrencyRates } from '../types';

const STORAGE_KEYS = {
    LABELS: 'Labels',
    EXPENSES: 'Expenses',
    CURRENCY_RATES: 'CurrencyRates',
};

// Default labels setup
export const getDefaultLabels = (): Labels => ({
    currency: {
        name: 'Currency',
        values: [
            { value: 'ARS', isDefault: true },
            { value: 'CHF', isDefault: false },
            { value: 'EUR', isDefault: false },
        ],
        isFixed: true,
    },
    card: {
        name: 'Card',
        values: [
            { value: 'CIC', isDefault: true },
            { value: 'BCV', isDefault: false },
            { value: 'Sabadell', isDefault: false },
        ],
    },
    category: {
        name: 'Category',
        values: [
            { value: 'Rent', isDefault: true },
            { value: 'Supermarket', isDefault: false },
            { value: 'Sport', isDefault: false },
            { value: 'Transport', isDefault: false },
            { value: 'Health', isDefault: false },
            { value: 'Miscellanious', isDefault: false },
            { value: 'Food', isDefault: false },
            { value: 'Non consumable', isDefault: false },
            { value: 'Recurrent', isDefault: false },
            { value: 'GAINS', isDefault: false },
        ],
    },
});

export const getDefaultCurrencyRates = (): CurrencyRates => ({
    ARS: 1,
    CHF: 1200,
    EUR: 1100,
});

// Storage operations for labels
export const loadLabels = async (): Promise<Labels> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.LABELS);
        if (stored) {
            return JSON.parse(stored);
        }
        // If no labels exist, create and save default ones
        const defaultLabels = getDefaultLabels();
        await saveLabels(defaultLabels);
        return defaultLabels;
    } catch (error) {
        console.error('Failed to load labels:', error);
        return getDefaultLabels();
    }
};

export const saveLabels = async (labels: Labels): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.LABELS, JSON.stringify(labels));
    } catch (error) {
        console.error('Failed to save labels:', error);
        throw error;
    }
};

// Storage operations for expenses
export const loadExpenses = async (): Promise<Expenses> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load expenses:', error);
        return {};
    }
};

export const saveExpenses = async (expenses: Expenses): Promise<void> => {
    try {
        await AsyncStorage.setItem(
            STORAGE_KEYS.EXPENSES,
            JSON.stringify(expenses),
        );
    } catch (error) {
        console.error('Failed to save expenses:', error);
        throw error;
    }
};

// Storage operations for currency rates
export const loadCurrencyRates = async (): Promise<CurrencyRates> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY_RATES);
        if (stored) {
            return JSON.parse(stored);
        }
        // If no rates exist, create and save default ones
        const defaultRates = getDefaultCurrencyRates();
        await saveCurrencyRates(defaultRates);
        return defaultRates;
    } catch (error) {
        console.error('Failed to load currency rates:', error);
        return getDefaultCurrencyRates();
    }
};

export const saveCurrencyRates = async (
    rates: CurrencyRates,
): Promise<void> => {
    try {
        await AsyncStorage.setItem(
            STORAGE_KEYS.CURRENCY_RATES,
            JSON.stringify(rates),
        );
    } catch (error) {
        console.error('Failed to save currency rates:', error);
        throw error;
    }
};

// Migration function to convert old expense format to new format
export const migrateOldExpenses = async (): Promise<void> => {
    try {
        const oldExpenses = await AsyncStorage.getItem('Expenses');
        if (!oldExpenses) return;

        const parsed = JSON.parse(oldExpenses);

        // Check if it's already in new format
        const firstExpense = Object.values(parsed)[0] as any;
        if (firstExpense && firstExpense.labels) {
            return; // Already migrated
        }

        // Convert to new format
        const newExpenses: Expenses = {};
        Object.entries(parsed).forEach(([id, expense]: [string, any]) => {
            newExpenses[id] = {
                id,
                time: expense.time,
                value: expense.value,
                labels: {
                    currency: expense.currency || 'ARS',
                    card: expense.card || 'CIC',
                    category: expense.category || 'Rent',
                },
            };
        });

        await saveExpenses(newExpenses);
        console.log('Successfully migrated old expenses to new format');
    } catch (error) {
        console.error('Failed to migrate old expenses:', error);
    }
};
