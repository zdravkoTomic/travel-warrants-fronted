export interface IFormExpenseTypeValues {
    name: string;
    code: string;
    active: boolean;
}

export interface IFormExpenseTypeValueErrors {
    [key: string]: string | undefined | null |  boolean;

    name?: string | null;
    code?: string | null;
    active?: boolean | null;
}

export interface IExpenseType {
    id: number,
    code: string,
    name: string,
    active: boolean,
}

export interface IExpenseTypeModalData {
    code: {
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
