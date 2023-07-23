import {useHandleNonAuthenticated} from "../../../components/Security/HandleNonAuthenticated";
import React, {useEffect, useState} from "react";
import {IUserRole, IUserRoleModalData} from "./userRoleTypes";
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
import {successToastMessage} from "../../../components/Utils/successToastMessage";

export default function CatalogUserRole() {
    useHandleNonAuthenticated();

    const [userRoles, setUserRoles] = useState<IUserRole[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IUserRoleModalData>();
    const [refresh, setRefresh] = useState(0);


    const toggleShowModal = (userRoleId: number) => {
        setLoading(true)
        fetch(
            api.getUri() + `/employee-roles/${encodeURIComponent(userRoleId)}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(response => {
                    setModalData({
                        employee: {
                            title: 'Zaposlenik',
                            value: `${response.employee.surname} ${response.employee.name}`
                        },
                        employeeCode: {
                            title: 'Jedinstveni broj zaposlenika',
                            value: response.employee.code
                        },
                        employeeUsername: {
                            title: 'Korisničko ime zaposlenika',
                            value: response.employee.username
                        },
                        employeeWorkPosition: {
                            title: 'Radno mjesto zaposlenika',
                            value: response.employee.workPosition.name
                        },
                        employeeDepartment: {
                            title: 'Korisnikov organizacijski dio',
                            value: `${response.employee.department.name} (${response.employee.department.code})`
                        },
                        employeeActive: {
                            title: 'Aktivnost zaposlenika',
                            value: response.employee.active ? 'Aktivno' : 'Nekativno'
                        },
                        roleName: {
                            title: 'Rola',
                            value: response.role.name
                        },
                        department: {
                            title: 'Organizacijski dio role',
                            value: `${response.department.name} (${response.department.code})`
                        }
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

    const deleteEmployeeRole = (employeeRoleId: number) => {
        setLoading(true)
        fetch(api.getUri() + `/employee-roles/${employeeRoleId}`, {
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
                    <Dropdown.Item as={Link} to={`/user_role_edit/${props.id}`}>Ažuriraj</Dropdown.Item>
                    <Dropdown.Item onClick={() => deleteEmployeeRole(props.id)}>Obriši</Dropdown.Item>
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
            id: 'employee.code',
            name: 'BR. ZAPOSLENIKA',
            selector: (row: any) => row.employee.code,
            sortable: true,
            width: '180px'
        },
        {
            id: 'employee.username',
            name: 'KORISNIČKO IME',
            selector: (row: any) => row.employee.username,
            sortable: true,
            width: '180px'
        },
        {
            id: 'employee.surname',
            name: 'ZAPOSLENIK',
            selector: (row: any) => `${row.employee.surname} ${row.employee.name}`,
            sortable: true,
        },
        {
            id: 'role.name',
            name: 'NAZIV ROLE',
            selector: (row: any) => row.role.name,
            sortable: true,
        },
        {
            id: 'department.name',
            name: 'ORG. DIO ROLE',
            selector: (row: any) => `${row.department.name} (${row.department.code})`,
            sortable: true,
        }
    ];

    const fetchData = () => {
        setLoading(true);

        let order = !orderQuery ? '&order[employee.surname]=asc' : orderQuery

        fetch(
            api.getUri() + `/employee-roles?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                setUserRoles(response['hydra:member'])
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
    }, [datatablePage, perPage, orderQuery, refresh]);

    return (
        <div>
            {loading && <Spinner/>}

            {isAuthorized(['ROLE_ADMIN']) ? (
                <div>
                    <BaseDetailsModal title="Korisničko pravo info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <DataTable
                        title={
                            <>
                                <h2 className="flex-display">Katalog - Korisnička prava
                                    <Link className="add-new-record-btn" to="/user_role_add">
                                        <Button variant="primary">
                                            Dodaj Novi Zapis
                                        </Button>
                                    </Link>
                                </h2>
                            </>
                        }
                        columns={columns}
                        data={userRoles}
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
            )}
        </div>
    );
}