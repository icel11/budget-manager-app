export type LabelValue = {
    value: string;
    isDefault: boolean;
};

export type Label = {
    name: string;
    values: LabelValue[];
    isFixed?: boolean; // For currency which should remain fixed
};

export type Labels = {
    [labelName: string]: Label;
};

export type Expense = {
    id: string;
    time: string;
    value: number;
    labels: { [labelName: string]: string };
};

export type Expenses = {
    [expenseId: string]: Expense;
};

export type CurrencyRates = {
    [currency: string]: number; // Rate relative to base currency (e.g., ARS)
};

export type ViewMode = 'list' | 'pie' | 'chart';

export type FilterPeriod = 'all' | 'week' | 'month' | 'year';
