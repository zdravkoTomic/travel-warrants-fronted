import {useNavigate} from 'react-router-dom';
import {isFullyAuthenticated} from "./UserAuth";
import {useEffect} from "react";

export function useHandleNonAuthenticated() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isFullyAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);
}