export interface IFormPersonalInitialWarrantValues {
    employee: {},
    destinationCountry: {},
    vehicleType: {},
    destination: string
    departurePoint: string,
    expectedTravelDuration: number,
    travelPurposeDescription: string,
    vehicleDescription: string,
    advancesAmount: number,
    departureDate: string
}

export interface IFormPersonalInitialWarrantValueErrors {
    [key: string]: any | object | number | boolean;

    employee?: string | null;
    country?: string | null;
    vehicleType?: string | null;
    destination?: string | null;
    departurePoint?: string | null;
    expectedTravelDuration?: number | null;
    travelPurposeDescription?: string | null;
    vehicleDescription?: string | null;
    advancesAmount?: number | null;
    departureDate?: number | null;
}

export interface IPersonalInitialWarrant {
    employee: {
        '@id': string,
        code: string,
        name: string
        username: string
    }
    department: {
        '@id': string,
        code: string,
        name: string
    }
    vehicleType: {
        '@id': string,
        name: string
    }
    status: {
        '@id': string,
        code: string,
        name: string
    }
    travelType: {
        name: string
    }
    destinationCountry: {
        '@id': string,
        code: string,
        name: string
    },
    wageCurrency: {
        '@id': string,
        code: string,
        name: string
    },
    wageAmount: number,
    code: string,
    departurePoint: string,
    destination: string,
    expectedTravelDuration: number,
    travelPurposeDescription: string,
    vehicleDescription: string,
    advancesRequired: boolean,
    advancesAmount: number,
    departureDate: string
}

export interface IPersonalInitialWarrantModalData {
    employee: {
        title: string,
        value: string
    },
    employeeWorkPosition: {
        title: string,
        value: string
    },
    warrantDepartment: {
        title: string,
        value: string
    },
    status: {
        title: string,
        value: string
    },
    travelType: {
        title: string,
        value: string
    },
    destinationCountry: {
        title: string,
        value: string
    },
    wage: {
        title: string,
        value: string
    },
    vehicleType: {
        title: string,
        value: string
    },
    code: {
        title: string,
        value: string
    },
    departurePoint: {
        title: string,
        value: string
    },
    departureDate: {
        title: string,
        value: string
    },
    expectedTravelDuration: {
        title: string,
        value: string
    },
    travelPurpose: {
        title: string,
        value: string
    },
    advancesRequired: {
        title: string,
        value: string
    },
    advancesAmount: {
        title: string,
        value: string
    },
    createdAt: {
        title: string,
        value: string
    },
    destination: {
        title: string,
        value: string
    },
}