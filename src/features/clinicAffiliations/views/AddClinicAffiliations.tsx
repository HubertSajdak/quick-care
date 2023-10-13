import { Box, Button, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useYupTranslation } from "common/useYupTranslation";
import DatePickerFormik from "components/DatePickerFormik/DatePickerFormik";
import SelectFormik from "components/SelectFormik/SelectFormik";
import SwitchFormik from "components/SwitchFormik/SwitchFormik";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import WorkingDayInfo from "components/WorkingDayInfo/WorkingDayInfo";
import { getSingleClinic } from "features/clinics/clinicsSlice";
import { FormikProvider, useFormik } from "formik";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import theme from "styles/theme";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import * as Yup from "yup";
import { createClinicAffiliations } from "../clinicAffiliationsSlice";

const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "addClinicAffiliations",
	},
];

const workingDayConfig = [
	{
		id: 0,
		label: "monday",
		startTimeId: "monday-start-time",
		stopTimeId: "monday-stop-time",
		startTimeName: "workingHours[0].startTime",
		stopTimeName: "workingHours[0].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 1,
		label: "tuesday",
		startTimeId: "tuesday-start-time",
		stopTimeId: "tuesday-stop-time",
		startTimeName: "workingHours[1].startTime",
		stopTimeName: "workingHours[1].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 2,
		label: "wednesday",
		startTimeId: "wednesday-start-time",
		stopTimeId: "wednesday-stop-time",
		startTimeName: "workingHours[2].startTime",
		stopTimeName: "workingHours[2].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 3,
		label: "thursday",
		startTimeId: "thursday-start-time",
		stopTimeId: "thursday-stop-time",
		startTimeName: "workingHours[3].startTime",
		stopTimeName: "workingHours[3].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 4,
		label: "friday",
		startTimeId: "friday-start-time",
		stopTimeId: "friday-stop-time",
		startTimeName: "workingHours[4].startTime",
		stopTimeName: "workingHours[4].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 5,
		label: "saturday",
		startTimeId: "saturday-start-time",
		stopTimeId: "saturday-stop-time",
		startTimeName: "workingHours[5].startTime",
		stopTimeName: "workingHours[5].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
	{
		id: 6,
		label: "sunday",
		startTimeId: "sunday-start-time",
		stopTimeId: "sunday-stop-time",
		startTimeName: "workingHours[6].startTime",
		stopTimeName: "workingHours[6].stopTime",
		startTimeLabel: "from",
		stopTimeLabel: "to",
	},
];

const AddClinicAffiliations = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const params = useParams();
	const { t } = useTranslation(["clinics"]);
	const { singleClinicData } = useAppSelector(state => state.clinics);

	useEffect(() => {
		if (params.clinicId) {
			dispatch(getSingleClinic(params.clinicId));
		}
	}, [dispatch, params.clinicId, params]);
	const addClinicAffiliationValidation = Yup.object({
		clinicId: Yup.string().required(),
		clinicName: Yup.string().required(),
		workingHours: Yup.array().of(
			Yup.object().shape({
				weekDay: Yup.string().required(),
				startTime: Yup.string()
					.test("isSameOrAfter", "Incorrect hours", (value, context) => {
						const {
							parent: { weekDay, stopTime },
						} = context;
						const findObj = singleClinicData?.workingTime.find(obj => obj.weekDay === weekDay);
						if (value || stopTime) {
							if (
								moment(value, "hh:mm").isSameOrAfter(moment(findObj?.startTime, "hh:mm")) &&
								moment(value, "hh:mm").isSameOrBefore(moment(findObj?.stopTime, "hh:mm"))
							) {
								return true;
							}
							return false;
						}

						return true;
					})
					.nullable()
					.notRequired(),
				stopTime: Yup.string()
					.test("isSameOrBefore", "Incorrect hours", (value, context) => {
						const {
							parent: { weekDay, startTime },
						} = context;
						const findObj = singleClinicData?.workingTime.find(obj => obj.weekDay === weekDay);
						if (value || startTime) {
							if (
								moment(value, "hh:mm").isSameOrBefore(moment(findObj?.stopTime, "hh:mm")) &&
								moment(value, "hh:mm").isSameOrAfter(moment(startTime, "hh:mm")) &&
								moment(value, "hh:mm").isSameOrAfter(moment(findObj?.startTime, "hh:mm"))
							) {
								return true;
							} else {
								return false;
							}
						}
						return true;
					})
					.nullable()
					.notRequired(),
			})
		),
		available: Yup.boolean(),
		reasonOfAbsence: Yup.string().when("available", {
			is: false,
			then: Yup.string().required(),
			otherwise: Yup.string().nullable(),
		}),
		absenceTime: Yup.object({}).when("available", {
			is: false,
			then: Yup.object({
				from: Yup.date().required(),
				to: Yup.date().required().min(Yup.ref("from")),
			}),
			otherwise: Yup.object({
				from: Yup.date().notRequired(),
				to: Yup.date().notRequired(),
			}),
		}),
		consultationFee: Yup.number().required(),
		timePerPatient: Yup.string().required(),
	});
	const addClinicAffiliationFormik = useFormik({
		initialValues: {
			clinicId: singleClinicData?._id || "",
			clinicName: singleClinicData?.clinicName || "",
			workingHours: [
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
			available: true,
			absenceTime: {
				from: "",
				to: "",
			},
			reasonOfAbsence: "",
			consultationFee: 100,
			timePerPatient: 30,
		},
		validationSchema: addClinicAffiliationValidation,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			console.log(values);

			dispatch(createClinicAffiliations(values));
		},
	});

	const optionsList = [
		{ id: 0, value: 15, label: "15 min" },
		{ id: 1, value: 30, label: "30 min" },
		{ id: 2, value: 45, label: "45 min" },
		{ id: 3, value: 60, label: "1 godz" },
		{ id: 4, value: 75, label: "1 godz 15 min" },
		{ id: 5, value: 90, label: "1 godz 30 min" },
		{ id: 6, value: 105, label: "1 godz 45 min" },
		{ id: 7, value: 120, label: "2 godz" },
	];
	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform="capitalize" marginBottom={2}>
				Add Clinic Affiliation
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
				<Box width={"100%"}>
					<FormikProvider value={addClinicAffiliationFormik}>
						<form onSubmit={addClinicAffiliationFormik.handleSubmit}>
							<Grid container columnSpacing={2} rowSpacing={1.5} width="100%">
								<Grid item>
									<Typography component="h2" variant="h5">
										{singleClinicData?.clinicName} working hours:
									</Typography>
									{singleClinicData ? (
										<List>
											{singleClinicData.workingTime.map(day => {
												return (
													<ListItem key={day.weekDay} sx={{ boxShadow: theme.shadows[1] }}>
														<ListItemText primary={`Day: ${day.weekDay} From: ${day.startTime} To: ${day.stopTime}`} />
													</ListItem>
												);
											})}
										</List>
									) : null}
								</Grid>
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
								<Grid item>
									<SwitchFormik id="available" label="available" name="available" />
								</Grid>
								{!addClinicAffiliationFormik.values.available ? (
									<>
										<Grid item xs={12} sm={12} md={12}>
											<TextFieldFormik id="reasonOfAbsence" label="reason of absence" name="reasonOfAbsence" />
										</Grid>
										<Grid item xs={12} sm={12} md={12}>
											<Typography component="h3" variant="h6">
												Absence From
											</Typography>
											<DatePickerFormik
												id="absenceFrom"
												name="absenceTime.from"
												minDate={new Date()}
												dateFormat="dd/MM/yyyy"
											/>
											<Typography component="h3" variant="h6">
												Absence To
											</Typography>

											<DatePickerFormik
												id="absenceTo"
												name="absenceTime.to"
												minDate={new Date(addClinicAffiliationFormik.values.absenceTime.from)}
												dateFormat="dd/MM/yyyy"
											/>
										</Grid>
									</>
								) : null}
								<Grid item xs={12} sm={12} md={12}>
									<TextFieldFormik
										id="consultationFee"
										label="consultation fee (zł)"
										name="consultationFee"
										type="number"
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<SelectFormik
										name="timePerPatient"
										optionsList={optionsList}
										label="timePerPatient"
										id="timePerPatient"
									/>
								</Grid>
							</Grid>
							{/* @ts-ignore */}
							<Button type="submit" isSubmitting={addClinicAffiliationFormik.isSubmitting}>
								{t("common:form.submitButton")}
							</Button>
						</form>
					</FormikProvider>
				</Box>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default AddClinicAffiliations;
