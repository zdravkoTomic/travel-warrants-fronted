import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import api from "../../components/api";
import {Field, Form, Formik} from "formik";
import {IFormResetPasswordValueErrors, IFormResetPasswordValues} from "../../types/resetPasswordTypes";
import {alertDanger} from "../../components/Utils/alertDanger";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";

export default function ResetPassword() {
    const {employeeId} = useParams();
    const [errors, setErrors] = useState<IFormResetPasswordValueErrors>();
    const navigate = useNavigate();

    const currentUser = localStorage.getItem('user')
    const userObject = (currentUser !== null) ? JSON.parse(currentUser) : null

    const handleSubmit = (values: IFormResetPasswordValues) => {
        fetch(api.getUri() + `/employees/${employeeId}/change_password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/merge-patch+json'
            },
            body: JSON.stringify(values),
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/personal/initial')
                    const currentUser = localStorage.getItem('user')
                    let user = (currentUser !== null) ? JSON.parse(currentUser) : null
                    if (user) {
                        user.fullyAuthorized = true
                        localStorage.setItem('user', JSON.stringify(user))
                    }
                    window.location.reload();
                } else {
                    throw new Error('Server side error');
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormResetPasswordValues) => {
        const errors: Partial<IFormResetPasswordValues> = {};

        if (!values.password) {
            errors.password = 'Obavezan unos';
        }

        if (!values.password_confirm) {
            errors.password_confirm = 'Obavezan unos';
        }

        if (values.password !== values.password_confirm) {
            errors.password_confirm = 'Lozinke se ne podudaraju';
        }

        setErrors(errors)
        return errors;
    };

    return (
        <div>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Reset Lozinke</h1>
            </div>

            <div className="row">
                <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                    {alertDanger('Kako biste u potpunosti aktivirali svoj korisnički račun morate promijeniti svoju lozinku')}
                </div>
            </div>

            <Formik
                initialValues={{
                    password: '',
                    password_confirm: '',
                    email: userObject.email
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                <Form>
                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="password">Loznika:</label>
                            <Field id="floatingInput" className="form-control" type="password" placeholder="Password"
                                   name="password"/>
                            {errors?.password ? <span className="text-danger">{errors.password}</span> : ''}
                        </div>
                    </div>


                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="password_confirm">Ponovljena lozinka:</label>
                            <Field id="floatingInput" className="form-control" type="password"
                                   placeholder="Password confirm"
                                   name="password_confirm"/>
                            {errors?.password_confirm ?
                                <span className="text-danger">{errors.password_confirm}</span> : ''}
                        </div>
                    </div>

                    <Field type="hidden" name="email"/>

                    <div className="row">
                        <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary" type="submit">Reset
                        </button>
                    </div>

                </Form>
            </Formik>
        </div>
    );
}