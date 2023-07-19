import {IFormExpenseTypeValues} from "../expenseTypes";

export function expenseTypeFormErrors (values: IFormExpenseTypeValues) {
    const errors: Partial<IFormExpenseTypeValues> = {};

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    return errors;
}