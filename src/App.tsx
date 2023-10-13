import { Box, CircularProgress } from "@mui/material";
import NotFoundPage from "core/NotFoundPage";
import Start from "core/Start";
import AddAppointment from "features/appointments/views/AddAppointment";
import AppointmentCreated from "features/appointments/views/AppointmentCreated";
import UserAppointments from "features/appointments/views/UserAppointments";
import Login from "features/auth/views/Login";
import Register from "features/auth/views/Register";
import AddClinicAffiliations from "features/clinicAffiliations/views/AddClinicAffiliations";
import EditClinicAffiliations from "features/clinicAffiliations/views/EditClinicAffiliations";
import UserClinicAffiliations from "features/clinicAffiliations/views/UserClinicAffiliations";
import AllClinics from "features/clinics/views/AllClinics";
import EditClinic from "features/clinics/views/EditClinic";
import AllDoctors from "features/doctors/views/AllDoctors";
import DoctorSpecializations from "features/doctors/views/DoctorSpecializations";
import SingleDoctor from "features/doctors/views/SingleDoctor";
import AllPatients from "features/patients/views/AllPatients";
import AccountManagement from "features/user/views/AccountManagement";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "routes/PrivateRoute";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";
import "./App.css";
import AddClinic from "./features/clinics/views/AddClinic";
function App() {
	return (
		<Suspense
			fallback={
				<Box minHeight={"100vh"} display="flex" justifyContent="center" alignItems="center">
					<CircularProgress />
				</Box>
			}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes>
						<Route element={<PrivateRoute />}>
							<Route path="/start" element={<Start />} />
							<Route path="/userClinicAffiliations" element={<UserClinicAffiliations />} />
							<Route path="/accountManagement" element={<AccountManagement />} />
							<Route path="/allDoctors" element={<AllDoctors />} />
							<Route path="/allPatients" element={<AllPatients />} />
							<Route path="/mySpecializations" element={<DoctorSpecializations />} />
							<Route path="/allClinics" element={<AllClinics />} />
							<Route path="/addClinic" element={<AddClinic />} />
							<Route path="/myAppointments" element={<UserAppointments />} />
							<Route path="/appointmentCreated" element={<AppointmentCreated />} />
							<Route path="/allDoctors/singleDoctor/:doctorId" element={<SingleDoctor />} />
							<Route path="/addAppointment/:doctorId" element={<AddAppointment />} />
							<Route path="/allClinics/editClinic/:clinicId" element={<EditClinic />} />
							<Route path="/addClinicAffiliations/:clinicId" element={<AddClinicAffiliations />} />
							<Route path="/editClinicAffiliations/:clinicId" element={<EditClinicAffiliations />} />
						</Route>

						<Route path="/" element={<Navigate to="/start" />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</BrowserRouter>
				<ToastContainer position="top-center" />
			</ThemeProvider>
		</Suspense>
	);
}

export default App;
