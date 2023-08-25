import api from "../api";
import {alertToastMessage} from "./alertToastMessage";

export function downloadExpenseReportExcel(paymentId: number) {
    fetch(api.getUri() + `/payments/${paymentId}/report`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
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
            a.download = `Payment${paymentId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch((error) => {
            alertToastMessage(null);
        })
}