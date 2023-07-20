export function countryWageFormErrors(values: any) {
    const errors: Partial<any> = {};

    if (!values.country) {
        errors.country = 'Obavezan unos';
    }

    if (!values.currency) {
        errors.currency = 'Obavezan unos';
    }

    if (!values.amount && values.amount < 1) {
        errors.amount = 'Potrebno je unijeti vrijednost';
    }

    return errors;
}