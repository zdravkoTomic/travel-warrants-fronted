import api from "./api";
import {VehicleType} from "./Constants";
import {alertToastMessage} from "./Utils/alertToastMessage";

export const toggleShowModal = (
    setModalData: any,
    setShowModal: any,
    setLoading: any,
    currentShowModal: any
) => (personalWarrantId: number) => {
    setLoading(true)
    fetch(
        api.getUri() + `/warrants/${encodeURIComponent(personalWarrantId)}`,
        {credentials: 'include'}
    )
        .then(response => response.json())
        .then(response => {
                setModalData({
                    code: {
                        title: 'Kod naloga',
                        value: response.code
                    },
                    status: {
                        title: 'Status nalog',
                        value: response.status.name
                    },
                    employee: {
                        title: 'Zaposlenik',
                        value: `${response.employee.surname} ${response.employee.surname}`
                    },
                    employeeWorkPosition: {
                        title: 'Radno mjesto zaposlenika',
                        value: response.employee.workPosition.name
                    },
                    warrantDepartment: {
                        title: 'Organizacijski dio naloga',
                        value: response.department.name
                    },
                    travelType: {
                        title: 'Vrsta putovanja',
                        value: response.travelType.name
                    },
                    wage: {
                        title: 'Iznos pojedinačne dnevnice',
                        value: `${response.wageAmount} ${response.wageCurrency.code}`
                    },
                    vehicleType: {
                        title: 'Najavljena vrsta vozila',
                        value: response.vehicleType.code === VehicleType.OTHER ? `${response.vehicleType.name} (${response.vehicleDescription})` : response.vehicleType.name
                    },
                    departurePoint: {
                        title: 'Mjesto polaska',
                        value: response.departurePoint
                    },
                    destination: {
                        title: 'Odredište',
                        value: response.destination
                    },
                    destinationCountry: {
                        title: 'Zemlja odredišta',
                        value: response.destinationCountry.name
                    },
                    departureDate: {
                        title: 'Očekivani datum polaska',
                        value: new Date(response.departureDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                    },
                    expectedTravelDuration: {
                        title: 'Očekivano trajanje putovanja',
                        value: response.expectedTravelDuration
                    },
                    travelPurpose: {
                        title: 'Svrha putovanja',
                        value: response.travelPurposeDescription
                    },
                    advancesRequired: {
                        title: 'Potraživanje akontacije',
                        value: response.advancesRequired ? 'Da' : 'Ne'
                    },
                    advancesAmount: {
                        title: 'Iznos tražene akontacije',
                        value: `${response.advancesAmount.toFixed(2)} ${response.advancesCurrency.code}`
                    },
                    createdAt: {
                        title: 'Kreirano',
                        value: new Date(response.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                    },
                })
            }
        )
        .then(() => {
            setLoading(false);
            setShowModal(!currentShowModal);
        })
        .catch((error) => {
            alertToastMessage(null);
        });
};

export const toggleShowCalculationModal = (
    setModalCalculationData: any,
    setShowCalculationModal: any,
    setLoading: any,
    currentShowCalculationModal: any
) => (warrantCalculationId: number) => {
    setLoading(true)
    fetch(
        api.getUri() + `/preview-warrant-calculations/${encodeURIComponent(warrantCalculationId)}`,
        {credentials: 'include'}
    )
        .then(response => response.json())
        .then(response => {
                const itineraryData: any = {};
                const calculationExpenseData: any = {};
                const wageData: any = {};

                response.warrantTravelItineraries.forEach((itinerary: any, index: number) => {
                    itineraryData[`itineraryCountry${index}`] = {
                        title: itinerary.returningData ? 'Zemlja putovanja od odredišta' : 'Zemlja putovanja do odredišta',
                        value: `${itinerary.country.name} 
                                (
                                ${new Date(itinerary.enteredDate).toLocaleString('hr-HR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })} 
                                -
                                ${new Date(itinerary.exitedDate).toLocaleString('hr-HR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                            )
                        `
                    };
                });

                response.warrantCalculationExpenses.forEach((calculationExpense: any, index: number) => {
                    calculationExpenseData[`calculationExpense${index}`] = {
                        title: 'Trošak',
                        value: `${calculationExpense.expenseType.name}
                        (${calculationExpense.description}) 
                        ${calculationExpense.amount} ${calculationExpense.currency.code}
                         (${calculationExpense.originalAmount} ${calculationExpense.originalCurrency.code})
                    `
                    };
                });

                response.warrantCalculationWages.forEach((wage: any, index: number) => {
                    wageData[`wage${index}`] = {
                        title: 'Dnevnica',
                        value: `${wage.country.name} ${wage.amount} ${wage.currency.code} 
                            (Ukupan broj dnevnica: ${wage.numberOfWages})`
                    };
                });

                setModalCalculationData({
                    warrantCode: {
                        title: 'Nalog',
                        value: response.warrant.code
                    },
                    travelType: {
                        title: 'Vrsta putovanja',
                        value: response.warrant.travelType.name
                    },
                    wageType: {
                        title: 'Vrsta dnevnice',
                        value: response.wageType.name
                    },
                    departureDate: {
                        title: 'Polazak',
                        value: new Date(response.departureDate).toLocaleString('hr-HR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }),
                    },
                    returningDate: {
                        title: 'Povratak',
                        value: new Date(response.returningDate).toLocaleString('hr-HR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }),
                    },
                    domicileCountryLeavingDate: {
                        title: 'Vrijeme napuštanje Hrvatske',
                        value: response.domicileCountryLeavingDate
                            ? new Date(response.domicileCountryLeavingDate).toLocaleString('hr-HR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }) : '',
                    },
                    domicileCountryReturningDate: {
                        title: 'Vrijeme povratka u Hrvatsku',
                        value: response.domicileCountryReturningDate
                            ? new Date(response.domicileCountryReturningDate).toLocaleString('hr-HR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            }) : '',
                    },
                    ...itineraryData, ...wageData,
                    travelVehicle: {
                        title: 'Vrsta prijevoznog sredstva',
                        value: response.travelVehicleType.name
                    },
                    travelVehicleDescription: {
                        title: 'Opis prijevoznog sredstva',
                        value: response.travelVehicleDescription
                    },
                    travelVehicleRegistration: {
                        title: 'Registracija',
                        value: response.travelVehicleRegistration
                    },
                    travelVehicleBrand: {
                        title: 'Marka vozila',
                        value: response.travelVehicleBrand
                    },
                    odometer: {
                        title: 'Odometar',
                        value: `${response.odometerStart}km - ${response.odometerEnd}km`
                    },
                    ...calculationExpenseData,
                    travelReport: {
                        title: 'Izvještaj putovanja',
                        value: response.travelReport
                    }
                })
            }
        )
        .then(() => {
            setLoading(false)
            setShowCalculationModal(!currentShowCalculationModal);
        })
        .catch((error) => {
            alertToastMessage(null);
        });
};