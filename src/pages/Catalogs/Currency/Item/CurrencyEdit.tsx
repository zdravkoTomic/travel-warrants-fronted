import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormCurrencyValueErrors, IFormCurrencyValues} from "../currencyTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import CurrencyForm from "./CurrencyForm";
import {currencyFormErrors} from "./currencyFormErrors";

export default function CurrencyEdit() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormCurrencyValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormCurrencyValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormCurrencyValues) => {
        fetch(api.getUri() + `/currencies/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_currencies')
                    successToastMessage('Zapis uspješno ažuriran')
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

                    setServerSideErrors(serverErrors)
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

    return CurrencyForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}