import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormUserRoleValueErrors, IFormUserRoleValues} from "../userRoleTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {userRoleFormErrors} from "./userRoleFormErrors";
import UserRoleForm from "./UserRoleForm";

export default function UserRoleEdit() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormUserRoleValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormUserRoleValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormUserRoleValues) => {
        fetch(api.getUri() + `/employee-roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/user_roles')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormUserRoleValueErrors = {
                        country: null,
                        currency: null,
                        amount: null
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

    return UserRoleForm(handleSubmit, validateForm, errors, serverSideErrors, id)
}