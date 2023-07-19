import {useState} from "react";
import {IFormCountryWageValueErrors, IFormCountryWageValues} from "../countryWageTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {countryWageFormErrors} from "./countryWageFormErrors";
import CountryWageForm from "../../CountryWage/Item/CountryWageForm";

export default function CountryWageAddPage() {
    const [errors, setErrors] = useState<IFormCountryWageValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormCountryWageValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormCountryWageValues) => {
        fetch(api.getUri() + '/country-wages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_country_wages')
                    successToastMessage('Zapis uspješno dodan')
                }

                if (!response.ok && response.status !== 422) {
                    throw new Error('Server side error');
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

    return CountryWageForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}