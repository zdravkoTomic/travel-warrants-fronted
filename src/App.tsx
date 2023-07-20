import React from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import PersonalWarrants from './pages/PersonalWarrants/PersonalWarrants';
import Login from './pages/Security/Login';
import PersonalCalculation from "./pages/PersonalWarrants/PersonalCalculation";
import PersonalClosedWarrants from "./pages/PersonalWarrants/PersonalClosedWarrants";
import CreditingAdvances from "./pages/CreditingWarrants/CreditingAdvances";
import CreditingCalculations from "./pages/CreditingWarrants/CreditingCalculations";
import CreditingPaidWarrants from "./pages/CreditingWarrants/CreditingPaidWarrants";
import CreditingQueue from "./pages/CreditingWarrants/CreditingQueue";
import CatalogCountry from "./pages/Catalogs/Country/CatalogCountry";
import CatalogDepartment from "./pages/Catalogs/Department/CatalogDepartment";
import CatalogEmployee from "./pages/Catalogs/Employee/CatalogEmployee";
import CatalogCountryWage from "./pages/Catalogs/CountryWage/CatalogCountryWage";
import ApprovingCalculation from "./pages/ApprovingWarrants/ApprovingCalculation";
import ApprovingInitial from "./pages/ApprovingWarrants/ApprovingInitial";
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
import {UserRoleDelete} from "./pages/Administration/UserRoles/Item/UserRoleDelete";

function App() {

    return (
        <>
            <ToastContainer/>
            <AppNavbar/>
            <div className="container">
                <Routes>
                    {/*Personal warrants*/}
                    <Route path="/" element={<PersonalWarrants/>}/>
                    <Route path="/personal/:groupStatusId" element={<PersonalWarrants/>}/>
                    <Route path="/personal_calculation" element={<PersonalCalculation/>}/>
                    <Route path="/personal_closed" element={<PersonalClosedWarrants/>}/>

                    {/*Warrants for approving*/}
                    <Route path="/approving_initial" element={<ApprovingInitial/>}/>
                    <Route path="/approving_calculation" element={<ApprovingCalculation/>}/>

                    {/*Crediting warrants*/}
                    <Route path="/crediting_advances" element={<CreditingAdvances/>}/>
                    <Route path="/crediting_calculation" element={<CreditingCalculations/>}/>
                    <Route path="/crediting_queue" element={<CreditingQueue/>}/>
                    <Route path="/crediting_paid" element={<CreditingPaidWarrants/>}/>

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

                    {/*Delete data routes*/}
                    <Route path="/user_role_delete/:id" element={<UserRoleDelete/>}/>

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
