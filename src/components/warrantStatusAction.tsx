import api from "./api";
import {successToastMessage} from "./Utils/successToastMessage";
import {alertToastMessage} from "./Utils/alertToastMessage";

export const changeWarrantStatus = (setLoading: any, setRefresh: any) => (warrantId: number, statusCode: string) => {
    setLoading(true)
    fetch(
        api.getUri() + `/warrant-statuses/code/${statusCode}`,
        {
            headers: {
                'Content-Type': 'application/ld+json'
            },
            credentials: 'include',
        }
    )
        .then(response => response.json())
        .then(response => {
            const values = {
                "status": `/travel-warrants/public/api/warrant-statuses/${response.id}`
            }
            fetch(api.getUri() + `/warrants/${warrantId}/change_status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include',
            })
                .then((response) => {
                    if (response.ok) {
                        successToastMessage('Status naloga uspješno promijenjen')
                    } else {
                        throw new Error('Server side error');
                    }
                })
                .catch((error) => {
                    alertToastMessage(null);
                });
        })
        .catch((error) => {
            alertToastMessage(null);
        })
        .finally(() => {
            setLoading(false);
            setRefresh((prevState: number) => prevState + 1);
        })
};