import React, {useState} from 'react';
import { Container, Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import api from "../../components/api";
import {toast, ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {IFormLoginValueErrors, IFormLoginValues} from "../../types/loginTypes";
import Spinner from "../../components/Utils/Spinner";

export default function LoginPage() {
    const [errors, setErrors] = useState<IFormLoginValueErrors>();
    const navigate = useNavigate();
    const [user, setUser] = useState();


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
                }

                if (response.status !== 401) {
                    throw new Error('Invalid credentials');
                }

                return response.json();
            })
            .then((response) => {
                if (response.error) {
                    setErrors({email: response.error})
                } else {
                    setUser(response.user);

                    navigate('/personal/initial')
                }
            })
            .catch((error) => {
                toast.error('Greška! Pokušajte kasnije', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    };

    const validateForm = (values: IFormLoginValues) => {
        const errors: Partial<IFormLoginValues> = {};

        if (!values.email) {
            errors.email = 'Obavezan unos';
        }

        if (!values.email) {
            errors.email = 'Obavezan unos';
        }

        setErrors(errors)
        return errors;
    };

    return (
        <div>
            <ToastContainer/>
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
                <Form>
                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="code">Email:</label>
                            <Field className="form-control" type="email" placeholder="Email" id="code" name="email"/>
                            {errors?.email ? <span className="text-danger">{errors.email}</span> : ''}
                        </div>
                    </div>

                    <div className="row">
                        <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                            <label className="form-label" htmlFor="name">Loznika:</label>
                            <Field className="form-control" type="text" placeholder="Password" id="name" name="password"/>
                            {errors?.password ? <span className="text-danger">{errors.password}</span> : ''}
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