export interface IFormWorkPositionValues {
    name: string;
    code: string;
    active: boolean;
}

export interface IFormWorkPositionValueErrors {
    [key: string]: string | undefined | null | boolean;

    name?: string | null;
    code?: string | null;
    active?: boolean | null;
}

export interface IWorkPosition {
    id: number,
    code: string,
    name: string,
    active: boolean,
}

export interface IWorkPositionModalData {
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