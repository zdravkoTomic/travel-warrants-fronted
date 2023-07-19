import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormVehicleTypeValueErrors, IFormVehicleTypeValues} from "../vehicleTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {vehicleTypeFormErrors} from "./vehicleTypeFormErrors";
import VehicleTypeForm from "./VehicleTypeForm";

export default function VehicleTypeEditPage() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormVehicleTypeValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormVehicleTypeValues) => {
        fetch(api.getUri() + `/vehicle-types/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_vehicle_types')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormVehicleTypeValueErrors = {
                        name: null,
                        code: null,
                        codeNumeric: null,
                        active: null
                    };

                    response['violations'].forEach((violation) => {
                        if (violation.propertyPath! in serverErrors && violation.propertyPath !== null) {
                            serverErrors[violation.propertyPath as string] = violation.message
                        }
                    });

                    setErrors(serverErrors)
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

    return VehicleTypeForm(handleSubmit, validateForm, errors, id)
}