import {IFormCurrencyValues} from "../../../../types/Catalog/currencyTypes";

export function currencyFormErrors (values: IFormCurrencyValues) {
    const errors: Partial<IFormCurrencyValues> = {};

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    if (!values.codeNumeric) {
        errors.codeNumeric = 'Obavezan unos';
    }

    if (values.code.length > 3) {
        errors.code = 'Maximilan unos 3 znakova';
    }

    if (values.codeNumeric.length > 3) {
        errors.codeNumeric = 'Maximilan unos 3 znakova';
    }

    if (isNaN(Number(values.codeNumeric))) {
        errors.codeNumeric = 'Samo brojčani unos dozvoljen';
    }

    return errors;
}