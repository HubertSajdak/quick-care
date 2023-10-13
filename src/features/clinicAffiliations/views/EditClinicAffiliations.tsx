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
import { getCurrentUserClinicAffiliations, updateClinicAffiliations } from "../clinicAffiliationsSlice";

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

const EditClinicAffiliations = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const params = useParams();
	const { t } = useTranslation(["clinics"]);
	const { singleClinicData } = useAppSelector(state => state.clinics);
	const { data } = useAppSelector(state => state.clinicAffiliations);
	const findClinicAffiliation = data?.find(obj => obj.clinicId === params.clinicId);
	useEffect(() => {
		if (params.clinicId) {
			dispatch(getSingleClinic(params.clinicId));
			dispatch(getCurrentUserClinicAffiliations());
		}
	}, [dispatch, params.clinicId, params]);

	const editClinicAffiliationValidation = Yup.object({
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
	const editClinicAffiliationFormik = useFormik({
		initialValues: {
			_id: findClinicAffiliation?._id || "",
			clinicId: findClinicAffiliation?.clinicId || "",
			clinicName: findClinicAffiliation?.clinicName || "",
			workingHours: [
				{
					weekDay: "monday",
					startTime: findClinicAffiliation?.workingHours[0].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[0].stopTime || "",
				},
				{
					weekDay: "tuesday",
					startTime: findClinicAffiliation?.workingHours[1].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[1].stopTime || "",
				},
				{
					weekDay: "wednesday",
					startTime: findClinicAffiliation?.workingHours[2].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[2].stopTime || "",
				},
				{
					weekDay: "thursday",
					startTime: findClinicAffiliation?.workingHours[3].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[3].stopTime || "",
				},
				{
					weekDay: "friday",
					startTime: findClinicAffiliation?.workingHours[4].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[4].stopTime || "",
				},
				{
					weekDay: "saturday",
					startTime: findClinicAffiliation?.workingHours[5].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[5].stopTime || "",
				},
				{
					weekDay: "sunday",
					startTime: findClinicAffiliation?.workingHours[6].startTime || "",
					stopTime: findClinicAffiliation?.workingHours[6].stopTime || "",
				},
			],
			available: findClinicAffiliation?.available || true,
			absenceTime: {
				from: findClinicAffiliation?.absenceTime.from || "",
				to: findClinicAffiliation?.absenceTime.to || "",
			},
			reasonOfAbsence: findClinicAffiliation?.reasonOfAbsence || "",
			consultationFee: findClinicAffiliation?.consultationFee || "",
			timePerPatient: findClinicAffiliation?.timePerPatient || 30,
		},
		validationSchema: editClinicAffiliationValidation,
		enableReinitialize: true,
		onSubmit: async values => {
			await dispatch(updateClinicAffiliations({ ...values, consultationFee: +values.consultationFee }));
			dispatch(getCurrentUserClinicAffiliations());
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
				Edit Clinic Affiliation
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
					<FormikProvider value={editClinicAffiliationFormik}>
						<form onSubmit={editClinicAffiliationFormik.handleSubmit}>
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
								{!editClinicAffiliationFormik.values.available ? (
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
												minDate={new Date(editClinicAffiliationFormik.values.absenceTime.from)}
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
							<Button type="submit" isSubmitting={editClinicAffiliationFormik.isSubmitting}>
								{t("common:form.submitButton")}
							</Button>
						</form>
					</FormikProvider>
				</Box>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default EditClinicAffiliations;
