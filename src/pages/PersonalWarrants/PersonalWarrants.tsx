import {useHandleNonAuthenticated} from "../../components/Security/HandleNonAuthenticated";
import React, {useEffect, useState} from "react";
import {IInitialWarrant, IInitialWarrantModalData} from "./initialWarrantTypes";
import api from "../../components/api";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {Link, useLocation, useParams} from "react-router-dom";
import {getCurrentUser, isAuthorized} from "../../components/Security/UserAuth";
import BaseDetailsModal from "../../components/BaseDetailsModal";
import DataTable from "react-data-table-component";
import Spinner from "../../components/Utils/Spinner";
import {customStyles, paginationComponentOptions} from "../../components/DataTableCustomStyle";
import Unauthorized from "../Security/Unauthorized";
import {VehicleType, WarrantGroupStatus, WarrantStatus} from "../../components/Constants";
import {successToastMessage} from "../../components/Utils/successToastMessage";

export default function CatalogPersonalWarrant() {
    useHandleNonAuthenticated();

    const {groupStatusCode} = useParams<{ groupStatusCode: any }>();
    const location = useLocation();

    const [personalWarrants, setPersonalWarrants] = useState<IInitialWarrant[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IInitialWarrantModalData>();
    const [refresh, setRefresh] = useState(0);

    const toggleShowModal = (personalWarrantId: number) => {
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
                            title: 'Iznos traženne akontacije',
                            value: response.advancesAmount.toFixed(2)
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
                setLoading(false)
                setShowModal(!showModal);
            })
            .catch((error) => {
                alertToastMessage(null);
            });
    };

    const changeWarrantStatus = (warrantId: number, statusCode: string) => {
        setLoading(true)
        fetch(
            api.getUri() + `/warrant-statuses/code/${statusCode}`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                const values = {
                    "status": `/travel-warrants/public/api/warrant-statuses/${response.id}`
                }
                fetch(api.getUri() + `/warrants/${warrantId}/change_status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                    credentials: 'include',
                })
                    .then((response) => {
                        if (response.ok) {
                            successToastMessage('Status naloga uspješno promijenjen')
                        } else {
                            throw new Error('Server side error');
                        }
                    })
                    .catch((error) => {
                        alertToastMessage(null);
                    });
            })
            .catch((error) => {
                alertToastMessage(null);
            })
            .finally(() => {
                    setLoading(false)
                    setRefresh(prevState => prevState + 1)
                }
            )
    };

    const deleteWarrant = (warrantId: number) => {
        setLoading(true)
        fetch(api.getUri() + `/warrants/${warrantId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/ld+json',
            },
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    successToastMessage('Zapis uspješno obrisan')
                }
            })
            .catch((error) => {
                alertToastMessage(null);
            })
            .finally(() => {
                    setLoading(false)
                    setRefresh(prevState => prevState + 1)
                }
            )
    };

    const columns = [
        {
            name: 'AKCIJA',
            id: 'id',
            cell: (props: any) => <Dropdown as={ButtonGroup}>
                <Button onClick={event => toggleShowModal(props.id)}
                        variant="primary"
                        size="sm">Detalji</Button>

                <Dropdown.Toggle split variant="primary" size="sm" id="dropdown-split-basic"/>

                <Dropdown.Menu>
                    {props.status.code === WarrantStatus.NEW && (
                        <>
                            <Dropdown.Item as={Link} to={`/initial_warrant_edit/${props.id}`}>
                                Ažuriraj
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => changeWarrantStatus(props.id, WarrantStatus.APPROVING)}>
                                Pošalji na odobravanje
                            </Dropdown.Item>
                        </>
                    )}
                    {((props.warrantStatusFlows.length > 1
                        && props.status.code.toLowerCase() === WarrantStatus.NEW.toLowerCase())
                        || (props.status.code.toLowerCase() === WarrantStatus.CALCULATION_EDIT.toLowerCase()))
                        && (
                            <>
                                <Dropdown.Item onClick={() => changeWarrantStatus(props.id, WarrantStatus.CANCELLED)}>
                                    Storniraj
                                </Dropdown.Item>
                            </>
                        )}
                    {props.warrantStatusFlows.length === 1
                        && props.status.code.toLowerCase() === WarrantStatus.NEW.toLowerCase()
                        && (
                            <>
                                <Dropdown.Item onClick={() => deleteWarrant(props.id)}>
                                    Obriši
                                </Dropdown.Item>
                            </>
                        )}

                    <Dropdown.Item as={Link} to={`/initial_warrant_edit/${props.id}`}>
                        Preuzmi PDF
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>,
            ignoreRowClick: true,
            allowOverflow: true,
            minWidth: '100px',
            center: true,
            button: true,
            width: '120px',
            selector: (row: any) => row.id
        },
        {
            id: 'code',
            name: 'KOD',
            selector: (row: any) => row.code,
            sortable: true,
            width: '90px'
        },
        {
            id: 'travelType.name',
            name: 'TIP NALOGA',
            selector: (row: any) => row.travelType.name,
            sortable: true,
            width: '140px'
        },
        {
            id: 'departurePoint',
            name: 'MJESTO POLASKA',
            selector: (row: any) => row.departurePoint,
            sortable: true,
            width: '180px'
        },
        {
            id: 'destination',
            name: 'ODREDIŠTE',
            selector: (row: any) => row.destination,
            sortable: true,
            width: '130px'
        },
        {
            id: 'destinationCountry.name',
            name: 'DRŽAVA ODREDIŠTA',
            selector: (row: any) => row.destinationCountry.name,
            sortable: true,
        },
        {
            id: 'departureDate',
            name: 'DATUM POLASKA',
            selector: (row: any) => new Date(row.departureDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            sortable: true,
        },
        {
            id: 'status.name',
            name: 'STATUS',
            selector: (row: any) => row.status.name,
            sortable: true,
            width: '150px'
        },

    ];

    const currentUser = getCurrentUser();

    const fetchData = () => {
        setLoading(true);

        let order = !orderQuery ? '&order[createdAt]=desc' : orderQuery

        fetch(
            api.getUri() + `/warrant-group-status/${groupStatusCode}`,
            {
                headers: {
                    'Content-Type': 'application/ld+json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                fetch(
                    api.getUri()
                    + `/employees/${currentUser.id}/warrant-group-statuses/${response.id}/warrants?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                    }
                )
                    .then(response => response.json())
                    .then(response => {
                        setPersonalWarrants(response['hydra:member'])
                        setTotalRows(response['hydra:totalItems'])
                    })
                    .catch((error) => {
                        alertToastMessage(null);
                    }).finally(() => {
                    setLoading(false);
                });
            })
            .catch((error) => {
                alertToastMessage(null);
            })

    };

    const handlePageChange = (page: any) => {
        if (datatablePage !== page) {
            setDatatablePage(page)
        }
    };

    const handlePerRowsChange = (newPerPage: any) => {
        setPerPage(newPerPage);
    };

    const handleSort = (column: any, sortDirection: any) => {
        if (column.id) {
            const newOrderQuery = `&order[${column.id}]=${encodeURIComponent(sortDirection)}`;
            setOrderQuery(newOrderQuery);
        }
    };

    useEffect(() => {
        fetchData();
    }, [datatablePage, perPage, orderQuery, location.pathname, refresh]);

    return (
        <div>
            {loading && <Spinner/>}

            {isAuthorized(['ROLE_EMPLOYEE']) ? (
                <div>
                    <BaseDetailsModal title="Putni nalog info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <DataTable
                        style={{height: "600px"}}
                        title={
                            <>
                                {groupStatusCode.toLowerCase() === WarrantGroupStatus.INITIAL.toLowerCase() &&
                                    <h2 className="flex-display">Novi nalozi
                                        <Link className="add-new-record-btn" to="/initial_warrant_add">
                                            <Button variant="primary">
                                                Novi nalog
                                            </Button>
                                        </Link>
                                    </h2>
                                }
                                {groupStatusCode.toLowerCase() === WarrantGroupStatus.CALCULATION.toLowerCase() &&
                                    <h2 className="flex-display">Obračun
                                        <Link className="add-new-record-btn" to="/calculation_add">
                                            <Button variant="primary">
                                                Ispuni obračun
                                            </Button>
                                        </Link>
                                    </h2>
                                }
                                {groupStatusCode.toLowerCase() === WarrantGroupStatus.CLOSED.toLowerCase() &&
                                    <h2 className="flex-display">
                                        Zatvoreni nalozi
                                    </h2>
                                }
                            </>
                        }
                        columns={columns}
                        data={personalWarrants}
                        highlightOnHover
                        fixedHeader
                        fixedHeaderScrollHeight="550px"
                        customStyles={customStyles}
                        pagination
                        paginationServer
                        paginationComponentOptions={paginationComponentOptions}
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[5, 10, 25, 50, 100, 250]}
                        paginationPerPage={perPage}
                        sortServer
                        onSort={handleSort}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                    />
                </div>
            ) : (
                Unauthorized()
            )
            }
        </div>
    );
}