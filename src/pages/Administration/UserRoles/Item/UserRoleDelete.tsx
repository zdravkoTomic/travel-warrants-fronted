import api from "../../../../components/api";
import {successToastMessage} from "../../../../components/Utils/successToastMessage";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {useNavigate, useParams} from "react-router-dom";

export function UserRoleDelete() {
    const {id} = useParams<{ id: any }>();
    const navigate = useNavigate();

    fetch(api.getUri() + `/employee-roles/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        credentials: 'include'
    })
        .then((response) => {
            if (response.ok) {
                navigate('/user_roles')
                successToastMessage('Zapis uspješno obrisan')
            }
        })
        .catch((error) => {
            navigate('/user_roles')
            alertToastMessage(null);
        });

    return <></>;
}