import {useEffect, useState} from "react";
import {IDepartment} from "../departmentTypes";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";

export default function DepartmentForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [department, setDepartment] = useState<IDepartment>();
    const [departmentCatalog, setDepartmentCatalog] = useState<any[]>();

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
    }, [])


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/departments/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setDepartment(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!department && id) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer/>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Organizacijski dijelovi - novi zapis</h1>
            </div>

            <Formik
                initialValues={{
                    code: department?.code ? department.code : '',
                    name: department?.name ? department.name : '',
                    parent: department?.parent ? department.parent["@id"] : {},
                    active: department?.active ? department.active : true,
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                {({ touched, errors}) => (
                    <Form>
                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="code">Kod organizacijskog dijela:</label>
                                <Field className="form-control" type="text" id="code" name="code"/>
                                {handleFormErrors(errors?.code, serverSideErrors?.code, touched.code)}
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="name">Naziv organizacijskog dijela:</label>
                                <Field className="form-control" type="text" id="name" name="name"/>
                                {handleFormErrors(errors?.name, serverSideErrors?.name, touched.name)}
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="parent">Nadređeni organizacijski dio:</label>
                                <Field className="form-select" id="floatingInput" name="parent" as="select">
                                    <option value="">Odaberite nadređeni organizacijski dio</option>
                                    {departmentCatalog?.map((parent) => (
                                        <option key={parent.id} value={parent["@id"]}>
                                            {parent.name}
                                        </option>
                                    ))}
                                </Field>
                                {handleFormErrors(errors?.parent, serverSideErrors?.parent, touched.parent)}
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