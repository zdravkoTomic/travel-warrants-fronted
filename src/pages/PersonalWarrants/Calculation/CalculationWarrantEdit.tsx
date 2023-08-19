import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormCalculationWarrantValueErrors, IFormCalculationWarrantValues} from "./types/calculationWarrantTypes";
import api from "../../../components/api";
import {successToastMessage} from "../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";
import {calculationWarrantFormErrors} from "./calculationWarrantFormErrors";
import CalculationWarrantForm from "./CalculationWarrantForm";

export default function CalculationWarrantEdit() {
    const {id, warrantId, travelTypeCode} = useParams<{ id: any, warrantId: any, travelTypeCode: any }>();

    const [errors, setErrors] = useState<IFormCalculationWarrantValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormCalculationWarrantValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormCalculationWarrantValues) => {
        values.warrantCalculationExpenses = values.warrantCalculationExpenses.map((expense: any) => {
            const {'@id': _, '@type': __, ...rest} = expense;
            return rest;
        });
        values.warrantTravelItineraries = values.warrantTravelItineraries.map((itinerary: any) => {
            const {'@id': _, '@type': __, ...rest} = itinerary;
            return rest;
        });

        if (!values.domicileCountryLeavingDate) {
            values.domicileCountryLeavingDate = null
        }

        if (!values.domicileCountryReturningDate) {
            values.domicileCountryReturningDate = null
        }

        if (!values.odometerStart) {
            values.odometerStart = null
        }
        if (!values.odometerEnd) {
            values.odometerEnd = null
        }

        fetch(api.getUri() + `/warrant-calculations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/personal_warrant/calculation')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormCalculationWarrantValueErrors = {
                        travelVehicleType: null,
                        wageType: null,
                        departureDate: null,
                        returningDate: null,
                        domicileCountryLeavingDate: null,
                        domicileCountryReturningDate: null,
                        travelVehicleDescription: null,
                        travelVehicleRegistration: null,
                        travelVehicleBrand: null,
                        travelReport: null,
                        odometerStart: null,
                        odometerEnd: null
                    };

                    response['violations'].forEach((violation) => {
                        if (violation.propertyPath! in serverErrors && violation.propertyPath !== null) {
                            serverErrors[violation.propertyPath as string] = violation.message
                        }
                        alertToastMessage('Greška prilikom poponjavanja obrasca, provjerite svoj unos');
                    });

                    setServerSideErrors(serverErrors)
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormCalculationWarrantValues) => {
        setErrors(calculationWarrantFormErrors(values))
        return errors;
    };

    return CalculationWarrantForm(handleSubmit, validateForm, errors, serverSideErrors, warrantId, travelTypeCode, id)
}