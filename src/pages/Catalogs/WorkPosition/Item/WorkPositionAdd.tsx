import {useState} from "react";
import {IFormWorkPositionValueErrors, IFormWorkPositionValues} from "../workPositionTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {workPositionFormErrors} from "./workPositionFormErrors";
import WorkPositionForm from "./WorkPositionForm";

export default function WorkPositionAdd() {
    const [errors, setErrors] = useState<IFormWorkPositionValueErrors>();
    const [serverSideErrors, setServerSideErrors] = useState<IFormWorkPositionValueErrors>();

    const navigate = useNavigate();

    const handleSubmit = (values: IFormWorkPositionValues) => {
        fetch(api.getUri() + '/work-positions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_work_positions')
                    successToastMessage('Zapis uspješno dodan')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormWorkPositionValueErrors = {
                        name: null,
                        code: null,
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

    const validateForm = (values: IFormWorkPositionValues) => {
        setErrors(workPositionFormErrors(values))
        return errors;
    };

    return WorkPositionForm(handleSubmit, validateForm, errors, serverSideErrors, null)
}