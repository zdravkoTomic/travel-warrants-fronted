
import {Alert} from "react-bootstrap";
import React from "react";

export function alertDanger(message: string) {
    return <div>
        <br/>
        <Alert variant="danger">
            {message}
        </Alert>
    </div>
}