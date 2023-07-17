import {Alert} from "react-bootstrap";
import React from "react";
import {alertDanger} from "../../components/Utils/alertDanger";

export default function UnauthorizedPage() {
    return alertDanger('Nemate pravo pristupa ovom ekranu')
}