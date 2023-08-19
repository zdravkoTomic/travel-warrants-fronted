import {useHandleNonAuthenticated} from "../../components/Security/HandleNonAuthenticated";
import {useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IInitialWarrant, IInitialWarrantModalData} from "../PersonalWarrants/initialWarrantTypes";
import {IWarrantCalculationModalData} from "../PersonalWarrants/Calculation/types/calculationWarrantTypes";
import {toggleShowCalculationModal, toggleShowModal} from "../../components/modalHelper";
import {changeWarrantStatus} from "../../components/warrantStatusAction";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {WarrantStatus} from "../../components/Constants";
import {downloadPdf} from "../../components/Utils/downloadPdf";
import api from "../../components/api";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";
import Spinner from "../../components/Utils/Spinner";
import {isAuthorized} from "../../components/Security/UserAuth";
import BaseDetailsModal from "../../components/BaseDetailsModal";
import DataTable from "react-data-table-component";
import {customStyles, paginationComponentOptions} from "../../components/DataTableCustomStyle";
import Unauthorized from "../Security/Unauthorized";
import {formatDate} from "../../components/formatDateHelper";

export default function CreditingWarrantPaid() {
    useHandleNonAuthenticated();

    const {statusCode} = useParams<{ statusCode: any }>();
    const location = useLocation();

    const [warrants, setWarrants] = useState<IInitialWarrant[]>([]);
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
    const [paymentCatalog, setPaymentCatalog] = useState<any[]>([]);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const handleToggleShowModal = toggleShowModal(setModalData, setShowModal, setLoading, showModal);
    const handleToggleShowCalculationModal = toggleShowCalculationModal(setModalCalculationData, setShowCalculationModal, setLoading, showCalculationModal);

    const handleChangeWarrantStatus = changeWarrantStatus(setLoading, setRefresh);

    const flattenPayments = (payments: any) => {
        const flattened: any[] = [];
        payments.forEach((payment: any) => {
            payment.warrantPayments.forEach((warrantPayment: any) => {
                flattened.push({
                    ...payment,
                    warrant: warrantPayment.warrant,
                    paymentType: warrantPayment.paymentType,
                });
            });
        });
        return flattened;
    };

    const columns = [
        {
            name: 'AKCIJA',
            id: 'id',
            cell: (props: any) => <Dropdown as={ButtonGroup}>
                <Button onClick={event => handleToggleShowModal(props.warrant.id)}
                        variant="primary"
                        size="sm">Detalji</Button>

                <Dropdown.Toggle split variant="primary" size="sm" id="dropdown-split-basic"/>

                <Dropdown.Menu>
                    {typeof props.warrant.warrantCalculation !== "undefined"
                        && (
                            <>
                                <Dropdown.Item
                                    onClick={event => handleToggleShowCalculationModal(props.warrant.warrantCalculation.id)}>
                                    Detalji obračuna
                                </Dropdown.Item>
                            </>
                        )}
                    <>

                        <Dropdown.Item onClick={() => handleChangeWarrantStatus(
                            props.warrant.id,
                            props.warrant.status.code.toLowerCase() === WarrantStatus.CALCULATION_IN_PAYMENT.toLowerCase()
                                ? WarrantStatus.APPROVING_CALCULATION_PAYMENT
                                : WarrantStatus.APPROVING_ADVANCE_PAYMENT
                        )}>
                            Odbij
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleChangeWarrantStatus(props.warrant.id, WarrantStatus.CANCELLED)}>
                            Storniraj
                        </Dropdown.Item>
                    </>

                    <Dropdown.Item onClick={() => downloadPdf(props.warrant.id)}>
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
            id: 'warrant.code',
            name: 'KOD',
            selector: (row: any) => row.warrant.code,
            sortable: true,
            width: '80px'
        },
        {
            id: 'travelType.name',
            name: 'TIP NALOGA',
            selector: (row: any) => row.warrant.travelType.name,
            sortable: true,
            width: '150px',
        },
        {
            id: 'employee.surname',
            name: 'ZAPOSLENIK',
            selector: (row: any) => `${row.warrant.employee.surname} ${row.warrant.employee.name} (${row.warrant.employee.code})`,
            sortable: true,
            width: '200px'
        },
        {
            id: 'employee.department.name',
            name: 'ORG. DIO',
            selector: (row: any) => row.warrant.employee.department.name,
            sortable: true,
            width: '150px'
        },
        {
            id: 'destination',
            name: 'ODREDIŠTE',
            selector: (row: any) => `${row.warrant.destination}, ${row.warrant.destinationCountry.name}`,
            sortable: true,
            width: '170px'
        },
        {
            id: 'status.name',
            name: 'TIP PLAĆANJA',
            selector: (row: any) => row.paymentType.name,
            sortable: true,
            width: '200px'
        },
        {
            id: 'payment.closedBy',
            name: 'ZATVORIO PLAĆANJE',
            selector: (row: any) => `${row.closedBy.surname} ${row.closedBy.name}`,
            sortable: true,
        },
    ];

    const fetchData = (paymentId: any) => {
        setLoading(true);

        let paymentQuery = paymentId ? `&id=${paymentId}` : '';

        let order = !orderQuery ? '&order[createdAt]=desc' : orderQuery

        fetch(
            api.getUri() + `/warrant-payment-statuses/code/${statusCode}`,
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
                    + `/warrant-payment-statuses/${response.id}/payments?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}${paymentQuery}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                    }
                )
                    .then(response => response.json())
                    .then(response => {
                        const flattenedData = flattenPayments(response['hydra:member']);
                        setWarrants(flattenedData);
                        setTotalRows(response['hydra:totalItems']);
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

    const handlePaymentChange = (paymentId: any) => {
        setSelectedPayment(paymentId);

        fetchData(paymentId);
    };

    const getDropdownPaymentLabel = () => {
        if (selectedPayment === "") return "Svi periodi";
        const selected = paymentCatalog.find(p => p.id === Number(selectedPayment));
        return selected
            ? `${formatDate(selected.createdAt)} - ${formatDate(selected.closedAt)} (${selected.closedBy.surname} ${selected.closedBy.name})`
            : "Odaberite period";
    };

    useEffect(() => {
        fetch(api.getUri() + `/catalog/payments?order[code]=asc`,
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
                    setPaymentCatalog(response['hydra:member']);
                }
            )
            .catch((error) => {
                alertToastMessage(null);
            });
        fetchData(null);
    }, [datatablePage, perPage, orderQuery, location.pathname, refresh]);

    return (
        <div>
            {loading && <Spinner/>}

            {isAuthorized(['ROLE_PROCURATOR', 'ROLE_ADMIN']) ? (
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
                    <br/>
                    <Dropdown onSelect={handlePaymentChange}>
                        <Dropdown.Toggle className="dropdown-toggle-payment" variant="primary" id="dropdown-basic">
                            {getDropdownPaymentLabel()}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item key="all" eventKey="">
                                Svi periodi
                            </Dropdown.Item>
                            {paymentCatalog.map((payment: any) => (
                                <Dropdown.Item key={payment.id} eventKey={payment.id}>
                                    {formatDate(payment.createdAt)} - {formatDate(payment.closedAt)}
                                    ({payment.closedBy.surname} {payment.closedBy.name})
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <DataTable
                        style={{height: "600px"}}
                        title={
                            <h2 className="flex-display">
                                Plaćeni nalozi
                            </h2>
                        }
                        columns={columns}
                        data={warrants}
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