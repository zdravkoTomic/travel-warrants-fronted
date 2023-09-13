export function calculationWarrantFormErrors(values: any) {
    const errors: Partial<any> = {};

    if (!values.travelVehicleType) {
        errors.travelVehicleType = 'Obavezan unos';
    }

    if (!values.wageType) {
        errors.wageType = 'Obavezan unos';
    }

    if (!values.departureDate) {
        errors.departureDate = 'Obavezan unos';
    }

    if (!values.returningDate) {
        errors.returningDate = 'Obavezan unos';
    }

    if (!values.travelVehicleType) {
        errors.travelVehicleType = 'Obavezan unos';
    }

    return errors;
}