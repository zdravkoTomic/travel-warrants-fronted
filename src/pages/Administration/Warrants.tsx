import {useHandleNonAuthenticated} from "../../components/Security/HandleNonAuthenticated";
import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IInitialWarrant, IInitialWarrantModalData} from "../PersonalWarrants/initialWarrantTypes";
import {IWarrantCalculationModalData} from "../PersonalWarrants/Calculation/types/calculationWarrantTypes";
import {toggleShowCalculationModal, toggleShowModal} from "../../components/modalHelper";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {downloadPdf} from "../../components/Utils/downloadPdf";
import api from "../../components/api";
import {alertToastMessage} from "../../components/Utils/alertToastMessage";
import Spinner from "../../components/Utils/Spinner";
import {isAuthorized} from "../../components/Security/UserAuth";
import BaseDetailsModal from "../../components/BaseDetailsModal";
import DataTable from "react-data-table-component";
import {customStyles, paginationComponentOptions} from "../../components/DataTableCustomStyle";
import Unauthorized from "../Security/Unauthorized";

export default function Warrants() {
    useHandleNonAuthenticated();

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

    const [searchCode, setSearchCode] = useState('');
    const [searchTravelTypeName, setSearchTravelTypeName] = useState('');
    const [searchEmployeeSurname, setSearchEmployeeSurname] = useState('');
    const [searchDepartmentName, setSearchDepartmentName] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchStatusName, setSearchStatusName] = useState('');

    const handleToggleShowModal = toggleShowModal(setModalData, setShowModal, setLoading, showModal);
    const handleToggleShowCalculationModal = toggleShowCalculationModal(setModalCalculationData, setShowCalculationModal, setLoading, showCalculationModal);

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
                    {typeof props.warrantCalculation !== "undefined"
                        && (
                            <>
                                <Dropdown.Item
                                    onClick={event => handleToggleShowCalculationModal(props.warrantCalculation.id)}>
                                    Detalji obračuna
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
            width: '80px'
        },
        {
            id: 'travelType.name',
            name: 'TIP NALOGA',
            selector: (row: any) => row.travelType.name,
            sortable: true,
            width: '150px',
        },
        {
            id: 'employee.surname',
            name: 'ZAPOSLENIK',
            selector: (row: any) => `${row.employee.surname} ${row.employee.name} (${row.employee.code})`,
            sortable: true,
            width: '200px'
        },
        {
            id: 'department.name',
            name: 'ORG. DIO',
            selector: (row: any) => row.department.name,
            sortable: true,
            width: '150px'
        },
        {
            id: 'destination',
            name: 'ODREDIŠTE',
            selector: (row: any) => `${row.destination}, ${row.destinationCountry.name}`,
            sortable: true,
            width: '150px'
        },
        {
            id: 'advancesRequired',
            name: 'AKONTACIJA',
            selector: (row: any) => row.advancesRequired ? 'Da' : 'Ne',
            sortable: true,
            width: '150px',
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

        const searchQueries = [
            searchCode ? `&code=${searchCode}` : '',
            searchTravelTypeName ? `&travelType.name=${searchTravelTypeName}` : '',
            searchEmployeeSurname ? `&employee.surname=${searchEmployeeSurname}` : '',
            searchDepartmentName ? `&employee.department.name=${searchDepartmentName}` : '',
            searchDestination ? `&destination=${searchDestination}` : '',
            searchStatusName ? `&status.name=${searchStatusName}` : '',
        ].join('');

        let order = !orderQuery ? '&order[createdAt]=desc' : orderQuery

        fetch(
            api.getUri()
            + `/warrants?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}${searchQueries}`,
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
    }, [
        datatablePage,
        perPage,
        orderQuery,
        location.pathname,
        searchCode,
        searchTravelTypeName,
        searchEmployeeSurname,
        searchDepartmentName,
        searchDestination,
        searchStatusName
    ]);

    return (
        <div>
            {loading && <Spinner/>}

            {isAuthorized(['ROLE_ADMIN']) ? (
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
                            <h2 className="flex-display">
                                Nalozi
                            </h2>
                            <h5>
                                Pretraga:
                            </h5>
                            <input
                                placeholder="Kod naloga"
                                className="search-fields"
                                value={searchCode}
                                onChange={e => setSearchCode(e.target.value)}
                            />
                            <input
                                placeholder="Tip naloga"
                                className="search-fields"
                                value={searchTravelTypeName}
                                onChange={e => setSearchTravelTypeName(e.target.value)}
                            /> <br/>
                            <input
                                placeholder="Prezime zaposlenika"
                                className="search-fields"
                                value={searchEmployeeSurname}
                                onChange={e => setSearchEmployeeSurname(e.target.value)}
                            />
                            <input
                                placeholder="Organizacijski dio"
                                className="search-fields"
                                value={searchDepartmentName}
                                onChange={e => setSearchDepartmentName(e.target.value)}
                            /><br/>
                            <input
                                placeholder="Odredište"
                                className="search-fields"
                                value={searchDestination}
                                onChange={e => setSearchDestination(e.target.value)}
                            />
                            <input
                                placeholder="Status"
                                className="search-fields"
                                value={searchStatusName}
                                onChange={e => setSearchStatusName(e.target.value)}
                            />
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