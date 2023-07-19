export function employeeFormErrors (values: any) {
    const errors: Partial<any> = {};

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.surname) {
        errors.surname = 'Obavezan unos';
    }

    if (!values.username) {
        errors.username = 'Obavezan unos';
    }

    if (!values.email) {
        errors.email = 'Obavezan unos';
    }

    if (!values.department) {
        errors.department = 'Obavezan unos';
    }

    if (!values.workPosition) {
        errors.workPosition = 'Obavezan unos';
    }

    return errors;
}