import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormCountryWageValueErrors, IFormCountryWageValues} from "../countryWageTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {countryWageFormErrors} from "./countryWageFormErrors";
import CountryWageForm from "../../CountryWage/Item/CountryWageForm";

export default function CountryWageEdit() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormCountryWageValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormCountryWageValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormCountryWageValues) => {
        fetch(api.getUri() + `/country-wages/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_country_wages')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormCountryWageValueErrors = {
                        country: null,
                        currency: null,
                        amount: null,
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

    const validateForm = (values: IFormCountryWageValues) => {
        setErrors(countryWageFormErrors(values))
        return errors;
    };

    return CountryWageForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}