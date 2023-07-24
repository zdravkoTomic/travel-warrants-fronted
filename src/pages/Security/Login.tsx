import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import api from "../../components/api";
import {Field, Form, Formik} from "formik";
import {IFormLoginValueErrors, IFormLoginValues} from "../../types/loginTypes";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";
import {IFormEmployeeValueErrors} from "../Catalogs/Employee/employeeTypes";
import {handleFormErrors} from "../../components/Utils/handleFormErrors";

export default function Login() {
    const [errors, setErrors] = useState<IFormLoginValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormEmployeeValueErrors>();

    const navigate = useNavigate();


    const handleSubmit = (values: IFormLoginValues) => {
        fetch(api.getUri() + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json'
            },
            body: JSON.stringify(values),
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    const cookies = response.headers.get('Set-Cookie');

                    if (cookies) {
                        localStorage.setItem('sessionCookie', cookies);
                    }
                } else if (response.status !== 401 && !response.ok) {
                    throw new Error('Server side error');
                }

                return response.json();
            })
            .then((response) => {
                if (response.error) {
                    setServerSideErrors({email: response.error})
                } else {
                    localStorage.setItem('user', JSON.stringify(response.user))

                    if (response.user.fullyAuthorized) {
                        navigate('/personal_warrant/initial')
                        window.location.reload();
                    } else {
                        navigate(`/password_reset/${response.user.id}`)
                    }
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormLoginValues) => {
        const errors: Partial<IFormLoginValues> = {};

        if (!values.email) {
            errors.email = 'Obavezan unos';
        }

        if (!values.password) {
            errors.password = 'Obavezan unos';
        }

        setErrors(errors)
        return errors;
    };

    return (
        <div>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Login</h1>
            </div>

            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                {({touched, errors}) => (
                <Form>
                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="code">Email:</label>
                            <Field id="floatingInput" className="form-control" type="email" placeholder="Email"
                                   name="email"/>
                            {handleFormErrors(errors?.email, serverSideErrors?.email, touched.email)}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="password">Loznika:</label>
                            <Field id="floatingInput" className="form-control" type="password" placeholder="Password"
                                   name="password"/>
                            {touched.password && errors?.password ? <span className="text-danger">{errors.password}</span> : ''}
                        </div>
                    </div>


                    <div className="row">
                        <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary" type="submit">Log in
                        </button>
                    </div>

                </Form>
                )}
            </Formik>
        </div>
    );
}