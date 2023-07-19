import {useEffect, useState} from "react";
import {IVehicleType} from "../vehicleTypes";
import api from "../../../../components/api";
import {alertToastMessage} from "../../../../components/Utils/alertToastMessage";
import {ToastContainer} from "react-toastify";
import {Field, Form, Formik} from "formik";

export default function VehicleTypeForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    id: any
) {
    const [vehicleType, setVehicleType] = useState<IVehicleType>();

    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/vehicle-types/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setVehicleType(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!vehicleType && id) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <ToastContainer/>
            <div className="row">
                <h1 className="mx-auto col-10 col-md-8 col-lg-6">Prijevozna sredstva - novi zapis</h1>
            </div>

            <Formik
                initialValues={{
                    code: vehicleType?.code ? vehicleType.code : '',
                    name: vehicleType?.name ? vehicleType.name : '',
                    active: vehicleType?.active ? vehicleType.active : true,
                }}
                onSubmit={handleSubmit}
                validate={validateForm}
            >
                {({ touched, errors }) => (
                    <Form>
                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="code">Kod Prijevoznog sredstva:</label>
                                <Field className="form-control" type="text" id="code" name="code"/>
                                {touched.code && errors?.code ? <span className="text-danger">{errors.code}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                <label className="form-label" htmlFor="name">Naziv prijevoznog sredstva:</label>
                                <Field className="form-control" type="text" id="name" name="name"/>
                                {touched.name && errors?.name ? <span className="text-danger">{errors.name}</span> : ''}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                                <label className="form-check-label" htmlFor="active">Aktivno</label>
                                <Field name="active" type="checkbox" className="form-check-input" id="active"/>
                                {touched.active && errors?.active ? <span className="text-danger">{errors.active}</span> : ''}
                            </div>
                        </div>


                        <div className="row">
                            <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary" type="submit">Submit
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
}