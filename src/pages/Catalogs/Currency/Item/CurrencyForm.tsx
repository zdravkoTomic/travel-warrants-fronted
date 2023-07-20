import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {ICurrency} from "../currencyTypes";
import {useEffect, useState} from "react";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";
import {isAuthorized} from "../../../../components/Security/UserAuth";
import Unauthorized from "../../../Security/Unauthorized";

export default function CurrencyForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [currency, setCurrency] = useState<ICurrency>();

    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/currencies/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setCurrency(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!currency && id) {
        return <div>Loading...</div>;
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
                            code: currency?.code ? currency.code : '',
                            codeNumeric: currency?.codeNumeric ? currency.codeNumeric : '',
                            name: currency?.name ? currency.name : '',
                            active: currency?.active ? currency.active : true,
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="code">Službeni međunarodni kod
                                            valute:</label>
                                        <Field id="floatingInput" className="form-control" type="text" name="code"/>
                                        {handleFormErrors(errors?.code, serverSideErrors?.code, touched.code)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="codeNumeric">Službeni međunarodni
                                            brojčani kod
                                            valute:</label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="codeNumeric"/>
                                        {handleFormErrors(errors?.codeNumeric, serverSideErrors?.codeNumeric, touched.codeNumeric)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="name">Naziv valute:</label>
                                        <Field id="floatingInput" className="form-control" type="text" name="name"/>
                                        {handleFormErrors(errors?.name, serverSideErrors?.name, touched.name)}
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