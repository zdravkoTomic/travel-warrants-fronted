import {useState} from "react";
import {IFormExpenseTypeValueErrors, IFormExpenseTypeValues} from "../expenseTypes";
import {useNavigate} from "react-router-dom";
import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {expenseTypeFormErrors} from "./expenseTypeFormErrors";
import ExpenseTypeForm from "./ExpenseTypeForm";

export default function ExpenseTypeAdd() {
    const [errors, setErrors] = useState<IFormExpenseTypeValueErrors>();
    const navigate = useNavigate();

    const handleSubmit = (values: IFormExpenseTypeValues) => {
        fetch(api.getUri() + '/expense-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            body: JSON.stringify(values),
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    navigate('/catalog_expense_types')
                    successToastMessage('Zapis uspješno dodan')
                }

                return response.json()
            })
            .then((response) => {
                if (Array.isArray(response['violations'])) {
                    const serverErrors: IFormExpenseTypeValueErrors = {
                        name: null,
                        code: null,
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

    const validateForm = (values: IFormExpenseTypeValues) => {
        setErrors(expenseTypeFormErrors(values))
        return errors;
    };

    return ExpenseTypeForm(handleSubmit, validateForm, errors, null)
}