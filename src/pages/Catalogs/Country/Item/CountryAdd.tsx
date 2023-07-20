import api from "../../../../components/api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CountryForm from "./CountryForm";
import {IFormCountryValueErrors, IFormCountryValues} from "../countryTypes";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {countryFormErrors} from "./countryFormErrors";

export default function CountryAdd() {
    const [errors, setErrors] = useState<IFormCountryValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormCountryValues) => {
        fetch(api.getUri() + '/countries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_countries')
                    successToastMessage('Zapis uspješno dodan')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormCountryValueErrors = {
                        name: null,
                        code: null,
                        active: null,
                        domicile: null
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

    const validateForm = (values: IFormCountryValues) => {
        setErrors(countryFormErrors(values))
        return errors;
    };

    return CountryForm(handleSubmit, validateForm, errors, null)
}