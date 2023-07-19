export interface IFormEmployeeValues {
    department: {
        code: string,
        name: string
    }
    workPosition: {
        code: string,
        codeNumeric: string,
        name: string
    }
    code: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    dateOfBirth: string;
    active: boolean;
}

export interface IFormEmployeeValueErrors {
    [key: string]: any | object | number | boolean;

    department?: string | null;
    workPosition?: string | null;
    code?: string | null;
    name?: string | null;
    surname?: string | null;
    username?: string | null;
    email?: string | null;
    dateOfBirth?: string | null;
    active?: boolean | null;
}

export interface IEmployee {
    department: {
        '@id': string,
        code: string,
        name: string
    }
    workPosition: {
        '@id': string,
        code: string,
        name: string
    }
    code: string,
    name: string,
    surname: string,
    username: string,
    email: string,
    dateOfBirth: string,
    active: boolean,
}

export interface IEmployeeModalData {
    departmentCode: {
        title: string,
        value: string
    },
    departmentName: {
        title: string,
        value: string
    },
    workPositionCode: {
        title: string,
        value: string
    },
    workPositionName: {
        title: string,
        value: string
    },
    code: {
        title: string,
        value: string
    },
    name: {
        title: string,
        value: string
    },
    surname: {
        title: string,
        value: string
    },
    username: {
        title: string,
        value: string
    },
    email: {
        title: string,
        value: string
    },
    dateOfBirth: {
        title: string,
        value: string
    },
    active: {
        title: string,
        value: string
    },
    fullyAuthorized: {
        title: string,
        value: string
    },
}