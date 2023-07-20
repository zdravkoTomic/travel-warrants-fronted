import {alertDanger} from "../../components/Utils/alertDanger";

export default function Unauthorized() {
    return alertDanger('Nemate pravo pristupa ovom ekranu')
}