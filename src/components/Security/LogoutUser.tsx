import React, {CSSProperties, useEffect, useState} from "react";
import {IFormLoginValueErrors, IFormLoginValues} from "../../types/loginTypes";
import {useNavigate} from "react-router-dom";
import api from "../api";
import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";
import {ClipLoader} from "react-spinners";
import Spinner from "../Utils/Spinner";


export default function LogoutUser() {
    const [errors, setErrors] = useState<IFormLoginValueErrors>();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(api.getUri() + '/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then((response) => {
                localStorage.removeItem('sessionCookie');
                navigate('/login')
            })
            .then((response) => {


            })
            .catch((error) => {
                alert(error) //TODO
            });
    })

    return Spinner()
}