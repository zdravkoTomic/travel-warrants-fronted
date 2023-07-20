export interface IFormUserRoleValues {
    employee: {
        code: string,
        name: string
    }
    role: {
        name: string
    }
    department: {
        code: string,
        name: string
    }
}

export interface IFormUserRoleValueErrors {
    [key: string]: any | object | number | boolean;

    employee?: string | null;
    role?: string | null;
    department?: string | null;
}

export interface IUserRole {
    employee: {
        '@id': string,
        code: string,
        name: string,
        surname: string,
        username: string,
    }
    role: {
        '@id': string,
        code: string,
        name: string
    }
    department: {
        '@id': string,
        code: string,
        name: string
    }
}

export interface IUserRoleModalData {
    employee: {
        title: string,
        value: string
    },
    employeeCode: {
        title: string,
        value: string
    },
    employeeUsername: {
        title: string,
        value: string
    },
    employeeDepartment: {
        title: string,
        value: string
    },
    employeeActive: {
        title: string,
        value: string
    },
    employeeWorkPosition: {
        title: string,
        value: string
    },
    roleName: {
        title: string,
        value: string
    },
    department: {
        title: string,
        value: string
    }
}