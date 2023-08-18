export function calculationWarrantFormErrors(values: any) {
    const errors: Partial<any> = {};

    if (!values.travelVehicleRegistration) {
        errors.travelVehicleRegistration = 'Obavezan unos';
    }

    return errors;
}