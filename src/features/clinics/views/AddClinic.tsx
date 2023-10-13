import { useYupTranslation } from "../../../common/useYupTranslation";
import { useAppDispatch } from "../../../app/hooks";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import Button from "components/Button/Button";
import { createClinic } from "../clinicsSlice";
import WorkingDayInfo from "components/WorkingDayInfo/WorkingDayInfo";

const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "allClinics",
	},
];

const workingDayConfig = [
	{
		id: 0,
		label: "monday",
		startTimeId: "monday-start-time",
		stopTimeId: "monday-stop-time",
		startTimeName: "workingTime[0].startTime",
		stopTimeName: "workingTime[0].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 1,
		label: "tuesday",
		startTimeId: "tuesday-start-time",
		stopTimeId: "tuesday-stop-time",
		startTimeName: "workingTime[1].startTime",
		stopTimeName: "workingTime[1].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 2,
		label: "wednesday",
		startTimeId: "wednesday-start-time",
		stopTimeId: "wednesday-stop-time",
		startTimeName: "workingTime[2].startTime",
		stopTimeName: "workingTime[2].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 3,
		label: "thursday",
		startTimeId: "thursday-start-time",
		stopTimeId: "thursday-stop-time",
		startTimeName: "workingTime[3].startTime",
		stopTimeName: "workingTime[3].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 4,
		label: "friday",
		startTimeId: "friday-start-time",
		stopTimeId: "friday-stop-time",
		startTimeName: "workingTime[4].startTime",
		stopTimeName: "workingTime[4].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 5,
		label: "saturday",
		startTimeId: "saturday-start-time",
		stopTimeId: "saturday-stop-time",
		startTimeName: "workingTime[5].startTime",
		stopTimeName: "workingTime[5].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 6,
		label: "sunday",
		startTimeId: "sunday-start-time",
		stopTimeId: "sunday-stop-time",
		startTimeName: "workingTime[6].startTime",
		stopTimeName: "workingTime[6].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
];

const AddClinic = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const { t } = useTranslation(["clinics"]);
	const PHONE_NUM_REGEX = /^[0-9\- ]{8,14}$/;

	const addClinicValidation = Yup.object({
		clinicName: Yup.string().required(),
		address: Yup.object({
			street: Yup.string().required(),
			city: Yup.string().required(),
			postalCode: Yup.string().required(),
		}),
		phoneNumber: Yup.string().matches(PHONE_NUM_REGEX, t("common:form.phoneNumberError")).required(),
		workingTime: Yup.array().required(),
	});

	const addClinicFormik = useFormik({
		initialValues: {
			clinicName: "",
			address: {
				street: "",
				city: "",
				postalCode: "",
			},
			phoneNumber: "",
			workingTime: [
				{
					weekDay: "monday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "tuesday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "wednesday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "thursday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "friday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "saturday",
					startTime: "",
					stopTime: "",
				},
				{
					weekDay: "sunday",
					startTime: "",
					stopTime: "",
				},
			],
		},
		validationSchema: addClinicValidation,
		onSubmit: (values, { resetForm }) => {
			dispatch(createClinic({ ...values, phoneNumber: +values.phoneNumber }));
			resetForm();
		},
	});

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("clinics:addClinicLabel")}
			</Typography>

			<Box
				width="100%"
				boxShadow="3"
				maxWidth={"md"}
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
				<Card sx={{ width: "100%" }}>
					<CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<FormikProvider value={addClinicFormik}>
							<form onSubmit={addClinicFormik.handleSubmit}>
								<Grid container columnSpacing={2} rowSpacing={1.5}>
									<Typography variant="h5" component="h2" p={"12px 16px"} display="block" width="100%">
										General Info
									</Typography>
									<Grid item xs={12} sm={12} md={12} minHeight="100px">
										<TextFieldFormik id="clinicName" label={t("common:form.clinicName")} name="clinicName" />
									</Grid>
									<Grid item xs={12} sm={12} md={12} minHeight="100px">
										<TextFieldFormik
											id="phoneNumber"
											label={t("common:form.phoneNumber")}
											name="phoneNumber"
											type="tel"
										/>
									</Grid>
									<Typography variant="h5" component="h2" p={"12px 16px"} display="block" width="100%">
										Address
									</Typography>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="street" label={t("common:form.street")} name="address.street" />
									</Grid>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="city" label={t("common:form.city")} name="address.city" />
									</Grid>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="postalCode" label={t("common:form.postalCode")} name="address.postalCode" />
									</Grid>
									<Typography variant="h5" component="h2" p={"12px 16px"} display="block" width="100%">
										Working Time
									</Typography>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										minHeight="100px"
										display="flex"
										flexDirection="column"
										gap="16px"
										mb={6}>
										{workingDayConfig.map(day => {
											return (
												<WorkingDayInfo
													key={day.id}
													label={day.label}
													startTimeId={day.startTimeId}
													stopTimeId={day.stopTimeId}
													startTimeName={day.startTimeName}
													stopTimeName={day.stopTimeName}
													startTimeLabel={day.startTimeLabel}
													stopTimeLabel={day.stopTimeLabel}
												/>
											);
										})}
									</Grid>
								</Grid>
								<Button type="submit" isSubmitting={addClinicFormik.isSubmitting}>
									{t("common:form.submitButton")}
								</Button>
							</form>
						</FormikProvider>
					</CardContent>
				</Card>
			</Box>
		</DashboardLayoutWrapper>
	);
};
export default AddClinic;
