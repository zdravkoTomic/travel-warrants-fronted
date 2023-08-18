import {IWarrantCalculationExpense, IWarrantTravelItinerary} from "./calculationWarrantDependencyTypes";

export interface IFormCalculationWarrantValues {
    travelVehicleType: {},
    wageType: {},
    warrantTravelItineraries: IWarrantTravelItinerary[];
    warrantCalculationExpenses: IWarrantCalculationExpense[];
    departureDate: string
    returningDate: string,
    domicileCountryLeavingDate: string,
    domicileCountryReturningDate: string,
    travelVehicleDescription: string,
    travelVehicleRegistration: string,
    travelVehicleBrand: string,
    travelReport: string,
    odometerStart: number | null,
    odometerEnd: number | null,
    travelPurposeDescription: string,
    vehicleDescription: string,
    advancesAmount: number,
    warrant: string
}

export interface IFormCalculationWarrantValueErrors {
    [key: string]: any | object | number | boolean | string | null;

    travelVehicleType?: string | null;
    wageType?: string | null;
    warrantTravelItineraries?: IWarrantTravelItinerary[] | null;
    warrantCalculationExpenses?: IWarrantCalculationExpense[] | null;
    departureDate?: string | null;
    returningDate?: string | null;
    domicileCountryLeavingDate?: string | null;
    domicileCountryReturningDate?: string | null;
    travelVehicleDescription?: string | null;
    travelVehicleRegistration?: string | null;
    travelVehicleBrand?: string | null;
    travelReport?: string | null;
    odometerStart?: number | null;
    odometerEnd?: number | null;
    travelPurposeDescription?: string | null;
    vehicleDescription?: string | null;
    advancesAmount?: number | null;
}

export interface ICalculationWarrant {
    travelVehicleType: {
        '@id': string,
        code: string,
        name: string
    };
    wageType: {
        '@id': string,
        code: string,
        name: string
    };
    warrantTravelItineraries: {
        country: {
            '@id': string,
            code: string,
            name: string
        },
        enteredDate: string,
        exitedDate: string,
        returningData: boolean,
        timeSpent: number
    }[];
    warrantCalculationExpenses: {
        amount: number,
        currency: {
            '@id': string,
            code: string,
            name: string
        },
        expenseType: {
            '@id': string,
            code: string,
            name: string
        },
        originalAmount: number,
        originalCurrency: {
            '@id': string,
            code: string,
            name: string
        },
        description: string
    }[];
    departureDate: string;
    returningDate: string;
    domicileCountryLeavingDate: string;
    domicileCountryReturningDate: string;
    travelVehicleDescription: string;
    travelVehicleRegistration: string;
    travelVehicleBrand: string;
    travelReport: string;
    odometerStart: number;
    odometerEnd: number;
    travelPurposeDescription: string;
    vehicleDescription: string;
    advancesAmount: number;
}

export interface IWarrantCalculationModalData {
    departureDate: {
        title: string,
        value: string
    },
    returningDate: {
        title: string,
        value: string
    },
    [key: string]: {
        title: string,
        value: string
    }
}

export interface IWarrantItineraryModalData {
    country: string;
    enteredDate: string;
    exitedDate: string;
    returningData: boolean;
}