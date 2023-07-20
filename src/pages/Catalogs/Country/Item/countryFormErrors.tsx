import {IFormCountryValueErrors, IFormCountryValues} from "../countryTypes";

export function countryFormErrors(values: IFormCountryValues) {
    const errors: Partial<IFormCountryValueErrors> = {};

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    if (values.code.length > 3) {
        errors.code = 'Maximilan unos 3 znakova';
    }

    return errors;
}