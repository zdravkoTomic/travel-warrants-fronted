import {useNavigate, useParams} from "react-router-dom";
import { useState } from "react";
import { IFormCountryValueErrors, IFormCountryValues} from "../../../types/Catalog/catalogTypes";
import api from "../../../components/api";
import {toast} from "react-toastify";
import CountryForm from "../../../components/Catalog/Country/CountryForm";
import {successToastMessage} from "../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";

export default function CountryEditPage() {
    const { id } = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormCountryValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormCountryValues) => {
        fetch(api.getUri() + `/countries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_countries')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormCountryValueErrors = {name: null, code: null, active: null, domicile: null};

                    response['violations'].forEach( (violation) => {
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

    const validateForm = (values: IFormCountryValues) => {
        const errors: Partial<IFormCountryValues> = {};

        if (!values.name) {
            errors.name = 'Obavezan unos';
        }

        if (!values.code) {
            errors.code = 'Obavezan unos';
        }

        if (values.code.length > 3) {
            errors.code = 'Maximilan unos 3 znakova';
        }

        setErrors(errors)
        return errors;
    };

    return CountryForm(handleSubmit, validateForm, errors, id)
}