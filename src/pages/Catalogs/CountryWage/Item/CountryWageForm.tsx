import React, {useEffect, useState} from "react";
import {ICountryWage} from "../countryWageTypes";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";
import {isAuthorized} from "../../../../components/Security/UserAuth";
import Unauthorized from "../../../Security/Unauthorized";
import Spinner from "../../../../components/Utils/Spinner";

export default function CountryWageForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [countryWage, setCountryWage] = useState<ICountryWage>();
    const [countryCatalog, setCountryCatalog] = useState<any[]>();
    const [currencyCatalog, setCurrencyCatalog] = useState<any[]>();

    useEffect(() => {
        fetch(api.getUri() + `/catalog/countries?order[name]=asc`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then((response) => {
                return response.json()
            })
            .then(response => {
                    setCountryCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/currencies?order[name]=asc`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then((response) => {
                return response.json()
            })
            .then(response => {
                    setCurrencyCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });
    }, [])


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/country-wages/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setCountryWage(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!countryWage && id) {
        return <Spinner/>;
    }

    return (
        <>
            {isAuthorized(['ROLE_ADMIN', 'ROLE_PROCURATOR']) ? (
                <div>
                    <ToastContainer/>
                    <div className="row">
                        <h1 className="mx-auto col-10 col-md-8 col-lg-6">Valute - novi zapis</h1>
                    </div>

                    <Formik
                        initialValues={{
                            country: countryWage?.country ? countryWage.country["@id"] : '',
                            currency: countryWage?.currency ? countryWage.currency["@id"] : '',
                            amount: countryWage?.amount ? countryWage.amount : '',
                            active: countryWage?.active ? countryWage.active : true,
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="country">Država:</label>
                                        <Field id="floatingInput" className="form-select" name="country" as="select">
                                            <option value="">Odaberite državu</option>
                                            {countryCatalog?.map((country) => (
                                                <option key={country.id} value={country["@id"]}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.country, serverSideErrors?.country, touched.country)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="currency">Valuta:</label>
                                        <Field id="floatingInput" className="form-select" name="currency" as="select">
                                            <option value="">Odaberite valutu</option>
                                            {currencyCatalog?.map((currency) => (
                                                <option key={currency.id} value={currency["@id"]}>
                                                    {currency.code} ({currency.name})
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.currency, serverSideErrors?.currency, touched.currency)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="name">Iznos:</label>
                                        <Field id="floatingInput" className="form-control" type="number" name="amount"/>
                                        {handleFormErrors(errors?.amount, serverSideErrors?.amount, touched.amount)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                                        <label className="form-check-label" htmlFor="active">Aktivno</label>
                                        <Field id="floatingInput" name="active" type="checkbox"
                                               className="form-check-input"/>
                                        {handleFormErrors(errors?.active, serverSideErrors?.active, touched.active)}
                                    </div>
                                </div>

                                <div className="row">
                                    <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary"
                                            type="submit">Submit
                                    </button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                Unauthorized()
            )}
        </>
    );
}