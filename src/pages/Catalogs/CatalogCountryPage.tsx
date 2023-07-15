import React, {useCallback, useEffect, useState} from "react";
import api from "../../components/api";
import DataTable from 'react-data-table-component';
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import BaseDetailsModal from "../../components/BaseDetailsModal";
import {Link} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {ICountry, ICountryModalData} from "../../types/Catalog/catalogTypes";
import {customStyles, paginationComponentOptions} from "../../components/DataTableCustomStyle";
import Spinner from "../../components/Utils/Spinner";

export default function CatalogCountryPage() {
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [page, setPage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<ICountryModalData>();
    const [tableAction, setTableAction] = useState(false);
    const [mounted, setMounted] = useState(false);

    const toggleShowModal = (countryId: number) => {
        fetch(
            api.getUri()
            + `/countries/${encodeURIComponent(countryId)}`
        )
            .then(response => response.json())
            .then(response => {
                setModalData({
                    name: {
                        title: 'Ime države',
                        value: response.name
                    },
                    code: {
                        title: 'Službena međunarodna skraćenica',
                        value: response.code
                    },
                    active: {
                        title: 'Aktivnost',
                        value: response.active ? 'Aktivno' : 'Nekativno'
                    },
                    domicile: {
                        title: 'Status države',
                        value: response.domicile ? 'Domicilna država' : 'Inozemna država'
                    }
                })
            }
            )
            .then(() => {
                setLoading(false)
                setShowModal(!showModal);
            })
            .catch((error) => {
                alert(error) //TODO
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
                    <Dropdown.Item as={Link} to={`/country_edit/${props.id}`}>Ažuriraj</Dropdown.Item>
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
            name: 'SKRAĆENICA',
            selector: (row: any) => row.code,
            sortable: true,
        },
        {
            id: 'name',
            name: 'NAZIV',
            selector: (row: any) => row.name,
            sortable: true,
        },
        {
            id: 'active',
            name: 'AKTIVNOST',
            selector: (row: any) => row.active ? 'Aktivno' : 'Nekativno',
            sortable: true,
        },
        {
            id: 'domicile',
            name: 'STATUS DRŽAVE',
            selector: (row: any) => row.domicile ? 'Domicilna država' : 'Inozemna država',
            sortable: true,
        }
    ];

    const fetchData = useCallback((page: any, perPage: any, order: any | null) => {
        setLoading(true);

        if (!order) {
            order = '&order[name]=asc'
        }

        const sessionCookie = localStorage.getItem('sessionCookie');

        fetch(
            api.getUri() + `/countries?page=${encodeURIComponent(page)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {headers: {
                    'Content-Type': 'application/json',
                    Cookie: `PHPSESSID=${sessionCookie}`, // Include the session cookie in the request headers
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                setCountries(response['hydra:member'])
                setTotalRows(response['hydra:totalItems'])
            })
            .catch((error) => {
                // alert(error) //TODO
            }).finally(() => {
            setLoading(false);
        });

        setPerPage(perPage)
    }, []);

    const handlePageChange = (page: any) => {
        if (!mounted) {
            return
        }
        setTableAction(true);
        if (!orderQuery) {
            setOrderQuery('&order[name]=asc')
        }
        setPage(page)
        fetchData(page, perPage, orderQuery);
    };

    const handlePerRowsChange = (newPerPage: any, page: any) => {
        if (!mounted) {
            return
        }
        setTableAction(true);
        if (!orderQuery) {
            setOrderQuery('&order[name]=asc')
        }
        fetchData(page, newPerPage, orderQuery);
        setPerPage(newPerPage);
    };

    const handleSort = (column: any, sortDirection: any) => {
        if (!mounted) {
            return
        }
        setTableAction(true);
        if (!orderQuery) {
            setOrderQuery('&order[name]=asc')
        }
        setOrderQuery(`&order[${column.id}]=${encodeURIComponent(sortDirection)}`)

        let order = `&order[${column.id}]=${encodeURIComponent(sortDirection)}`;

        fetchData(page, perPage, order);
    };

    useEffect(() => {
        if (!orderQuery) {
            setOrderQuery('&order[name]=asc');
        }

        if (!tableAction) {
            fetchData(page, perPage, orderQuery);
            setMounted(false)
            setTableAction(false);
        }

        setMounted(true)
    }, [fetchData, page, perPage, orderQuery, tableAction]);

    return (
        <div>
            <ToastContainer />
            <BaseDetailsModal title="Država info" show={showModal} modalData={modalData} onCloseButtonClick={toggleShowModal}/>
            <DataTable
                title={
                    <>
                        <h2 className="flex-display">Katalog - Države
                            <Link className="add-new-record-btn" to="/country_add">
                            <Button variant="primary">
                                Dodaj Novi Zapis
                            </Button>
                            </Link>
                        </h2>
                    </>
                }
                columns={columns}
                data={countries}
                progressPending={loading}
                progressComponent={<Spinner />}
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
    );
}

