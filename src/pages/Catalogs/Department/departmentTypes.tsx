export interface IFormDepartmentValues {
    [key: string]: any | object | number | boolean | null;

    code: string,
    name: string,
    parent?: {
        code?: string | undefined;
        name?: string | undefined;
    } | null;
    active: boolean;
}

export interface IFormDepartmentValueErrors {
    [key: string]: any | object | number | boolean;

    code?: string | null;
    name?: string | null;
    parent?: string | null;
    active?: boolean | null;
}

export interface IDepartment {
    code: string;
    name: string;
    parent: {
        '@id': string;
        code: string,
        name: string
    }
    active: boolean;
}

export interface IDepartmentModalData {
    code: {
        title: string,
        value: string
    },
    name: {
        title: string,
        value: string
    },
    parentCode: {
        title: string,
        value: string
    },
    parentName: {
        title: string,
        value: string
    },
    active: {
        title: string,
        value: string
    },
}