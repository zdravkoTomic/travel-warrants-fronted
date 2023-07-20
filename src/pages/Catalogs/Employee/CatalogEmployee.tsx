import {useHandleNonAuthenticated} from "../../../components/Security/HandleNonAuthenticated";
import React, {useEffect, useState} from "react";
import {IEmployee, IEmployeeModalData} from "../Employee/employeeTypes";
import api from "../../../components/api";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {isAuthorized} from "../../../components/Security/UserAuth";
import BaseDetailsModal from "../../../components/BaseDetailsModal";
import DataTable from "react-data-table-component";
import Spinner from "../../../components/Utils/Spinner";
import {customStyles, paginationComponentOptions} from "../../../components/DataTableCustomStyle";
import Unauthorized from "../../Security/Unauthorized";

export default function CatalogEmployee() {
    useHandleNonAuthenticated();

    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IEmployeeModalData>();

    const toggleShowModal = (employeeId: number) => {
        fetch(
            api.getUri() + `/employees/${encodeURIComponent(employeeId)}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(response => {
                    setModalData({
                        code: {
                            title: 'Jedinstveni broj zaposlenika',
                            value: response.code
                        },
                        username: {
                            title: 'Korisničko ime',
                            value: response.username
                        },
                        name: {
                            title: 'Ime',
                            value: response.name
                        },
                        surname: {
                            title: 'Prezime',
                            value: response.surname
                        },
                        departmentCode: {
                            title: 'Kod organizacijskog dijela',
                            value: response.department.code
                        },
                        departmentName: {
                            title: 'Naziv organizacijskog dijela',
                            value: response.department.name
                        },
                        workPositionCode: {
                            title: 'Kod radnog mjesta',
                            value: response.workPosition.code
                        },
                        workPositionName: {
                            title: 'Naziv radnog mjesta',
                            value: response.workPosition.name
                        },
                        email: {
                            title: 'Email',
                            value: response.email
                        },
                        dateOfBirth: {
                            title: 'Datum rođenja',
                            value: new Date(response.dateOfBirth).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            }),
                        },
                        active: {
                            title: 'Aktivnost',
                            value: response.active ? 'Aktivno' : 'Nekativno'
                        },
                        fullyAuthorized: {
                            title: 'Potpuno autoriziran',
                            value: response.fullyAuthorized ? 'Da' : 'Ne'
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
                    <Dropdown.Item as={Link} to={`/employee_edit/${props.id}`}>Ažuriraj</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>,
            ignoreRowClick: true,
            allowOverflow: true,
            minWidth: '200px',
            center: true,
            button: true,
            selector: (row: any) => row.id
        },
        {
            id: 'code',
            name: 'JEDINSTVENI KOD',
            selector: (row: any) => row.code,
            sortable: true,
        },
        {
            id: 'username',
            name: 'KORISNIČKO IME',
            selector: (row: any) => row.username,
            sortable: true,
        },
        {
            id: 'surname',
            name: 'ZAPOSLENIK',
            selector: (row: any) => row.surname + ' ' + row.name,
            sortable: true,
        },
        {
            id: 'email',
            name: 'EMAIL',
            selector: (row: any) => row.email,
            sortable: true,
        },
        {
            id: 'department.name',
            name: 'ORG DIO',
            selector: (row: any) => row.department.name,
            sortable: true,
        },
        {
            id: 'active',
            name: 'AKTIVNOST',
            selector: (row: any) => row.active ? 'Aktivno' : 'Nekativno',
            sortable: true,
        }
    ];

    const fetchData = () => {
        setLoading(true);

        let order = !orderQuery ? '&order[surname]=asc' : orderQuery

        fetch(
            api.getUri() + `/employees?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                setEmployees(response['hydra:member'])
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
    }, [datatablePage, perPage, orderQuery]);

    return (
        <div>
            {isAuthorized(['ROLE_ADMIN']) ? (
                <div>
                    <BaseDetailsModal title="Zaposlenik info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <DataTable
                        title={
                            <>
                                <h2 className="flex-display">Katalog - Zaposlenici
                                    <Link className="add-new-record-btn" to="/employee_add">
                                        <Button variant="primary">
                                            Dodaj Novi Zapis
                                        </Button>
                                    </Link>
                                </h2>
                            </>
                        }
                        columns={columns}
                        data={employees}
                        progressPending={loading}
                        progressComponent={<Spinner/>}
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