import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormInitialWarrantValueErrors, IFormInitialWarrantValues} from "../initialWarrantTypes";
import api from "../../../components/api";
import {successToastMessage} from "../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";
import {initialWarrantFormErrors} from "./initialWarrantFormErrors";
import InitialWarrantForm from "./InitialWarrantForm";

export default function InitialWarrantEdit() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormInitialWarrantValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormInitialWarrantValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormInitialWarrantValues) => {
        fetch(api.getUri() + `/warrants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/personal_warrant/initial')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormInitialWarrantValueErrors = {
                        departurePoint: null,
                        destinationCountry: null,
                        destination: null,
                        expectedTravelDuration: null,
                        travelPurposeDescription: null,
                        departureDate: null,
                        vehicleType: null,
                        vehicleDescription: null,
                        advancesAmount: null
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

    const validateForm = (values: IFormInitialWarrantValues) => {
        setErrors(initialWarrantFormErrors(values))
        return errors;
    };

    return InitialWarrantForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}