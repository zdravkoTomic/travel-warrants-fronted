export interface IWarrantCalculationExpense {
    id?: any;
    expenseType: string;
    originalAmount: number;
    originalCurrency: string;
    description: string;
}

export interface IWarrantTravelItinerary {
    id?: any;
    country: string;
    enteredDate: string;
    exitedDate: string;
    returningData: boolean;
}
