import {useHandleNonAuthenticated} from "../../../components/Security/HandleNonAuthenticated";
import React, {useEffect, useState} from "react";
import {IDepartment, IDepartmentModalData} from "./departmentTypes";
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

export default function CatalogDepartment() {
    useHandleNonAuthenticated();

    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IDepartmentModalData>();

    const toggleShowModal = (departmentId: number) => {
        fetch(
            api.getUri() + `/departments/${encodeURIComponent(departmentId)}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(response => {
                    setModalData({
                        code: {
                            title: 'Kod organizacijskog dijela',
                            value: response.code
                        },
                        name: {
                            title: 'Naziv organizacijskog dijela',
                            value: response.name
                        },
                        parentCode: {
                            title: 'Kod nadređenog organizacijskog dijela',
                            value: response.parent.code
                        },
                        parentName: {
                            title: 'Naziv nadređenog organizacijskog dijela',
                            value: response.parent.name
                        },
                        active: {
                            title: 'Aktivnost',
                            value: response.active ? 'Aktivno' : 'Nekativno'
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
                    <Dropdown.Item as={Link} to={`/department_edit/${props.id}`}>Ažuriraj</Dropdown.Item>
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
            name: 'KOD ORG. DIJELA',
            selector: (row: any) => row.code,
            sortable: true,
        },
        {
            id: 'name',
            name: 'NAZIV ORG. DIJELA',
            selector: (row: any) => row.name,
            sortable: true,
        },
        {
            id: 'parent.name',
            name: 'NADREĐENI ORG. DIO',
            selector: (row: any) => row.parent ? row.parent.name : null,
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

        let order = !orderQuery ? '&order[name]=asc' : orderQuery

        fetch(
            api.getUri() + `/departments?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                setDepartments(response['hydra:member'])
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
                    <BaseDetailsModal title="Organizacijski dio info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <DataTable
                        title={
                            <>
                                <h2 className="flex-display">Katalog - Organizacijski dijelovi
                                    <Link className="add-new-record-btn" to="/department_add">
                                        <Button variant="primary">
                                            Dodaj Novi Zapis
                                        </Button>
                                    </Link>
                                </h2>
                            </>
                        }
                        columns={columns}
                        data={departments}
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