import {useHandleNonAuthenticated} from "../../../components/Security/HandleNonAuthenticated";
import React, {useEffect, useState} from "react";
import {ICountryWage, ICountryWageModalData} from "./countryWageTypes";
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

export default function CatalogCountryWage() {
    useHandleNonAuthenticated();

    const [countryWages, setCountryWages] = useState<ICountryWage[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(25);
    const [datatablePage, setDatatablePage] = useState(1);
    const [orderQuery, setOrderQuery] = useState<String>();
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<ICountryWageModalData>();

    const toggleShowModal = (countryWageId: number) => {
        setLoading(true)
        fetch(
            api.getUri() + `/country-wages/${encodeURIComponent(countryWageId)}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(response => {
                    setModalData({
                        countryCode: {
                            title: 'Država međunarodni kod',
                            value: response.country.code
                        },
                        countryName: {
                            title: 'Država naziv',
                            value: response.country.name
                        },
                        currencyCode: {
                            title: 'Valuta međunarodni kod',
                            value: response.currency.code
                        },
                        currencyCodeNumeric: {
                            title: 'Valuta međunarodni brojčani kod',
                            value: response.currency.codeNumeric
                        },
                        currencyName: {
                            title: 'Valuta naziv',
                            value: response.currency.name
                        },
                        amount: {
                            title: 'Iznos pojedinačne dnevnice',
                            value: response.amount.toFixed(2).toString()
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
                    <Dropdown.Item as={Link} to={`/country_wage_edit/${props.id}`}>Ažuriraj</Dropdown.Item>
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
            id: 'country.code',
            name: 'DRŽAVA',
            selector: (row: any) => row.country.code,
            sortable: true,
        },
        {
            id: 'country.name',
            name: 'DRŽAVA NAZIV',
            selector: (row: any) => row.country.name,
            sortable: true,
        },
        {
            id: 'amount',
            name: 'IZNOS',
            selector: (row: any) => row.amount.toFixed(2) + ' ' + row.currency.code,
            sortable: true,
        },
        {
            id: 'currency.name',
            name: 'VALUTA NAZIV',
            selector: (row: any) => row.currency.name,
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

        let order = !orderQuery ? '&order[country.name]=asc' : orderQuery

        fetch(
            api.getUri() + `/country-wages?page=${encodeURIComponent(datatablePage)}&itemsperpage=${encodeURIComponent(perPage)}${order}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            }
        )
            .then(response => response.json())
            .then(response => {
                setCountryWages(response['hydra:member'])
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
                    <BaseDetailsModal title="Dnevnica info" show={showModal} modalData={modalData}
                                      onCloseButtonClick={() => {
                                          setShowModal(false)
                                      }}/>
                    <DataTable
                        title={
                            <>
                                <h2 className="flex-display">Katalog - Dnevnice
                                    <Link className="add-new-record-btn" to="/country_wage_add">
                                        <Button variant="primary">
                                            Dodaj Novi Zapis
                                        </Button>
                                    </Link>
                                </h2>
                            </>
                        }
                        columns={columns}
                        data={countryWages}
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