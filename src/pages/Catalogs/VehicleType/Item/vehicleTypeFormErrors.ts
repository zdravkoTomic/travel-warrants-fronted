import {IFormVehicleTypeValues} from "../vehicleTypes";

export function vehicleTypeFormErrors (values: IFormVehicleTypeValues) {
    const errors: Partial<IFormVehicleTypeValues> = {};

    if (!values.name) {
        errors.name = 'Obavezan unos';
    }

    if (!values.code) {
        errors.code = 'Obavezan unos';
    }

    return errors;
}