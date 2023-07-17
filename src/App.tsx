import React from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import PersonalWarrantsPage from './pages/PersonalWarrants/PersonalWarrantsPage';
import LoginPage from './pages/Security/LoginPage';
import PersonalCalculationPage from "./pages/PersonalWarrants/PersonalCalculationPage";
import PersonalClosedWarrantsPage from "./pages/PersonalWarrants/PersonalClosedWarrantsPage";
import CreditingAdvancesPage from "./pages/CreditingWarrants/CreditingAdvancesPage";
import CreditingCalculationsPage from "./pages/CreditingWarrants/CreditingCalculationsPage";
import CreditingPaidWarrants from "./pages/CreditingWarrants/CreditingPaidWarrants";
import CreditingQueuePage from "./pages/CreditingWarrants/CreditingQueuePage";
import CatalogCountryPage from "./pages/Catalogs/CatalogCountryPage";
import CatalogDepartmentPage from "./pages/Catalogs/CatalogDepartmentPage";
import CatalogEmployeePage from "./pages/Catalogs/CatalogEmployeePage";
import CatalogWagesPage from "./pages/Catalogs/CatalogWagesPage";
import ApprovingCalculationPage from "./pages/ApprovingWarrants/ApprovingCalculationPage";
import ApprovingInitialPage from "./pages/ApprovingWarrants/ApprovingInitialPage";
import ApplicationParametersPage from "./pages/Administration/ApplicationParametersPage";
import UserRolesPage from "./pages/Administration/UserRolesPage";
import CountryAddPage from "./pages/Catalogs/Item/CountryAddPage";
import CountryEditPage from "./pages/Catalogs/Item/CountryEditPage";
import {Route, Routes} from "react-router-dom"
import LogoutUser from "./components/Security/LogoutUser";
import ResetPasswordPage from "./pages/Security/ResetPasswordPage";
import CatalogWorkPositionsPage from "./pages/Catalogs/CatalogWorkPositionsPage";
import CatalogCurrencyPage from "./pages/Catalogs/CatalogCurrencyPage";
import CatalogExpenseTypePage from "./pages/Catalogs/CatalogExpenseTypePage";
import CatalogPredefinedExpenses from "./pages/Catalogs/CatalogPredefinedExpenses";
import CatalogVehicleTypePage from "./pages/Catalogs/CatalogVehicleTypePage";

function App() {

    return (
        <>
            <AppNavbar/>
            <div className="container">
                <Routes>
                    {/*Personal warrants*/}
                    <Route path="/" element={<PersonalWarrantsPage/>}/>
                    <Route path="/personal/:groupStatusId" element={<PersonalWarrantsPage/>}/>
                    <Route path="/personal_calculation" element={<PersonalCalculationPage/>}/>
                    <Route path="/personal_closed" element={<PersonalClosedWarrantsPage/>}/>

                    {/*Warrants for approving*/}
                    <Route path="/approving_initial" element={<ApprovingInitialPage/>}/>
                    <Route path="/approving_calculation" element={<ApprovingCalculationPage/>}/>

                    {/*Crediting warrants*/}
                    <Route path="/crediting_advances" element={<CreditingAdvancesPage/>}/>
                    <Route path="/crediting_calculation" element={<CreditingCalculationsPage/>}/>
                    <Route path="/crediting_queue" element={<CreditingQueuePage/>}/>
                    <Route path="/crediting_paid" element={<CreditingPaidWarrants/>}/>

                    {/*Catalogs*/}
                    <Route path="/catalog_countries" element={<CatalogCountryPage/>}/>
                    <Route path="/catalog_wages" element={<CatalogWagesPage/>}/>
                    <Route path="/catalog_currencies" element={<CatalogCurrencyPage/>}/>
                    <Route path="/catalog_expense_types" element={<CatalogExpenseTypePage/>}/>
                    <Route path="/catalog_predefined_expenses" element={<CatalogPredefinedExpenses/>}/>
                    <Route path="/catalog_vehicle_types" element={<CatalogVehicleTypePage/>}/>

                    {/*Admin catalogs*/}
                    <Route path="/catalog_employees" element={<CatalogEmployeePage/>}/>
                    <Route path="/catalog_department" element={<CatalogDepartmentPage/>}/>
                    <Route path="/user_roles" element={<UserRolesPage/>}/>
                    <Route path="/catalog_work_positions" element={<CatalogWorkPositionsPage/>}/>
                    <Route path="/application_parameters" element={<ApplicationParametersPage/>}/>

                    {/*Adding data routes*/}
                    <Route path="/country_add" element={<CountryAddPage/>}/>

                    {/*Adding data routes*/}
                    <Route path="/country_edit/:id" element={<CountryEditPage/>}/>

                    {/*Security*/}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/logout" element={<LogoutUser/>}/>
                    <Route path="/password_reset/:employeeId" element={<ResetPasswordPage/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
