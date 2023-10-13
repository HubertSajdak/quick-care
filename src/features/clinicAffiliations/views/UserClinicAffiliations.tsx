import { useAppDispatch, useAppSelector } from "app/hooks";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useEffect } from "react";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { getCurrentUserClinicAffiliations } from "../clinicAffiliationsSlice";
import { Box, Grid, Typography } from "@mui/material";
import BasicCard from "components/BasicCard.tsx/BasicCard";
import theme from "styles/theme";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "userClinicAffiliations",
	},
];
const UserClinicAffiliations = () => {
	const dispatch = useAppDispatch();
	const { data } = useAppSelector(state => state.clinicAffiliations);
	useEffect(() => {
		dispatch(getCurrentUserClinicAffiliations());
	}, [dispatch]);

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform="capitalize" marginBottom={2}>
				Your Clinic Affiliations
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
					{data
						? data.map(el => {
								const listItemsArray = el.workingHours.map(day => {
									return {
										id: day.weekDay,
										text: `${day.weekDay}: ${day.startTime} - ${day.stopTime}`,
									};
								});
								return (
									<Grid item xs={12} sm={12} md={6}>
										<BasicCard
											key={el._id}
											title={`Clinic Name: ${el.clinicName}`}
											upperText={`Clinic Affiliation ID: ${el._id}`}
											lowerText={`Time per patient: ${el.timePerPatient}h`}
											description={""}
											listItemsArray={listItemsArray}
											sx={{ boxShadow: theme.shadows[5], padding: 0, margin: 0 }}
											buttonText="Edit Clinic Affiliation"
											isLink={true}
											to={`/editClinicAffiliations/${el.clinicId}`}
										/>
									</Grid>
								);
						  })
						: null}
				</Grid>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default UserClinicAffiliations;
