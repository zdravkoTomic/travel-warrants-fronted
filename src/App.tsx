import React from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import PersonalWarrant from './pages/PersonalWarrants/PersonalWarrants';
import Login from './pages/Security/Login';
import CreditingWarrants from "./pages/CreditingWarrants/CreditingWarrants";
import CatalogCountry from "./pages/Catalogs/Country/CatalogCountry";
import CatalogDepartment from "./pages/Catalogs/Department/CatalogDepartment";
import CatalogEmployee from "./pages/Catalogs/Employee/CatalogEmployee";
import CatalogCountryWage from "./pages/Catalogs/CountryWage/CatalogCountryWage";
import ApprovingWarrant from "./pages/ApprovingWarrants/ApprovingWarrant";
import ApplicationParameters from "./pages/Administration/ApplicationParameters";
import UserRoles from "./pages/Administration/UserRoles/UserRoles";
import CountryAdd from "./pages/Catalogs/Country/Item/CountryAdd";
import CountryEdit from "./pages/Catalogs/Country/Item/CountryEdit";
import {Route, Routes} from "react-router-dom"
import LogoutUser from "./components/Security/LogoutUser";
import ResetPassword from "./pages/Security/ResetPassword";
import CatalogWorkPosition from "./pages/Catalogs/WorkPosition/CatalogWorkPosition";
import CatalogCurrency from "./pages/Catalogs/Currency/CatalogCurrency";
import CatalogExpenseType from "./pages/Catalogs/ExpenseType/CatalogExpenseType";
import CatalogPredefinedExpenses from "./pages/Catalogs/PredefinedExpense/CatalogPredefinedExpenses";
import CatalogVehicleType from "./pages/Catalogs/VehicleType/CatalogVehicleType";
import Unauthorized from "./pages/Security/Unauthorized";
import {ToastContainer} from "react-toastify";
import CurrencyAdd from "./pages/Catalogs/Currency/Item/CurrencyAdd";
import CurrencyEdit from "./pages/Catalogs/Currency/Item/CurrencyEdit";
import ExpenseTypeEdit from "./pages/Catalogs/ExpenseType/Item/ExpenseTypeEdit";
import ExpenseTypeAdd from "./pages/Catalogs/ExpenseType/Item/ExpenseTypeAdd";
import WorkPositionAdd from "./pages/Catalogs/WorkPosition/Item/WorkPositionAdd";
import WorkPositionEdit from "./pages/Catalogs/WorkPosition/Item/WorkPositionEdit";
import VehicleTypeAdd from "./pages/Catalogs/VehicleType/Item/VehicleTypeAdd";
import VehicleTypeEdit from "./pages/Catalogs/VehicleType/Item/VehicleTypeEdit";
import CountryWageAdd from "./pages/Catalogs/CountryWage/Item/CountryWageAdd";
import CountryWageEdit from "./pages/Catalogs/CountryWage/Item/CountryWageEdit";
import DepartmentAdd from "./pages/Catalogs/Department/Item/DepartmentAdd";
import DepartmentEdit from "./pages/Catalogs/Department/Item/DepartmentEdit";
import EmployeeAdd from "./pages/Catalogs/Employee/Item/EmployeeAdd";
import EmployeeEdit from "./pages/Catalogs/Employee/Item/EmployeeEdit";
import UserRoleAdd from "./pages/Administration/UserRoles/Item/UserRoleAdd";
import UserRoleEdit from "./pages/Administration/UserRoles/Item/UserRoleEdit";
import InitialWarrantAdd from "./pages/PersonalWarrants/ItemInitial/InitialWarrantAdd";
import InitialWarrantEdit from "./pages/PersonalWarrants/ItemInitial/InitialWarrantEdit";
import CalculationWarrantAdd from "./pages/PersonalWarrants/Calculation/CalculationWarrantAdd";
import CalculationWarrantEdit from "./pages/PersonalWarrants/Calculation/CalculationWarrantEdit";
import CreditingWarrantPayment from "./pages/CreditingWarrants/CreditingWarrantPayment";
import CreditingWarrantPaid from "./pages/CreditingWarrants/CreditingWarrantPaid";
import Warrants from "./pages/Administration/Warrants";

function App() {

    return (
        <>
            <ToastContainer/>
            <AppNavbar/>
            <div className="container">
                <Routes>
                    {/*Personal warrants*/}
                    <Route path="/" element={<PersonalWarrant/>}/>
                    <Route path="/personal_warrant/:groupStatusCode" element={<PersonalWarrant/>}/>

                    {/*Warrants for approving*/}
                    <Route path="/approving_warrant/:statusCode" element={<ApprovingWarrant/>}/>

                    {/*Crediting warrants*/}
                    <Route path="/crediting_warrants/:statusCode" element={<CreditingWarrants/>}/>

                    {/*Payment*/}
                    <Route path="/crediting_queue/:statusCode" element={<CreditingWarrantPayment/>}/>
                    <Route path="/crediting_paid/:statusCode" element={<CreditingWarrantPaid/>}/>

                    {/*Catalogs*/}
                    <Route path="/catalog_countries" element={<CatalogCountry/>}/>
                    <Route path="/catalog_country_wages" element={<CatalogCountryWage/>}/>
                    <Route path="/catalog_currencies" element={<CatalogCurrency/>}/>
                    <Route path="/catalog_expense_types" element={<CatalogExpenseType/>}/>
                    <Route path="/catalog_predefined_expenses" element={<CatalogPredefinedExpenses/>}/>
                    <Route path="/catalog_vehicle_types" element={<CatalogVehicleType/>}/>

                    {/*Admin catalogs*/}
                    <Route path="/catalog_employees" element={<CatalogEmployee/>}/>
                    <Route path="/catalog_department" element={<CatalogDepartment/>}/>
                    <Route path="/user_roles" element={<UserRoles/>}/>
                    <Route path="/catalog_work_positions" element={<CatalogWorkPosition/>}/>
                    <Route path="/application_parameters" element={<ApplicationParameters/>}/>
                    <Route path="/warrants" element={<Warrants/>}/>

                    {/*Adding data routes*/}
                    <Route path="/country_add" element={<CountryAdd/>}/>
                    <Route path="/currency_add" element={<CurrencyAdd/>}/>
                    <Route path="/expense_type_add" element={<ExpenseTypeAdd/>}/>
                    <Route path="/work_position_add" element={<WorkPositionAdd/>}/>
                    <Route path="/vehicle_type_add" element={<VehicleTypeAdd/>}/>
                    <Route path="/country_wage_add" element={<CountryWageAdd/>}/>
                    <Route path="/department_add" element={<DepartmentAdd/>}/>
                    <Route path="/employee_add" element={<EmployeeAdd/>}/>
                    <Route path="/user_role_add" element={<UserRoleAdd/>}/>
                    <Route path="/initial_warrant_add" element={<InitialWarrantAdd/>}/>
                    <Route path="/calculation_warrant_add/:warrantId/:travelTypeCode"
                           element={<CalculationWarrantAdd/>}/>

                    {/*Editing data routes*/}
                    <Route path="/country_edit/:id" element={<CountryEdit/>}/>
                    <Route path="/currency_edit/:id" element={<CurrencyEdit/>}/>
                    <Route path="/expense_type_edit/:id" element={<ExpenseTypeEdit/>}/>
                    <Route path="/work_position_edit/:id" element={<WorkPositionEdit/>}/>
                    <Route path="/vehicle_type_edit/:id" element={<VehicleTypeEdit/>}/>
                    <Route path="/country_wage_edit/:id" element={<CountryWageEdit/>}/>
                    <Route path="/department_edit/:id" element={<DepartmentEdit/>}/>
                    <Route path="/employee_edit/:id" element={<EmployeeEdit/>}/>
                    <Route path="/user_role_edit/:id" element={<UserRoleEdit/>}/>
                    <Route path="/initial_warrant_edit/:id" element={<InitialWarrantEdit/>}/>
                    <Route path="/calculation_warrant_edit/:id/:warrantId/:travelTypeCode"
                           element={<CalculationWarrantEdit/>}/>

                    {/*Security*/}
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<LogoutUser/>}/>
                    <Route path="/password_reset/:employeeId" element={<ResetPassword/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
