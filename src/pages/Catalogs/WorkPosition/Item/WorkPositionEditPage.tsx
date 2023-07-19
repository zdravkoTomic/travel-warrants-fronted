import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {IFormWorkPositionValueErrors, IFormWorkPositionValues} from "../workPositionTypes";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {workPositionFormErrors} from "../../WorkPosition/Item/workPositionFormErrors";
import WorkPositionForm from "./WorkPositionForm";

export default function WorkPositionEditPage() {
    const {id} = useParams<{ id: any }>();

    const [errors, setErrors] = useState<IFormWorkPositionValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormWorkPositionValues) => {
        fetch(api.getUri() + `/work-positions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_work_positions')
                    successToastMessage('Zapis uspješno ažuriran')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormWorkPositionValueErrors = {
                        name: null,
                        code: null,
                        codeNumeric: null,
                        active: null
                    };

                    response['violations'].forEach((violation) => {
                        if (violation.propertyPath! in serverErrors && violation.propertyPath !== null) {
                            serverErrors[violation.propertyPath as string] = violation.message
                        }
                    });

                    setErrors(serverErrors)
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const validateForm = (values: IFormWorkPositionValues) => {
        setErrors(workPositionFormErrors(values))
        return errors;
    };

    return WorkPositionForm(handleSubmit, validateForm, errors, id)
}