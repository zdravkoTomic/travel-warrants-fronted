export interface IFormCountryWageValues {
    country: {}
    currency: {}
    amount: number;
    active: boolean;
}

export interface IFormCountryWageValueErrors {
    [key: string]: any | object | number | boolean;

    country?: string | null;
    currency?: string | null;
    amount?: number | null;
    active?: boolean | null;
}

export interface ICountryWage {
    country: {
        '@id': string,
        code: string,
        name: string
    }
    currency: {
        '@id': string,
        code: string,
        codeNumeric: string,
        name: string
    }
    amount: number;
    active: boolean;
}

export interface ICountryWageModalData {
    countryCode: {
        title: string,
        value: string
    },
    countryName: {
        title: string,
        value: string
    },
    currencyCode: {
        title: string,
        value: string
    },
    currencyCodeNumeric: {
        title: string,
        value: string
    },
    currencyName: {
        title: string,
        value: string
    },
    amount: {
        title: string,
        value: string
    },
    active: {
        title: string,
        value: string
    },
}