import {useState} from "react";
import {IFormCurrencyValueErrors, IFormCurrencyValues} from "../../../../types/Catalog/currencyTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import CurrencyForm from "../../../../components/Forms/Currency/CurrencyForm";
import {currencyFormErrors} from "./currencyFormErrors";

export default function CurrencyAddPage() {
    const [errors, setErrors] = useState<IFormCurrencyValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormCurrencyValues) => {
        fetch(api.getUri() + '/currencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_currencies')
                    successToastMessage('Zapis uspješno dodan')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormCurrencyValueErrors = {
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

    const validateForm = (values: IFormCurrencyValues) => {
        setErrors(currencyFormErrors(values))
        return errors;
    };

    return CurrencyForm(handleSubmit, validateForm, errors, null)
}