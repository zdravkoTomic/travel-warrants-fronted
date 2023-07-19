import React from "react";

export function handleFormErrors(errorField: any, serverSideErrorField: any, touched: any) {
    if (touched && errorField) {
        return <span className="text-danger">{errorField}</span>
    } else if (serverSideErrorField) {
        return <span className="text-danger">{serverSideErrorField}</span>
    } else {
        return ''
    }
}