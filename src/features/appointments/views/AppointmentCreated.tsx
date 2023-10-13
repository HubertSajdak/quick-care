import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ReactComponent as Logo } from "images/logo.svg";
import BasePageLayout from "layouts/BasePageLayout/BasePageLayout";
import moment from "moment";
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import theme from "styles/theme";
import { appointmentsActions } from "../appointmentsSlice";
const AppointmentCreated = () => {
	const dispatch = useAppDispatch();
	const createdAppointmentDetails = useAppSelector(state => state.appointments.createdAppointmentDetails);

	useEffect(() => {
		dispatch(appointmentsActions.setIsAppointmentCreated(false));
	}, [dispatch]);

	if (!createdAppointmentDetails) {
		return <Navigate to="/myAppointments" />;
	}

	return (
		<BasePageLayout img={<Logo width={"100%"} />}>
			<Box display="flex" flexDirection="column" width="100%" maxWidth={"md"}>
				<Typography component={"h1"} variant="h4" textAlign="center">
					Appointment Info
				</Typography>
				<Box
					width="100%"
					boxShadow="3"
					maxWidth={"md"}
					padding="16px"
					sx={{
						display: "flex",
						flexDirection: "column",
						backgroundColor: "white",
						borderTop: 5,
						borderColor: "primary.main",
						borderRadius: "8px 8px 0px 0px",
						margin: "0 auto",
					}}>
					<Typography component={"p"} variant="h6">
						Clinic name: {createdAppointmentDetails?.selectedClinicAffiliation?.clinicName || ""}
					</Typography>
					<Typography component={"p"} variant="h6">
						Address:
					</Typography>
					<List>
						<ListItem>
							<Typography>
								Street: {createdAppointmentDetails?.selectedClinicAffiliation?.clinicInfo?.address?.street || ""}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								City: {createdAppointmentDetails?.selectedClinicAffiliation?.clinicInfo?.address?.city || ""}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography>
								Postal Code:{" "}
								{createdAppointmentDetails?.selectedClinicAffiliation?.clinicInfo?.address?.postalCode || ""}
							</Typography>
						</ListItem>
					</List>
					<Typography component={"p"} variant="h6">
						Appointment Date: {moment(createdAppointmentDetails?.selectedDate).format("Do MM yyyy")}
					</Typography>
					<Typography component={"p"} variant="h6">
						Appointment Time: {moment(createdAppointmentDetails?.selectedDate).format("HH:mm")}
					</Typography>
					<Typography component={"p"} variant="h6">
						Doctor: {createdAppointmentDetails?.doctor?.name} {createdAppointmentDetails?.doctor?.surname}
					</Typography>
					<Typography component={"p"} variant="h6">
						Consultation Fee: {createdAppointmentDetails?.selectedClinicAffiliation?.consultationFee}
					</Typography>
					<Typography component={"p"} variant="h6">
						Estimated Consultation Time: {createdAppointmentDetails?.selectedClinicAffiliation?.timePerPatient} min.
					</Typography>
					<Typography component={"p"} variant="h6">
						Want to change appointment date or cancel it? Go to
						<Link
							to="/myAppointments"
							style={{
								marginLeft: "0.5rem",
								color: theme.palette.primary.main,
							}}>
							My Appointments
						</Link>
					</Typography>
					{/* @ts-ignore */}
					<Button component={Link} to={"/start"} size="large">
						Return
					</Button>
				</Box>
			</Box>
		</BasePageLayout>
	);
};

export default AppointmentCreated;
