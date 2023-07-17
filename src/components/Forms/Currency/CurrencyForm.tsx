import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {ICurrency} from "../../../types/Catalog/currencyTypes";
import {useEffect, useState} from "react";
import api from "../../api";
import {alertToastMessage} from "../../Utils/alertToastMessage";

export default function CurrencyForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
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
        <div>
            <ToastContainer/>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Valute - novi zapis</h1>
            </div>

            <Formik
                initialValues={{
                    code: currency?.code ? currency.code : '',
                    codeNumeric: currency?.name ? currency.name : '',
                    name: currency?.name ? currency.name : '',
                    active: currency?.active ? currency.active : true,
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                {({ touched, errors }) => (
                <Form>
                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="code">Službeni međunarodni kod valute:</label>
                            <Field className="form-control" type="text" id="code" name="code"/>
                            {touched.code && errors?.code ? <span className="text-danger">{errors.code}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="codeNumeric">Službeni međunarodni brojčani kod valute:</label>
                            <Field className="form-control" type="text" id="codeNumeric" name="codeNumeric"/>
                            {touched.codeNumeric && errors?.codeNumeric ? <span className="text-danger">{errors.codeNumeric}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="name">Naziv valute:</label>
                            <Field className="form-control" type="text" id="name" name="name"/>
                            {touched.name && errors?.name ? <span className="text-danger">{errors.name}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                            <label className="form-check-label" htmlFor="active">Aktivno</label>
                            <Field name="active" type="checkbox" className="form-check-input" id="active"/>
                            {touched.active && errors?.active ? <span className="text-danger">{errors.active}</span> : ''}
                        </div>
                    </div>


                    <div className="row">
                        <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary" type="submit">Submit
                        </button>
                    </div>

                </Form>
                )}
            </Formik>
        </div>
    );
}