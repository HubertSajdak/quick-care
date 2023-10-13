import { Box, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Button from "components/Button/Button";
import ClinicInfoCard from "components/ClinicInfoCard/ClinicInfoCard";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { getAllClinics } from "../clinicsSlice";
import theme from "styles/theme";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "allClinics",
	},
];
const AllClinics = () => {
	const dispatch = useAppDispatch();
	const clinics = useAppSelector(state => state.clinics.data);
	useEffect(() => {
		dispatch(getAllClinics());
	}, [dispatch]);
	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform="capitalize" marginBottom={2}>
				All Clinics
			</Typography>
			<Box
				width="100%"
				boxShadow="3"
				maxWidth={"md"}
				padding="16px"
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					backgroundColor: "white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0px 0px",
					margin: "0 auto",
				}}>
				<Grid container columnSpacing={2} rowSpacing={1.5}>
					{clinics ? (
						clinics.map(clinic => {
							return (
								<Grid item xs={12} sm={12} md={4} key={clinic._id}>
									<ClinicInfoCard
										clinicName={clinic.clinicName}
										address={clinic.address}
										phoneNumber={clinic.phoneNumber}
										photo={clinic.photo}
										workingTime={clinic.workingTime}
										sx={{ width: "100%", boxShadow: theme.shadows[8] }}
										renderButton={
											<>
												{/* @ts-ignore */}
												<Button component={Link} to={`/allClinics/editClinic/${clinic._id}`} sx={{ margin: "1rem" }}>
													Edit
												</Button>
												{/* @ts-ignore */}
												<Button component={Link} to={`/addClinicAffiliations/${clinic._id}`}>
													add as office
												</Button>
											</>
										}
									/>
								</Grid>
							);
						})
					) : (
						<Typography>No clinics found</Typography>
					)}
				</Grid>
			</Box>
		</DashboardLayoutWrapper>
	);
};
export default AllClinics;
