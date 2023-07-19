export interface IFormVehicleTypeValues {
    name: string;
    code: string;
    active: boolean;
}

export interface IFormVehicleTypeValueErrors {
    [key: string]: string | undefined | null |  boolean;

    name?: string | null;
    code?: string | null;
    active?: boolean | null;
}

export interface IVehicleType {
    id: number,
    code: string,
    name: string,
    active: boolean,
}

export interface IVehicleTypeModalData {
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
