import {toast} from "react-toastify";

export function alertToastMessage(message: string | null) {
    setTimeout(() => {
        toast.error(message ?? 'Greška! Pokušajte kasnije', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, 1);
}