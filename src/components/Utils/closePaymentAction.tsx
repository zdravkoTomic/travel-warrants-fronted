import api from "../api";
import {successToastMessage} from "./successToastMessage";
import {alertToastMessage} from "./alertToastMessage";

export const closePayment = (setLoading: any, setRefresh: any) => (paymentId: number) => {
    setLoading(true)

    fetch(api.getUri() + `/payments/${paymentId}/close`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify({}),
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                successToastMessage('Plaćanje uspješno zatvoreno')
            } else {
                throw new Error('Server side error');
            }
        })
        .catch((error) => {
            alertToastMessage(null);
        })
        .finally(() => {
            setLoading(false);
            setRefresh((prevState: number) => prevState + 1);
        })
};