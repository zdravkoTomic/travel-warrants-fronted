import React, {useEffect, useState} from "react";
import {IUserRole} from "../userRoleTypes";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {handleFormErrors} from "../../../../components/Utils/handleFormErrors";
import {isAuthorized} from "../../../../components/Security/UserAuth";
import Unauthorized from "../../../Security/Unauthorized";
import Spinner from "../../../../components/Utils/Spinner";

export default function UserRoleForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [userRole, setUserRole] = useState<IUserRole>();
    const [employeeCatalog, setEmployeeCatalog] = useState<any[]>();
    const [roleCatalog, setRoleCatalog] = useState<any[]>();
    const [departmentCatalog, setDepartmentCatalog] = useState<any[]>();

    useEffect(() => {
        fetch(api.getUri() + `/catalog/employees?order[name]=asc`,
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
                    setEmployeeCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/roles?order[name]=asc`,
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
                    setRoleCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

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
            fetch(api.getUri() + `/employee-roles/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setUserRole(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!userRole && id) {
        return <Spinner/>;
    }

    return (
        <>
            {isAuthorized(['ROLE_ADMIN']) ? (
                <div>
                    <ToastContainer/>
                    <div className="row">
                        <h1 className="mx-auto col-10 col-md-8 col-lg-6">Korisničke role - novi zapis</h1>
                    </div>

                    <Formik
                        initialValues={{
                            employee: userRole?.employee ? userRole.employee["@id"] : '',
                            role: userRole?.role ? userRole.role["@id"] : '',
                            department: userRole?.department ? userRole.department["@id"] : ''
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="employee">Korisnik:</label>
                                        <Field className="form-select" id="floatingInput" name="employee" as="select">
                                            <option value="">Odaberite zaposlenika</option>
                                            {employeeCatalog?.map((employee) => (
                                                <option key={employee.id} value={employee["@id"]}>
                                                    {employee.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.employee, serverSideErrors?.employee, touched.employee)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="role">Rola:</label>
                                        <Field className="form-select" id="floatingInput" name="role" as="select">
                                            <option value="">Odaberite rolu</option>
                                            {roleCatalog?.map((role) => (
                                                <option key={role.id} value={role["@id"]}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.role, serverSideErrors?.role, touched.role)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label" htmlFor="department">Organizacijski dio
                                            role:</label>
                                        <Field className="form-select" id="floatingInput" name="department" as="select">
                                            <option value="">Odaberite Org. dio role</option>
                                            {departmentCatalog?.map((department) => (
                                                <option key={department.id} value={department["@id"]}>
                                                    {department.name} ({department.code})
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.department, serverSideErrors?.department, touched.department)}
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