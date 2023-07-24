import React, {useEffect, useState} from "react";
import {IInitialWarrant} from "../initialWarrantTypes";
import api from "../../../components/api";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";
import Spinner from "../../../components/Utils/Spinner";
import {getCurrentUser, isAuthorized} from "../../../components/Security/UserAuth";
import {ToastContainer} from "react-toastify";
import {Field, FieldProps, Form, Formik} from "formik";
import {handleFormErrors} from "../../../components/Utils/handleFormErrors";
import Unauthorized from "../../Security/Unauthorized";
import DatePicker from "react-datepicker";
import {PATH_URI} from "../../../components/Constants";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function InitialWarrantForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    id: any
) {
    const [initialWarrant, setInitialWarrant] = useState<IInitialWarrant>();
    const [destinationCountryCatalog, setDestinationCountryCatalog] = useState<any[]>();
    const [vehicleTypeCatalog, setVehicleTypeCatalog] = useState<any[]>();

    useEffect(() => {
        fetch(api.getUri() + `/catalog/countries?order[name]=asc`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then((response) => {
                return response.json()
            })
            .then(response => {
                    setDestinationCountryCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/vehicle-types?order[code]=asc`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then((response) => {
                return response.json()
            })
            .then(response => {
                    setVehicleTypeCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });
    }, [])


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/warrants/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        setInitialWarrant(response);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!initialWarrant && id) {
        return <Spinner/>;
    }

    return (
        <>
            {isAuthorized(['ROLE_EMPLOYEE']) ? (
                <div>
                    <ToastContainer/>
                    <div className="row">
                        <h1 className="mx-auto col-10 col-md-8 col-lg-6">Novi putni nalog</h1>
                    </div>

                    <Formik
                        initialValues={{
                            departurePoint: initialWarrant?.departurePoint ? initialWarrant.departurePoint : '',
                            destinationCountry: initialWarrant?.destinationCountry ? initialWarrant.destinationCountry["@id"] : '',
                            destination: initialWarrant?.destination ? initialWarrant.destination : '',
                            expectedTravelDuration: initialWarrant?.expectedTravelDuration ? initialWarrant.expectedTravelDuration : '',
                            travelPurposeDescription: initialWarrant?.travelPurposeDescription ? initialWarrant.travelPurposeDescription : '',
                            departureDate: initialWarrant?.departureDate ? initialWarrant.departureDate : '',
                            vehicleType: initialWarrant?.vehicleType ? initialWarrant.vehicleType["@id"] : '',
                            vehicleDescription: initialWarrant?.vehicleDescription ? initialWarrant.vehicleDescription : '',
                            advancesAmount: initialWarrant?.advancesAmount || 0,
                            employee: `${PATH_URI}${getCurrentUser().iri}`
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({touched, errors}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="departurePoint">Polazište:</label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="departurePoint"/>
                                        {handleFormErrors(errors?.departurePoint, serverSideErrors?.departurePoint, touched.departurePoint)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="destinationCountry">Država
                                            Odredišta:</label>
                                        <Field id="floatingInput" className="form-select" name="destinationCountry"
                                               as="select">
                                            <option value="">Odaberite državu</option>
                                            {destinationCountryCatalog?.map((destinationCountry) => (
                                                <option key={destinationCountry.id} value={destinationCountry["@id"]}>
                                                    {destinationCountry.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.destinationCountry, serverSideErrors?.destinationCountry, touched.destinationCountry)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="destination">Odredište:</label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="destination"/>
                                        {handleFormErrors(errors?.destination, serverSideErrors?.destination, touched.destination)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="name">
                                            Očekivano trajanje putovanja (u danima):
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="number"
                                               name="expectedTravelDuration"/>
                                        {handleFormErrors(errors?.expectedTravelDuration, serverSideErrors?.expectedTravelDuration, touched.expectedTravelDuration)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelPurposeDescription">
                                            Svrha putovanja
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="travelPurposeDescription"/>
                                        {handleFormErrors(errors?.travelPurposeDescription, serverSideErrors?.travelPurposeDescription, touched.travelPurposeDescription)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="departureDate">
                                            Planirani datum polaska:
                                        </label> <br/>
                                        <Field id="floatingInput" name="departureDate">
                                            {({field, form}: FieldProps) => {
                                                const selectedDate = field.value ? new Date(field.value) : null;
                                                return (
                                                    <DatePicker
                                                        selected={selectedDate}
                                                        onChange={(date) => form.setFieldValue(field.name, date)}
                                                        className="form-control"
                                                        id="departureDate"
                                                        placeholderText="Odaberite datum"
                                                        dateFormat="dd.MM.yyyy"
                                                    />)
                                            }}
                                        </Field>
                                        <br/>
                                        {handleFormErrors(errors?.departureDate, serverSideErrors?.departureDate, touched.departureDate)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="vehicleType">
                                            Planirano vozilo putovanja
                                        </label>
                                        <Field id="floatingInput" className="form-select" name="vehicleType"
                                               as="select">
                                            <option value="">Odaberite vrsta vozila</option>
                                            {vehicleTypeCatalog?.map((vehicleType) => (
                                                <option key={vehicleType.id} value={vehicleType["@id"]}>
                                                    {vehicleType.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.vehicleType, serverSideErrors?.vehicleType, touched.vehicleType)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="vehicleDescription">
                                            planirano vozilo putovanja opis:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta vozila "Ostalo"</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="text" name="vehicleDescription"/>
                                        {handleFormErrors(errors?.vehicleDescription, serverSideErrors?.vehicleDescription, touched.vehicleDescription)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="name">Iznos akontacije (EUR):</label>
                                        <Field id="floatingInput"
                                               className="form-control"
                                               type="number"
                                               name="advancesAmount"/>
                                        {handleFormErrors(errors?.advancesAmount, serverSideErrors?.advancesAmount, touched.advancesAmount)}
                                    </div>
                                </div>

                                <Field type="hidden" name="employee"/>

                                <div className="row">
                                    <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary"
                                            type="submit">Spremi
                                    </button>
                                </div>
                                <br/><br/>

                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                Unauthorized()
            )}
        </>
    );
}