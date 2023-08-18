import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormEmployeeValueErrors, IFormEmployeeValues} from "../employeeTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import EmployeeForm from "../../Employee/Item/EmployeeForm";
import {employeeFormErrors} from "./employeeFormErrors";

export default function EmployeeEdit() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormEmployeeValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormEmployeeValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormEmployeeValues) => {
        fetch(api.getUri() + `/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_employees')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormEmployeeValueErrors = {
                        department: null,
                        workPosition: null,
                        code: null,
                        name: null,
                        surname: null,
                        username: null,
                        email: null,
                        dateOfBirth: null,
                        active: null
                    };

                    response['violations'].forEach((violation) => {
                        if (violation.propertyPath! in serverErrors && violation.propertyPath !== null) {
                            serverErrors[violation.propertyPath as string] = violation.message
                        }
                    });

                    setServerSideErrors(serverErrors)
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormEmployeeValues) => {
        setErrors(employeeFormErrors(values))
        return errors;
    };

    return EmployeeForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}