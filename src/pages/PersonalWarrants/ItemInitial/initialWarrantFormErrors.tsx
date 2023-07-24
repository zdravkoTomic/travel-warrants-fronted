import {VehicleType} from "../../../components/Constants";

export function initialWarrantFormErrors(values: any) {
    const errors: Partial<any> = {};

    if (!values.departurePoint) {
        errors.departurePoint = 'Obavezan unos';
    }

    if (!values.destinationCountry) {
        errors.destinationCountry = 'Obavezan unos';
    }

    if (!values.destination) {
        errors.destination = 'Obavezan unos';
    }

    if (!values.expectedTravelDuration) {
        errors.expectedTravelDuration = 'Obavezan unos';
    }

    if (!values.travelPurposeDescription) {
        errors.travelPurposeDescription = 'Obavezan unos';
    }

    if (!values.departureDate) {
        errors.departureDate = 'Obavezan unos';
    }

    if (!values.vehicleType) {
        errors.vehicleType = 'Obavezan unos';
    }

    if (values.vehicleType.code === VehicleType.OTHER && !values.vehicleDescription) {
        errors.vehicleDescription = 'Obavezan unos ako je odbrana vrsta vozila "Ostalo"';
    }

    return errors;
}