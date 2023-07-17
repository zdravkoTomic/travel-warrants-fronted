import {toast} from "react-toastify";

export function successToastMessage(message: string) {
    setTimeout(() => {
        toast.success(message, {
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