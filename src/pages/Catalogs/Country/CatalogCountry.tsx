import React, {useEffect, useState} from "react";
import api from "../../../components/api";
import DataTable from 'react-data-table-component';
import {Button, ButtonGroup, Dropdown} from "react-bootstrap";
import BaseDetailsModal from "../../../components/BaseDetailsModal";
import {Link} from "react-router-dom";
import {ICountry, ICountryModalData} from "./countryTypes";
import {customStyles, paginationComponentOptions} from "../../../components/DataTableCustomStyle";
import Spinner from "../../../components/Utils/Spinner";
import {isAuthorized} from "../../../components/Security/UserAuth";
import {useHandleNonAuthenticated} from "../../../components/Security/HandleNonAuthenticated";
import Unauthorized from "../../Security/Unauthorized";
import {alertToastMessage} from "../../../components/Utils/alertToastMessage";

export default function CatalogCountry() {
    useHandleNonAuthenticated();

    const [countries, setCountries] = useState<ICountry[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<ICountryModalData>();

    const toggleShowModal = (countryId: number) => {
        setLoading(true)
        fetch(
            api.getUri() + `/countries/${encodeURIComponent(countryId)}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(response => {
                    setModalData({
                        code: {
                            title: 'Službena međunarodna skraćenica',
                            value: response.code
                        },
                        name: {
                            title: 'Ime države',
                            value: response.name
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

    const fetchData = () => {
        setLoading(true);

        let order = !orderQuery ? '&order[name]=asc' : orderQuery

        fetch(
            api.getUri() + `/countries?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {
                headers: {
                    'Content-Type': 'application/json'
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
            {loading && <Spinner/>}

            {isAuthorized(['ROLE_ADMIN', 'ROLE_PROCURATOR']) ? (
                <div>
                    <BaseDetailsModal title="Država info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
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
