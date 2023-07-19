import React, {useEffect, useState} from "react";
import {IEmployee} from "../employeeTypes";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {ToastContainer} from "react-toastify";
import {Field, FieldProps, Form, Formik} from "formik";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export default function EmployeeForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [employee, setEmployee] = useState<IEmployee>();
    const [departmentCatalog, setDepartmentCatalog] = useState<any[]>();
    const [workPositionCatalog, setWorkPositionCatalog] = useState<any[]>();

    useEffect(() => {
        fetch(api.getUri() + `/catalog/departments?order[name]=asc`,
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
                    setDepartmentCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/work-positions?order[name]=asc`,
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
                    setWorkPositionCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });
    }, [])


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/employees/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setEmployee(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!employee && id) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer/>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Zaposlenici - novi zapis</h1>
            </div>

            <Formik
                initialValues={{
                    department: employee?.department ? employee.department["@id"] : '',
                    workPosition: employee?.workPosition ? employee.workPosition["@id"] : '',
                    code: employee?.code ? employee.code : '',
                    name: employee?.name ? employee.name : '',
                    surname: employee?.surname ? employee.surname : '',
                    username: employee?.username ? employee.username : '',
                    email: employee?.email ? employee.email : '',
                    dateOfBirth: employee?.dateOfBirth
                        ? employee.dateOfBirth
                        : '',
                    active: employee?.active ? employee.active : true,
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                {({touched, errors}) => (
                    <Form>
                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="code">Jedinstveni kod zaposlenika:</label>
                                <Field className="form-control" type="text" id="code" name="code"/>
                                {handleFormErrors(errors?.code, serverSideErrors?.code, touched.code)}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="name">Ime zaposlenika:</label>
                                <Field className="form-control" type="text" id="name" name="name"/>
                                {touched.name && errors?.name ? <span className="text-danger">{errors.name}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="surname">Prezime zaposlenika:</label>
                                <Field className="form-control" type="text" name="surname" id="surname"/>
                                {touched.surname && errors?.surname ?
                                    <span className="text-danger">{errors.surname}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="username">Korisničko ime:</label>
                                <Field className="form-control" type="text" id="username" name="username"/>
                                {touched.username && errors?.username ?
                                    <span className="text-danger">{errors.username}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="email">Email zaposlenika:</label>
                                <Field className="form-control" type="email" id="email" name="email"/>
                                {touched.email && errors?.email ?
                                    <span className="text-danger">{errors.email}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="department">Organizacijski dio:</label>
                                <Field className="form-select" id="floatingInput" name="department" as="select">
                                    <option value="">Odaberite Organizacijski dio</option>
                                    {departmentCatalog?.map((department) => (
                                        <option key={department.id} value={department["@id"]}>
                                            {department.name}
                                        </option>
                                    ))}
                                </Field>
                                {handleFormErrors(errors?.department, serverSideErrors?.department, touched.department)}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="workPosition">Radno mjesto:</label>
                                <Field className="form-select" id="floatingInput" name="workPosition" as="select">
                                    <option value="">Odaberite radno mjesto</option>
                                    {workPositionCatalog?.map((workPosition) => (
                                        <option key={workPosition.id} value={workPosition["@id"]}>
                                            {workPosition.name}
                                        </option>
                                    ))}
                                </Field>
                                {handleFormErrors(errors?.workPosition, serverSideErrors?.workPosition, touched.workPosition)}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="dateOfBirth">
                                    Date of Birth:
                                </label>
                                <Field name="dateOfBirth">
                                    {({field, form}: FieldProps) => {
                                        const selectedDate = field.value ? new Date(field.value) : null;
                                        return (
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                                className="form-control"
                                                id="dateOfBirth"
                                                placeholderText="Datum rođenja zaposlenika"
                                                dateFormat="dd.MM.yyyy"
                                            />)
                                    }}
                                </Field>
                            </div>
                        </div>


                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                                <label className="form-check-label" htmlFor="active">Aktivno</label>
                                <Field name="active" type="checkbox" className="form-check-input" id="active"/>
                                {handleFormErrors(errors?.active, serverSideErrors?.active, touched.active)}
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