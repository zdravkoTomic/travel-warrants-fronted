import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormDepartmentValueErrors, IFormDepartmentValues} from "../departmentTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {departmentFormErrors} from "./departmentFormErrors";
import DepartmentForm from "../../Department/Item/DepartmentForm";

export default function DepartmentEditPage() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormDepartmentValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormDepartmentValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormDepartmentValues) => {
        fetch(api.getUri() + `/departments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_department')
                    successToastMessage('Zapis uspješno ažuriran')
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

    return DepartmentForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}