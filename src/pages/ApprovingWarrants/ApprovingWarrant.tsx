import {useHandleNonAuthenticated} from "../../components/Security/HandleNonAuthenticated";
import {useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IInitialWarrant, IInitialWarrantModalData} from "../PersonalWarrants/initialWarrantTypes";
import api from "../../components/api";
import {WarrantStatus} from "../../components/Constants";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {isAuthorized} from "../../components/Security/UserAuth";
import Spinner from "../../components/Utils/Spinner";
import BaseDetailsModal from "../../components/BaseDetailsModal";
import DataTable from "react-data-table-component";
import {customStyles, paginationComponentOptions} from "../../components/DataTableCustomStyle";
import Unauthorized from "../Security/Unauthorized";
import {downloadPdf} from "../../components/Utils/downloadPdf";
import {IWarrantCalculationModalData} from "../PersonalWarrants/Calculation/types/calculationWarrantTypes";
import {toggleShowCalculationModal, toggleShowModal} from "../../components/modalHelper";
import {changeWarrantStatus} from "../../components/warrantStatusAction";

export default function ApprovingWarrant() {
    useHandleNonAuthenticated();

    const {statusCode} = useParams<{ statusCode: any }>();
    const location = useLocation();

    const [personalWarrants, setPersonalWarrants] = useState<IInitialWarrant[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IInitialWarrantModalData>();
    const [modalCalculationData, setModalCalculationData] = useState<IWarrantCalculationModalData>();
    const [showCalculationModal, setShowCalculationModal] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const handleToggleShowModal = toggleShowModal(setModalData, setShowModal, setLoading, showModal);
    const handleToggleShowCalculationModal = toggleShowCalculationModal(setModalCalculationData, setShowCalculationModal, setLoading, showCalculationModal);

    const handleChangeWarrantStatus = changeWarrantStatus(setLoading, setRefresh);

    const columns = [
        {
            name: 'AKCIJA',
            id: 'id',
            cell: (props: any) => <Dropdown as={ButtonGroup}>
                <Button onClick={event => handleToggleShowModal(props.id)}
                        variant="primary"
                        size="sm">Detalji</Button>

                <Dropdown.Toggle split variant="primary" size="sm" id="dropdown-split-basic"/>

                <Dropdown.Menu>
                    {props.status.code.toLowerCase() === WarrantStatus.APPROVING.toLowerCase()
                        && (
                            <>
                                <Dropdown.Item onClick={
                                    () => handleChangeWarrantStatus(
                                        props.id,
                                        props.advancesRequired ? WarrantStatus.APPROVING_ADVANCE_PAYMENT : WarrantStatus.CALCULATION_EDIT
                                    )
                                }>
                                    Odobri
                                </Dropdown.Item>
                            </>
                        )}

                    {props.status.code.toLowerCase() === WarrantStatus.APPROVING_CALCULATION.toLowerCase()
                        && (
                            <>
                                <Dropdown.Item
                                    onClick={event => handleToggleShowCalculationModal(props.warrantCalculation.id)}>
                                    Detalji obračuna
                                </Dropdown.Item>
                                <Dropdown.Item onClick={
                                    () => handleChangeWarrantStatus(props.id, WarrantStatus.APPROVING_CALCULATION_PAYMENT)
                                }>
                                    Odobri obračun
                                </Dropdown.Item>
                            </>
                        )}

                    {(props.status.code.toLowerCase() === WarrantStatus.APPROVING.toLowerCase()
                            || props.status.code.toLowerCase() === WarrantStatus.APPROVING_CALCULATION.toLowerCase())
                        && (
                            <>
                                <Dropdown.Item onClick={() => handleChangeWarrantStatus(
                                    props.id,
                                    props.status.code.toLowerCase() === WarrantStatus.APPROVING.toLowerCase() ? WarrantStatus.NEW : WarrantStatus.CALCULATION_EDIT
                                )}>
                                    Odbij
                                </Dropdown.Item>
                            </>
                        )}

                    {(props.status.code.toLowerCase() === WarrantStatus.APPROVING.toLowerCase()
                            || props.status.code.toLowerCase() === WarrantStatus.APPROVING_CALCULATION.toLowerCase())
                        && (
                            <>
                                <Dropdown.Item
                                    onClick={() => handleChangeWarrantStatus(props.id, WarrantStatus.CANCELLED)}>
                                    Storniraj
                                </Dropdown.Item>
                            </>
                        )}
                    <Dropdown.Item onClick={() => downloadPdf(props.id)}>
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
            width: '135px'
        },
        {
            id: 'employee.surname',
            name: 'ZAPOSLENIK',
            selector: (row: any) => `${row.employee.surname} ${row.employee.name} (${row.employee.code})`,
            sortable: true,
            width: '160px'
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
            width: '200px'
        },
        {
            id: 'departureDate',
            name: 'POLAZAK',
            selector: (row: any) => new Date(row.departureDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            sortable: true,
            width: '140px'
        },
        {
            id: 'advancesRequired',
            name: 'AKONTACIJA',
            selector: (row: any) => row.advancesRequired ? 'Da' : 'Ne',
            sortable: true,
            width: '150px'
        },
        {
            id: 'status.name',
            name: 'STATUS',
            selector: (row: any) => row.status.name,
            sortable: true,
        },
    ];

    const fetchData = () => {
        setLoading(true);

        let order = !orderQuery ? '&order[createdAt]=desc' : orderQuery

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
                fetch(
                    api.getUri()
                    + `/warrant-statuses/${response.id}/warrants?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
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

            {isAuthorized(['ROLE_APPROVER', 'ROLE_ADMIN']) ? (
                <div>
                    <BaseDetailsModal title="Putni nalog info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <BaseDetailsModal title="Obračun info" show={showCalculationModal}
                                      modalData={modalCalculationData}
                                      onCloseButtonClick={() => {
                                          setShowCalculationModal(false)
                                      }}/>
                    <DataTable
                        style={{height: "600px"}}
                        title={
                            <>
                                {statusCode.toLowerCase() === WarrantStatus.APPROVING.toLowerCase() &&
                                    <h2 className="flex-display">
                                        Novi nalozi - Odobravanje
                                    </h2>
                                }
                                {statusCode.toLowerCase() === WarrantStatus.APPROVING_CALCULATION.toLowerCase() &&
                                    <h2 className="flex-display">
                                        Obračuni - Odobravanje
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