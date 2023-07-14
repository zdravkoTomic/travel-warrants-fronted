import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {ICountry} from "../../../types/Catalog/catalogTypes";
import {useEffect, useState} from "react";
import api from "../../api";

export default function CountryForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    id: any
) {
    const [country, setCountry] = useState<ICountry>();


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/countries/${encodeURIComponent(id)}`)
                .then((response) => {
                    if (!response.ok) {
                        alert(response.status) //TODO
                    }

                    return response.json()
                })
                .then(response => {
                        setCountry(response);
                    }
                )
                .catch((error) => {
                    // TODO
                    alert(error);
                });
        }
    }, [id]);

    if (!country && id) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer/>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Države - novi zapis</h1>
            </div>

            <Formik
                initialValues={{
                    code: country?.code ? country.code : '',
                    name: country?.name ? country.name : '',
                    domicile: country?.domicile ? country.domicile : false,
                    active: country?.active ? country.active : true,
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                <Form>
                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="code">Službeni međunarodni kod države:</label>
                            <Field className="form-control" type="text" id="code" name="code"/>
                            {errors?.code ? <span className="text-danger">{errors.code}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="name">Naziv države:</label>
                            <Field className="form-control" type="text" id="name" name="name"/>
                            {errors?.name ? <span className="text-danger">{errors.name}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                            <label className="form-check-label" htmlFor="domicile">Domicilna država</label>
                            <Field name="domicile" type="checkbox" className="form-check-input" id="domicile"/>
                            {errors?.domicile ? <span className="text-danger">{errors.domicile}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                            <label className="form-check-label" htmlFor="active">Aktivno</label>
                            <Field name="active" type="checkbox" className="form-check-input" id="active"/>
                            {errors?.active ? <span className="text-danger">{errors.active}</span> : ''}
                        </div>
                    </div>


                    <div className="row">
                        <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary" type="submit">Submit
                        </button>
                    </div>

                </Form>
            </Formik>
        </div>
    );
}