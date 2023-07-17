import api from "../../../components/api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CountryForm from "../../../components/Catalog/Country/CountryForm";
import {IFormCountryValueErrors, IFormCountryValues} from "../../../types/Catalog/catalogTypes";
import {successToastMessage} from "../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";

export default function CountryAddPage() {
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

    return CountryForm(handleSubmit, validateForm, errors, null)
}