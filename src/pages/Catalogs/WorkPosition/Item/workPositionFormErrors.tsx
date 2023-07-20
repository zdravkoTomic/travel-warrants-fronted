import {IFormWorkPositionValues} from "../workPositionTypes";

export function workPositionFormErrors(values: IFormWorkPositionValues) {
    const errors: Partial<IFormWorkPositionValues> = {};

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    return errors;
}