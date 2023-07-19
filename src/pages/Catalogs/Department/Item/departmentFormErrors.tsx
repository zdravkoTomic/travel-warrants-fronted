export function departmentFormErrors (values: any) {
    const errors: Partial<any> = {};

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    return errors;
}