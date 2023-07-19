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
import CatalogCountryPage from "./pages/Catalogs/Country/CatalogCountryPage";
import CatalogDepartmentPage from "./pages/Catalogs/Department/CatalogDepartmentPage";
import CatalogEmployeePage from "./pages/Catalogs/Employee/CatalogEmployeePage";
import CatalogCountryWagesPage from "./pages/Catalogs/CountryWage/CatalogCountryWagesPage";
import ApprovingCalculationPage from "./pages/ApprovingWarrants/ApprovingCalculationPage";
import ApprovingInitialPage from "./pages/ApprovingWarrants/ApprovingInitialPage";
import ApplicationParameters from "./pages/Administration/ApplicationParameters";
import UserRolesPage from "./pages/Administration/UserRolesPage";
import CountryAddPage from "./pages/Catalogs/Country/Item/CountryAddPage";
import CountryEditPage from "./pages/Catalogs/Country/Item/CountryEditPage";
import {Route, Routes} from "react-router-dom"
import LogoutUser from "./components/Security/LogoutUser";
import ResetPasswordPage from "./pages/Security/ResetPasswordPage";
import CatalogWorkPositionsPage from "./pages/Catalogs/WorkPosition/CatalogWorkPositionsPage";
import CatalogCurrencyPage from "./pages/Catalogs/Currency/CatalogCurrencyPage";
import CatalogExpenseTypePage from "./pages/Catalogs/ExpenseType/CatalogExpenseTypePage";
import CatalogPredefinedExpenses from "./pages/Catalogs/PredefinedExpense/CatalogPredefinedExpenses";
import CatalogVehicleTypePage from "./pages/Catalogs/VehicleType/CatalogVehicleTypePage";
import UnauthorizedPage from "./pages/Security/UnauthorizedPage";
import {ToastContainer} from "react-toastify";
import CurrencyAddPage from "./pages/Catalogs/Currency/Item/CurrencyAddPage";
import CurrencyEditPage from "./pages/Catalogs/Currency/Item/CurrencyEditPage";
import ExpenseTypeEditPage from "./pages/Catalogs/ExpenseType/Item/ExpenseTypeEditPage";
import ExpenseTypeAddPage from "./pages/Catalogs/ExpenseType/Item/ExpenseTypeAddPage";
import WorkPositionAddPage from "./pages/Catalogs/WorkPosition/Item/WorkPositionAddPage";
import WorkPositionEditPage from "./pages/Catalogs/WorkPosition/Item/WorkPositionEditPage";
import VehicleTypeAddPage from "./pages/Catalogs/VehicleType/Item/VehicleTypeAddPage";
import VehicleTypeEditPage from "./pages/Catalogs/VehicleType/Item/VehicleTypeEditPage";
import CountryWageAddPage from "./pages/Catalogs/CountryWage/Item/CountryWageAddPage";
import CountryWageEditPage from "./pages/Catalogs/CountryWage/Item/CountryWageEditPage";
import DepartmentAddPage from "./pages/Catalogs/Department/Item/DepartmentAddPage";
import DepartmentEditPage from "./pages/Catalogs/Department/Item/DepartmentEditPage";
import EmployeeAddPage from "./pages/Catalogs/Employee/Item/EmployeeAddPage";
import EmployeeEditPage from "./pages/Catalogs/Employee/Item/EmployeeEditPage";

function App() {

    return (
        <>
            <ToastContainer/>
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
                    <Route path="/catalog_country_wages" element={<CatalogCountryWagesPage/>}/>
                    <Route path="/catalog_currencies" element={<CatalogCurrencyPage/>}/>
                    <Route path="/catalog_expense_types" element={<CatalogExpenseTypePage/>}/>
                    <Route path="/catalog_predefined_expenses" element={<CatalogPredefinedExpenses/>}/>
                    <Route path="/catalog_vehicle_types" element={<CatalogVehicleTypePage/>}/>

                    {/*Admin catalogs*/}
                    <Route path="/catalog_employees" element={<CatalogEmployeePage/>}/>
                    <Route path="/catalog_department" element={<CatalogDepartmentPage/>}/>
                    <Route path="/user_roles" element={<UserRolesPage/>}/>
                    <Route path="/catalog_work_positions" element={<CatalogWorkPositionsPage/>}/>
                    <Route path="/application_parameters" element={<ApplicationParameters/>}/>

                    {/*Adding data routes*/}
                    <Route path="/country_add" element={<CountryAddPage/>}/>
                    <Route path="/currency_add" element={<CurrencyAddPage/>}/>
                    <Route path="/expense_type_add" element={<ExpenseTypeAddPage/>}/>
                    <Route path="/work_position_add" element={<WorkPositionAddPage/>}/>
                    <Route path="/vehicle_type_add" element={<VehicleTypeAddPage/>}/>
                    <Route path="/country_wage_add" element={<CountryWageAddPage/>}/>
                    <Route path="/department_add" element={<DepartmentAddPage/>}/>
                    <Route path="/employee_add" element={<EmployeeAddPage/>}/>

                    {/*Editing data routes*/}
                    <Route path="/country_edit/:id" element={<CountryEditPage/>}/>
                    <Route path="/currency_edit/:id" element={<CurrencyEditPage/>}/>
                    <Route path="/expense_type_edit/:id" element={<ExpenseTypeEditPage/>}/>
                    <Route path="/work_position_edit/:id" element={<WorkPositionEditPage/>}/>
                    <Route path="/vehicle_type_edit/:id" element={<VehicleTypeEditPage/>}/>
                    <Route path="/country_wage_edit/:id" element={<CountryWageEditPage/>}/>
                    <Route path="/department_edit/:id" element={<DepartmentEditPage/>}/>
                    <Route path="/employee_edit/:id" element={<EmployeeEditPage/>}/>

                    {/*Security*/}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/logout" element={<LogoutUser/>}/>
                    <Route path="/password_reset/:employeeId" element={<ResetPasswordPage/>}/>
                    <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
