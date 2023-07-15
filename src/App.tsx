import React from 'react';
import './App.css';
import AppNavbar from "./AppNavbar";
import HomePage from './pages/PersonalWarrants/HomePage';
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
import { Route, Routes } from "react-router-dom"
import LogoutUser from "./components/Security/LogoutUser";

function App() {

  return (
      <>
          <AppNavbar />
          <div className="container">
              <Routes>
                  <Route path="/personal/:groupStatusId" element={<HomePage />} />
                  <Route path="/personal_calculation" element={<PersonalCalculationPage />} />
                  <Route path="/personal_closed" element={<PersonalClosedWarrantsPage />} />
                  <Route path="/approving_initial" element={<ApprovingInitialPage />} />
                  <Route path="/approving_calculation" element={<ApprovingCalculationPage />} />
                  <Route path="/crediting_advances" element={<CreditingAdvancesPage />} />
                  <Route path="/crediting_calculation" element={<CreditingCalculationsPage />} />
                  <Route path="/crediting_queue" element={<CreditingQueuePage />} />
                  <Route path="/crediting_paid" element={<CreditingPaidWarrants />} />
                  <Route path="/catalog_employees" element={<CatalogEmployeePage />} />
                  <Route path="/catalog_department" element={<CatalogDepartmentPage />} />
                  <Route path="/catalog_countries" element={<CatalogCountryPage />} />
                  <Route path="/catalog_wages" element={<CatalogWagesPage />} />
                  <Route path="/user_roles" element={<UserRolesPage />} />
                  <Route path="/application_parameters" element={<ApplicationParametersPage />} />

                  {/*Adding data routes*/}
                  <Route path="/country_add" element={<CountryAddPage />} />

                  {/*Adding data routes*/}
                  <Route path="/country_edit/:id" element={<CountryEditPage />} />

                  {/*Security*/}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/logout" element={<LogoutUser />} />
              </Routes>
          </div>
      </>
  );
}

export default App;
