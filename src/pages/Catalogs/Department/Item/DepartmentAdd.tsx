import {useState} from "react";
import {IFormDepartmentValueErrors, IFormDepartmentValues} from "../departmentTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {departmentFormErrors} from "./departmentFormErrors";
import DepartmentForm from "../../Department/Item/DepartmentForm";

export default function DepartmentAdd() {
    const [errors, setErrors] = useState<IFormDepartmentValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormDepartmentValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormDepartmentValues) => {
        if (values.parent && Object.keys(values.parent).length === 0) {
            values.parent = null
        }

        fetch(api.getUri() + '/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_department')
                    successToastMessage('Zapis uspješno dodan')
                }

                if (!response.ok && response.status !== 422) {
                    throw new Error('Server side error');
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormDepartmentValueErrors = {
                        code: null,
                        name: null,
                        parent: null,
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

    const validateForm = (values: IFormDepartmentValues) => {
        setErrors(departmentFormErrors(values))
        return errors;
    };

    return DepartmentForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}