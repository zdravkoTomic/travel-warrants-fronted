export interface IFormCurrencyValues {
    name: string;
    code: string;
    codeNumeric: string
    active: boolean;
}

export interface IFormCurrencyValueErrors {
    [key: string]: string | undefined | null |  boolean;

    name?: string | null;
    code?: string | null;
    codeNumeric?: string | null,
    active?: boolean | null;
}

export interface ICurrency {
    id: number,
    code: string,
    codeNumeric: string,
    name: string,
    active: boolean,
}

export interface ICurrencyModalData {
    code: {
        title: string,
        value: string
    },
    codeNumeric: {
        title: string,
        value: string
    },
    name: {
        title: string,
        value: string
    },
    active: {
        title: string,
        value: string
    }
}
