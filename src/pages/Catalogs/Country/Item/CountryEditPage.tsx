import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormCountryValueErrors, IFormCountryValues} from "../../../../types/Catalog/countryTypes";
import api from "../../../../components/api";
import CountryForm from "../../../../components/Forms/Country/CountryForm";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {countryFormErrors} from "./countryFormErrors";

export default function CountryEditPage() {
    const {id} = useParams<{ id: any }>();

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

    return CountryForm(handleSubmit, validateForm, errors, id)
}