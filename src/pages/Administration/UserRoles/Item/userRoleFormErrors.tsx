export function userRoleFormErrors (values: any) {
    const errors: Partial<any> = {};

    if (!values.employee) {
        errors.country = 'Obavezan unos';
    }

    if (!values.role) {
        errors.role = 'Obavezan unos';
    }

    if (!values.department) {
        errors.department = 'Obavezan unos';
    }

    return errors;
}