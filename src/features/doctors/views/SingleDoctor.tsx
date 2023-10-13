import { Box, Divider, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Button from "components/Button/Button";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import ClinicAffiliationsSection from "../components/ClinicAffiliationsSection/ClinicAffiliationsSection";
import DoctorInfoSection from "../components/DoctorInfoSection/DoctorInfoSection";
import SpecializationSection from "../components/SpecializationSection/SpecializationSection";
import { getSingleDoctor } from "../doctorsSlice";
const SingleDoctor = () => {
	const dispatch = useAppDispatch();
	const params = useParams();
	const singleDoctorInfo = useAppSelector(state => state.doctors.singleDoctorData.data);
	useEffect(() => {
		if (!params.doctorId) return;
		dispatch(getSingleDoctor(params.doctorId));
	}, [dispatch, params.doctorId]);

	const mapDayNamesToNumbers = (weekDay: string): number | undefined => {
		if (weekDay === "monday") return 1;
		if (weekDay === "tuesday") return 2;
		if (weekDay === "wednesday") return 3;
		if (weekDay === "thursday") return 4;
		if (weekDay === "friday") return 5;
		if (weekDay === "saturday") return 6;
		if (weekDay === "sunday") return 0;
	};

	const breadcrumbs: BreadcrumbsProps[] = [
		{
			label: "dashboard",
			to: "start",
		},
		{
			label: "allDoctors",
			to: "allDoctors",
		},
		{
			label: `${singleDoctorInfo?.name} ${singleDoctorInfo?.surname}`,
			noTranslation: true,
		},
	];
	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{singleDoctorInfo?.name} {singleDoctorInfo?.surname}
			</Typography>
			<Box
				width="100%"
				boxShadow="3"
				padding="1rem"
				maxWidth={{ lg: "lg", md: "850px", sm: "530px", xs: "300px" }}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignitems: "center",
					backgroundColor: "white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0 0",
					margin: "0 auto",
					gap: "16px",
				}}>
				<Typography variant="h4" textAlign="center">
					General Info
				</Typography>
				<DoctorInfoSection
					name={singleDoctorInfo?.name || ""}
					surname={singleDoctorInfo?.surname || ""}
					email={singleDoctorInfo?.email || ""}
					photo={singleDoctorInfo?.photo || ""}
				/>
				<Divider />

				<Typography variant="h4" textAlign="center">
					Specializations
				</Typography>

				<SpecializationSection />
				<Divider />
				<Typography variant="h4" textAlign="center">
					Clinic Affiliations
				</Typography>

				<ClinicAffiliationsSection />
				<Divider />
				{/* @ts-ignore */}
				<Button size="large" variant="text" component={Link} to={`/addAppointment/${params.doctorId}`}>
					Make an appointment
				</Button>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default SingleDoctor;
