import {useState} from "react";
import {IFormUserRoleValueErrors, IFormUserRoleValues} from "../userRoleTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {userRoleFormErrors} from "./userRoleFormErrors";
import UserRoleForm from "./UserRoleForm";

export default function UserRoleAdd() {
    const [errors, setErrors] = useState<IFormUserRoleValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormUserRoleValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormUserRoleValues) => {
        fetch(api.getUri() + '/employee-roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/user_roles')
                    successToastMessage('Zapis uspješno dodan')
                }

                if (!response.ok && response.status !== 422) {
                    throw new Error('Server side error');
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormUserRoleValueErrors = {
                        employee: null,
                        role: null,
                        department: null
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

    const validateForm = (values: IFormUserRoleValues) => {
        setErrors(userRoleFormErrors(values))
        return errors;
    };

    return UserRoleForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}