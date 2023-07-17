import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import api from "../api";
import Spinner from "../Utils/Spinner";
import {alertToastMessage} from "../Utils/alertToastMessage";


export default function LogoutUser() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(api.getUri() + '/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((response) => {
                localStorage.removeItem('sessionCookie');
                localStorage.clear()
                navigate('/login')
                window.location.reload();
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    })

    return Spinner()
}