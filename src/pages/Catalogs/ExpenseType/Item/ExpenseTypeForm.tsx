import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {IExpenseType} from "../expenseTypes";
import React, {useEffect, useState} from "react";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";
import {isAuthorized} from "../../../../components/Security/UserAuth";
import Unauthorized from "../../../Security/Unauthorized";
import Spinner from "../../../../components/Utils/Spinner";

export default function ExpenseTypeForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [expenseType, setExpenseType] = useState<IExpenseType>();

    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/expense-types/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setExpenseType(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!expenseType && id) {
        return <Spinner/>;
    }

    return (
        <>
            {isAuthorized(['ROLE_ADMIN', 'ROLE_PROCURATOR']) ? (
                <div>
                    <ToastContainer/>
                    <div className="row">
                        <h1 className="mx-auto col-10 col-md-8 col-lg-6">Troškovi - novi zapis</h1>
                    </div>

                    <Formik
                        initialValues={{
                            code: expenseType?.code ? expenseType.code : '',
                            name: expenseType?.name ? expenseType.name : '',
                            active: expenseType?.active || false,
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="code">Kod troška:</label>
                                        <Field id="floatingInput" className="form-control" type="text" name="code"/>
                                        {handleFormErrors(errors?.code, serverSideErrors?.code, touched.code)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="name">Naziv troška:</label>
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
                                            type="submit">Spremi
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