import api from "../api";
import {alertToastMessage} from "./alertToastMessage";

export function downloadPdf(warrantId: number) {
    fetch(api.getUri() + `/warrants/${warrantId}/report`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.blob();
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TravelWarrant${warrantId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch((error) => {
            alertToastMessage(null);
        })
}