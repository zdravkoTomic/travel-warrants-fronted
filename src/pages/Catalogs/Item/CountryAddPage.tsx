import api from "../../../components/api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CountryForm from "../../../components/Catalog/Country/CountryForm";
import {IFormCountryValueErrors, IFormCountryValues} from "../../../types/Catalog/catalogTypes";

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
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_countries')
                    setTimeout(() => {
                        toast.success('Zapis uspješno dodan', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }, 1);

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
                alert(error) //TODO
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