export interface IFormCountryValues {
    name: string;
    code: string;
    domicile: boolean;
    active: boolean;
}

export interface IFormCountryValueErrors {
    [key: string]: string | undefined | null | boolean;

    name?: string | null;
    code?: string | null;
    domicile?: boolean | null;
    active?: boolean | null;
}

export interface ICountry {
    id: number,
    code: string,
    name: string,
    active: boolean,
    domicile: boolean
}

export interface ICountryModalData {
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
    domicile: {
        title: string,
        value: string
    }
}
