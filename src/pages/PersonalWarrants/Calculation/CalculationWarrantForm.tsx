import React, {useEffect, useState} from "react";
import {ICalculationWarrant} from "./types/calculationWarrantTypes";
import api from "../../../components/api";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";
import Spinner from "../../../components/Utils/Spinner";
import {isAuthorized} from "../../../components/Security/UserAuth";
import {ToastContainer} from "react-toastify";
import {Field, FieldProps, Form, Formik} from "formik";
import {handleFormErrors} from "../../../components/Utils/handleFormErrors";
import Unauthorized from "../../Security/Unauthorized";
import {PATH_URI} from "../../../components/Constants";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import {IWarrantCalculationExpense, IWarrantTravelItinerary} from "./types/calculationWarrantDependencyTypes";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import { DateTime } from 'luxon';
import {useNavigate} from "react-router-dom";

export default function CalculationWarrantForm(
    handleSubmit: any,
    validateForm: any,
    errors: any,
    serverSideErrors: any,
    warrantId: any,
    id: any
) {
    const [calculationWarrant, setCalculationWarrant] = useState<ICalculationWarrant>();
    const [countryCatalog, setCountryCatalog] = useState<any[]>();
    const [vehicleTypeCatalog, setVehicleTypeCatalog] = useState<any[]>();
    const [wageTypeCatalog, setWageTypeCatalog] = useState<any[]>();
    const [expenseTypeCatalog, setExpenseTypeCatalog] = useState<any[]>();
    const [currencyCatalog, setCurrencyCatalog] = useState<any[]>();
    const [warrantCalculationExpenses, setWarrantCalculationExpenses] = useState<IWarrantCalculationExpense[]>([]);
    const [warrantTravelItineraries, setWarrantTravelItineraries] = useState<IWarrantTravelItinerary[]>([]);
    const navigate = useNavigate();

    const addExpense = (values: any, setFieldValue: any) => {
        const currentExpenses = values.warrantCalculationExpenses;
        const newExpenses = [...currentExpenses, {
            expenseType: '',
            originalAmount: 0,
            originalCurrency: '',
            description: '',
            amount: 0,
            currency: ''
        }];

        // Set local state
        setWarrantCalculationExpenses(newExpenses);

        // Update Formik's state for the field
        setFieldValue('warrantCalculationExpenses', newExpenses);
    };

    const removeExpense = (expenseIndex: number, values: any, setFieldValue: any) => {
        const updatedExpenses = [...values.warrantCalculationExpenses];
        updatedExpenses.splice(expenseIndex, 1);
        setWarrantCalculationExpenses(updatedExpenses);
        setFieldValue('warrantCalculationExpenses', updatedExpenses);
    };

    const addItinerary = (values: any, setFieldValue: any) => {
        const currentItinerary = values.warrantTravelItineraries;
        const newItinerary = [...currentItinerary, {
            country: '',
            enteredDate: '',
            exitedDate: '',
            returningData: false
        }];

        setWarrantTravelItineraries(newItinerary);
        setFieldValue('warrantTravelItineraries', newItinerary);
    };

    const back = () => {
        navigate('/personal_warrant/calculation')
    };

    const removeItinerary = (itineraryIndex: number, values: any, setFieldValue: any) => {
        const updatedItinerary = [...values.warrantTravelItineraries];
        updatedItinerary.splice(itineraryIndex, 1);
        setWarrantTravelItineraries(updatedItinerary);
        setFieldValue('warrantTravelItineraries', updatedItinerary);
    };

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
                    setCountryCatalog(response['hydra:member']);
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

        fetch(api.getUri() + `/catalog/wage-types?order[code]=asc`,
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
                    setWageTypeCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/expense-types?order[code]=asc`,
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
                    setExpenseTypeCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });

        fetch(api.getUri() + `/catalog/currencies?order[code]=asc`,
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
                    setCurrencyCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });
    }, [])


    useEffect(() => {
        if (id) {
            fetch(api.getUri() + `/warrant-calculations/${encodeURIComponent(id)}`, {credentials: 'include'})
                .then((response) => {
                    return response.json()
                })
                .then(response => {
                        const sanitizedExpenses = response.warrantCalculationExpenses.map((expense: any) => {
                            const {'@id': _, '@type': __, ...rest} = expense;
                            return rest;
                        });

                        const sanitizedItineraries = response.warrantTravelItineraries.map((itinerary: any) => {
                            const {'@id': _, '@type': __, ...rest} = itinerary;
                            return rest;
                        });

                        setCalculationWarrant(response);
                        setWarrantCalculationExpenses(sanitizedExpenses);
                        setWarrantTravelItineraries(sanitizedItineraries);
                    }
                )
                .catch((error) => {
                    alertToastMessage(null);
                });
        }
    }, [id]);

    if (!calculationWarrant && id) {
        return <Spinner/>;
    }

    return (
        <>
            {isAuthorized(['ROLE_EMPLOYEE']) ? (
                <div>
                    <ToastContainer/>
                    <div className="row">
                        <h1 className="mx-auto col-10 col-md-8 col-lg-6">Obračun putnog naloga</h1>
                    </div>

                    <Formik
                        initialValues={{
                            travelVehicleType: calculationWarrant?.travelVehicleType ? calculationWarrant.travelVehicleType["@id"] : '',
                            wageType: calculationWarrant?.wageType ? calculationWarrant.wageType["@id"] : '',
                            departureDate: calculationWarrant?.departureDate ? calculationWarrant.departureDate : '',
                            returningDate: calculationWarrant?.returningDate ? calculationWarrant.returningDate : '',
                            domicileCountryLeavingDate: calculationWarrant?.domicileCountryLeavingDate ? calculationWarrant.domicileCountryLeavingDate : '',
                            domicileCountryReturningDate: calculationWarrant?.domicileCountryReturningDate ? calculationWarrant.domicileCountryReturningDate : '',
                            travelVehicleDescription: calculationWarrant?.travelVehicleDescription ? calculationWarrant.travelVehicleDescription : '',
                            travelVehicleRegistration: calculationWarrant?.travelVehicleRegistration ? calculationWarrant.travelVehicleRegistration : '',
                            travelVehicleBrand: calculationWarrant?.travelVehicleBrand ? calculationWarrant.travelVehicleBrand : '',
                            travelReport: calculationWarrant?.travelReport ? calculationWarrant.travelReport : '',
                            odometerStart: calculationWarrant?.odometerStart ? calculationWarrant.odometerStart : 0,
                            odometerEnd: calculationWarrant?.odometerEnd ? calculationWarrant.odometerEnd : 0,
                            warrantCalculationExpenses: calculationWarrant?.warrantCalculationExpenses ? calculationWarrant?.warrantCalculationExpenses : [],
                            warrantTravelItineraries: calculationWarrant?.warrantTravelItineraries ? calculationWarrant?.warrantTravelItineraries : [],
                            warrant: `${PATH_URI}warrants/${warrantId}`
                        }}
                        onSubmit={handleSubmit}
                        validate={validateForm}
                    >
                        {({values, touched, errors, setFieldValue}) => (
                            <Form>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="wageType">Vrsta dnevnice
                                            putovanja:</label>
                                        <Field id="floatingInput" className="form-select" name="wageType"
                                               as="select">
                                            <option value="">Odaberite vrstu dnevnice</option>
                                            {wageTypeCatalog?.map((wageType) => (
                                                <option key={wageType.id} value={wageType["@id"]}>
                                                    {wageType.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.wageType, serverSideErrors?.wageType, touched.wageType)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <h2 className="black-background">Dnevnik putovanja </h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="departureDate">
                                            Datum polaska:
                                        </label> <br/>
                                        <Field id="floatingInput" name="departureDate">
                                            {({field, form}: FieldProps) => {
                                                const selectedDate = field.value ? new Date(field.value) : null;
                                                return (
                                                    <DateTimePicker
                                                        value={selectedDate}
                                                        onChange={(date: any) => {
                                                            const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                            form.setFieldValue(field.name, localDate);
                                                        }}                                                        className="form-control"
                                                        id="departureDate"
                                                    />)
                                            }}
                                        </Field>
                                        <br/>
                                        {handleFormErrors(errors?.departureDate, serverSideErrors?.departureDate, touched.departureDate)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="returningDate">
                                            Datum povratka:
                                        </label> <br/>
                                        <Field id="floatingInput" name="returningDate">
                                            {({field, form}: FieldProps) => {
                                                const selectedDate = field.value ? new Date(field.value) : null;
                                                return (
                                                    <DateTimePicker
                                                        value={selectedDate}
                                                        onChange={(date: any) => {
                                                            const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                            form.setFieldValue(field.name, localDate);
                                                        }}                                                        className="form-control"
                                                        id="returningDate"
                                                    />)
                                            }}
                                        </Field>
                                        <br/>
                                        {handleFormErrors(errors?.returningDate, serverSideErrors?.returningDate, touched.returningDate)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="domicileCountryLeavingDate">
                                            Datum napuštanja Hrvatske:
                                        </label> <br/>
                                        <Field id="floatingInput" name="domicileCountryLeavingDate">
                                            {({field, form}: FieldProps) => {
                                                const selectedDate = field.value ? new Date(field.value) : null;
                                                return (
                                                    <DateTimePicker
                                                        value={selectedDate}
                                                        onChange={(date: any) => {
                                                            const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                            form.setFieldValue(field.name, localDate);
                                                        }}                                                        className="form-control"
                                                        id="domicileCountryLeavingDate"
                                                    />)
                                            }}
                                        </Field>
                                        <br/>
                                        {handleFormErrors(errors?.domicileCountryLeavingDate, serverSideErrors?.domicileCountryLeavingDate, touched.domicileCountryLeavingDate)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="domicileCountryReturningDate">
                                            Datum povratka u Hrvatsku:
                                        </label> <br/>
                                        <Field id="floatingInput" name="domicileCountryReturningDate">
                                            {({field, form}: FieldProps) => {
                                                const selectedDate = field.value ? new Date(field.value) : null;
                                                return (
                                                    <DateTimePicker
                                                        value={selectedDate}
                                                        onChange={(date: any) => {
                                                            const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                            form.setFieldValue(field.name, localDate);
                                                        }}                                                        className="form-control"
                                                        id="domicileCountryReturningDate"
                                                    />)
                                            }}
                                        </Field>
                                        <br/>
                                        {handleFormErrors(errors?.domicileCountryReturningDate, serverSideErrors?.domicileCountryReturningDate, touched.domicileCountryReturningDate)}
                                    </div>
                                </div>

                                {warrantTravelItineraries.map((itinerary, index) => (
                                    <div key={index}>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <hr/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <b>Država putovanja do odredišta </b>
                                                <button className="btn btn-danger btn-sm" type="button"
                                                        onClick={() => removeItinerary(index, values, setFieldValue)}>Ukloni državu
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label
                                                    className="form-label form-label"
                                                    htmlFor={`warrantTravelItineraries[${index}].country`}>
                                                    Država:
                                                </label>
                                                <Field as="select"
                                                       className="form-select"
                                                       id="floatingInput"
                                                       name={`warrantTravelItineraries[${index}].country`}>
                                                    <option value="">Odaberite državu</option>
                                                    {countryCatalog?.map((country) => (
                                                        <option key={country.id} value={country["@id"]}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label className="form-label form-label"
                                                       htmlFor={`warrantTravelItineraries[${index}].enteredDate`}>
                                                    Datum ulaska u državu:
                                                </label> <br/>
                                                <Field id="floatingInput" name={`warrantTravelItineraries[${index}].enteredDate`}>
                                                    {({field, form}: FieldProps) => {
                                                        const selectedDate = field.value ? new Date(field.value) : null;
                                                        return (
                                                            <DateTimePicker
                                                                value={selectedDate}
                                                                onChange={(date: any) => {
                                                                    const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                                    form.setFieldValue(field.name, localDate);
                                                                }}                                                                className="form-control"
                                                                id={`warrantTravelItineraries[${index}].enteredDate`}
                                                            />)
                                                    }}
                                                </Field>
                                                <br/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label className="form-label form-label"
                                                       htmlFor={`warrantTravelItineraries[${index}].exitedDate`}>
                                                    Datum izlaska iz države:
                                                </label> <br/>
                                                <Field id="floatingInput" name={`warrantTravelItineraries[${index}].exitedDate`}>
                                                    {({field, form}: FieldProps) => {
                                                        const selectedDate = field.value ? new Date(field.value) : null;
                                                        return (
                                                            <DateTimePicker
                                                                value={selectedDate}
                                                                onChange={(date: any) => {
                                                                    const localDate = DateTime.fromJSDate(date).setZone('Europe/Zagreb').toJSDate();
                                                                    form.setFieldValue(field.name, localDate);
                                                                }}                                                                className="form-control"
                                                                id={`warrantTravelItineraries[${index}].exitedDate`}
                                                            />)
                                                    }}
                                                </Field>
                                                <br/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3 form-check">
                                                <label className="form-check-label"
                                                       htmlFor={`warrantTravelItineraries[${index}].returningData`}>
                                                    Zemlja povratka prema Hrvatskoj
                                                </label>
                                                <Field id="floatingInput" name={`warrantTravelItineraries[${index}].returningData`} type="checkbox"
                                                       className="form-check-input"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="row add-elements-button">
                                    <button className="mx-auto col-10 col-md-8 col-lg-6 mb-3"
                                            type="button" onClick={() => addItinerary(values, setFieldValue)}>
                                        Dodaj zemlju putovanja
                                    </button>
                                </div>


                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <h2 className="black-background">Vozilo putovanja </h2>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelVehicleType">Vrsta
                                            vozilo putovanja:</label>
                                        <Field id="floatingInput" className="form-select" name="travelVehicleType"
                                               as="select">
                                            <option value="">Odaberite vrstu vozila</option>
                                            {vehicleTypeCatalog?.map((travelVehicleType) => (
                                                <option key={travelVehicleType.id} value={travelVehicleType["@id"]}>
                                                    {travelVehicleType.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {handleFormErrors(errors?.travelVehicleType, serverSideErrors?.travelVehicleType, touched.travelVehicleType)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelVehicleDescription">Opis
                                            vozila:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta
                                                    vozila "Ostalo"</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="travelVehicleDescription"/>
                                        {handleFormErrors(errors?.travelVehicleDescription, serverSideErrors?.travelVehicleDescription, touched.travelVehicleDescription)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelVehicleBrand">Marka
                                            vozila:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta
                                                    vozila osobno ili službeno vozilo</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="travelVehicleBrand"/>
                                        {handleFormErrors(errors?.travelVehicleBrand, serverSideErrors?.travelVehicleBrand, touched.travelVehicleBrand)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelVehicleRegistration">Registracija
                                            vozila:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta
                                                    vozila osobno ili službeno vozilo</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="travelVehicleRegistration"/>
                                        {handleFormErrors(errors?.travelVehicleRegistration, serverSideErrors?.travelVehicleRegistration, touched.travelVehicleRegistration)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="name">
                                            Vrijednost odometra na početku putovanja:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta
                                                    vozila osobno ili službeno vozilo</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="number"
                                               name="odometerStart"/>
                                        {handleFormErrors(errors?.odometerStart, serverSideErrors?.odometerStart, touched.odometerStart)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="name">
                                            Vrijednost odometra na kraju putovanja:
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={<Tooltip id='tooltip-right'>Ispuniti samo ako je odabrana vrsta
                                                    vozila osobno ili službeno vozilo</Tooltip>}
                                            >
                                                <i style={{marginLeft: '5px'}} className="fas fa-info-circle"></i>
                                            </OverlayTrigger>
                                        </label>
                                        <Field id="floatingInput" className="form-control" type="number"
                                               name="odometerEnd"/>
                                        {handleFormErrors(errors?.odometerEnd, serverSideErrors?.odometerEnd, touched.odometerEnd)}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <label className="form-label form-label" htmlFor="travelReport">Izvještaj
                                            putovanja:</label>
                                        <Field id="floatingInput" className="form-control" type="text"
                                               name="travelReport"/>
                                        {handleFormErrors(errors?.travelReport, serverSideErrors?.travelReport, touched.travelReport)}
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                        <h2 className="black-background">Troškovi </h2>
                                    </div>
                                </div>

                                {warrantCalculationExpenses.map((warrantCalculationExpenses, index) => (
                                    <div key={index}>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <b>TROŠAK </b>
                                                <button className="btn btn-danger btn-sm" type="button"
                                                        onClick={() => removeExpense(index, values, setFieldValue)}>Ukloni
                                                    trošak
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label
                                                    className="form-label form-label"
                                                    htmlFor={`warrantCalculationExpenses[${index}].expenseType`}>
                                                    Vrsta troška:
                                                </label>
                                                <Field as="select"
                                                       className="form-select"
                                                       id="floatingInput"
                                                       name={`warrantCalculationExpenses[${index}].expenseType`}>
                                                    <option value="">Odaberite vrstu troška</option>
                                                    {expenseTypeCatalog?.map((expenseType) => (
                                                        <option key={expenseType.id} value={expenseType["@id"]}>
                                                            {expenseType.name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label className="form-label form-label"
                                                       htmlFor={`warrantCalculationExpenses[${index}].originalAmount`}>
                                                    Iznos:
                                                </label>
                                                <Field id="floatingInput" className="form-control" type="number"
                                                       name={`warrantCalculationExpenses[${index}].originalAmount`}/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label
                                                    className="form-label form-label"
                                                    htmlFor={`warrantCalculationExpenses[${index}].originalCurrency`}>
                                                    Valuta:
                                                </label>
                                                <Field as="select"
                                                       className="form-select"
                                                       id="floatingInput"
                                                       name={`warrantCalculationExpenses[${index}].originalCurrency`}>
                                                    <option value="">Odaberite valutu</option>
                                                    {currencyCatalog?.map((currency) => (
                                                        <option key={currency.id} value={currency["@id"]}>
                                                            {currency.code}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mx-auto col-10 col-md-8 col-lg-6 mb-3">
                                                <label className="form-label form-label"
                                                       htmlFor={`warrantCalculationExpenses[${index}].description`}>
                                                    Opis troška:
                                                </label>
                                                <Field id="floatingInput" className="form-control" type="text"
                                                       name={`warrantCalculationExpenses[${index}].description`}/>
                                            </div>
                                        </div>
                                    </div>

                                ))}

                                <div className="row add-elements-button">
                                    <button className="mx-auto col-10 col-md-8 col-lg-6 mb-3"
                                            type="button" onClick={() => addExpense(values, setFieldValue)}>Dodaj novi
                                        trošak
                                    </button>
                                </div>


                                <br/>
                                <Field type="hidden" name="warrant"/>
                                <Field type="hidden" name="travelTypeCode"/>

                                <div className="row">
                                    <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary"
                                            type="submit">Spremi
                                    </button>
                                </div><br/>
                                <div className="row">
                                    <button className="mx-auto col-10 col-md-8 col-lg-2 btn btn-primary"
                                            onClick={() => back()}>Odustani
                                    </button>
                                </div>

                                <br/><br/><br/><br/><br/><br/>

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