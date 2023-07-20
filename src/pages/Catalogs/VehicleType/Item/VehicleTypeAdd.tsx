import {useState} from "react";
import {IFormVehicleTypeValueErrors, IFormVehicleTypeValues} from "../vehicleTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {vehicleTypeFormErrors} from "./vehicleTypeFormErrors";
import VehicleTypeForm from "./VehicleTypeForm";

export default function VehicleTypeAdd() {
    const [errors, setErrors] = useState<IFormVehicleTypeValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormVehicleTypeValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormVehicleTypeValues) => {
        fetch(api.getUri() + '/vehicle-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_vehicle_types')
                    successToastMessage('Zapis uspješno dodan')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormVehicleTypeValueErrors = {
                        name: null,
                        code: null,
                        active: null
                    };

                    response['violations'].forEach((violation) => {
                        if (violation.propertyPath! in serverErrors && violation.propertyPath !== null) {
                            serverErrors[violation.propertyPath as string] = violation.message
                        }
                    });

                    setServerSideErrors(serverErrors)
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormVehicleTypeValues) => {
        setErrors(vehicleTypeFormErrors(values))
        return errors;
    };

    return VehicleTypeForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}