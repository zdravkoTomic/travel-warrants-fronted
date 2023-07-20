import {useState} from "react";
import {IFormEmployeeValueErrors, IFormEmployeeValues} from "../employeeTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {employeeFormErrors} from "./employeeFormErrors";
import EmployeeForm from "../../Employee/Item/EmployeeForm";

export default function EmployeeAdd() {
    const [errors, setErrors] = useState<IFormEmployeeValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormEmployeeValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormEmployeeValues) => {
        fetch(api.getUri() + '/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_employees')
                    successToastMessage('Zapis uspješno dodan')
                }

                if (!response.ok && response.status !== 422) {
                    throw new Error('Server side error');
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

    return EmployeeForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}