import { useYupTranslation } from "../../../common/useYupTranslation";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Card, CardContent, FormControl, Grid, InputLabel, Select, Typography } from "@mui/material";
import * as Yup from "yup";
import { FieldArray, FormikProvider, useFormik } from "formik";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import { useEffect, useState } from "react";
import Button from "components/Button/Button";
import { FileInputProps } from "components/FileInput/FileInput";
import FileInputFormik from "components/FileInputFormik/FileInputFormik";
import { getSingleClinic, updateClinic, updateClinicPhoto } from "../clinicsSlice";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { useParams } from "react-router-dom";
import { BASE_URL } from "utils/axios/axios";

const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "editClinic",
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

const WorkingDayInfo = ({
	label,
	startTimeId,
	stopTimeId,
	startTimeName,
	stopTimeName,
	startTimeLabel,
	stopTimeLabel,
}: {
	label: string;
	startTimeId: string;
	stopTimeId: string;
	startTimeName: string;
	stopTimeName: string;
	startTimeLabel: string;
	stopTimeLabel: string;
}) => {
	const { t } = useTranslation(["clinics", "common"]);

	return (
		<Box width="100%" display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="16px">
			<Typography>{t(`clinics:weekDay.${label}`)}:</Typography>
			<TextFieldFormik
				fullWidth
				type="time"
				id={startTimeId}
				name={startTimeName}
				label={t(`common:form.${startTimeLabel}`)}
			/>
			<TextFieldFormik
				fullWidth
				type="time"
				id={stopTimeId}
				name={stopTimeName}
				label={t(`common:form.${stopTimeLabel}`)}
			/>
		</Box>
	);
};

const EditClinic = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const { t } = useTranslation(["clinics"]);
	const selectedClinicData = useAppSelector(state => state.clinics.singleClinicData);
	const PHONE_NUM_REGEX = /^[0-9\- ]{8,14}$/;
	const params = useParams();

	useEffect(() => {
		if (params.clinicId) {
			dispatch(getSingleClinic(params.clinicId));
		}
	}, [dispatch, params.clinicId, params]);

	const uploadClinicPhotoValidation = Yup.object({
		photo: Yup.array()
			.of(Yup.object())
			.min(1, `${t("common:fileInput.maxFilesError")} 1`)
			.required()
			.nullable(),
	});

	const editClinicValidation = Yup.object({
		clinicName: Yup.string().required(),
		address: Yup.object({
			street: Yup.string().required(),
			city: Yup.string().required(),
			postalCode: Yup.string().required(),
		}),
		phoneNumber: Yup.string().matches(PHONE_NUM_REGEX, t("common:form.phoneNumberError")).required(),
		workingTime: Yup.array().required(),
	});

	const uploadClinicPhotoFormik = useFormik({
		initialValues: {
			photo: [] as FileInputProps["value"],
		},
		onSubmit: async (values, { resetForm }) => {
			const formData = new FormData();
			values.photo.forEach(file => {
				formData.append("file", file.file);
			});
			await dispatch(updateClinicPhoto({ file: formData, id: selectedClinicData!._id }));
			resetForm();
		},
		validationSchema: uploadClinicPhotoValidation,
	});
	const editClinicFormik = useFormik({
		initialValues: {
			_id: selectedClinicData?._id || "",
			clinicName: selectedClinicData?.clinicName || "",
			address: {
				street: selectedClinicData?.address.street || "",
				city: selectedClinicData?.address.city || "",
				postalCode: selectedClinicData?.address.postalCode || "",
			},
			phoneNumber: selectedClinicData?.phoneNumber || "",
			workingTime: [
				{
					weekDay: "monday",
					startTime: selectedClinicData?.workingTime[0].startTime || "",
					stopTime: selectedClinicData?.workingTime[0].stopTime || "",
				},
				{
					weekDay: "tuesday",
					startTime: selectedClinicData?.workingTime[1].startTime || "",
					stopTime: selectedClinicData?.workingTime[1].stopTime || "",
				},
				{
					weekDay: "wednesday",
					startTime: selectedClinicData?.workingTime[2].startTime || "",
					stopTime: selectedClinicData?.workingTime[2].stopTime || "",
				},
				{
					weekDay: "thursday",
					startTime: selectedClinicData?.workingTime[3].startTime || "",
					stopTime: selectedClinicData?.workingTime[3].stopTime || "",
				},
				{
					weekDay: "friday",
					startTime: selectedClinicData?.workingTime[4].startTime || "",
					stopTime: selectedClinicData?.workingTime[4].stopTime || "",
				},
				{
					weekDay: "saturday",
					startTime: selectedClinicData?.workingTime[5].startTime || "",
					stopTime: selectedClinicData?.workingTime[5].stopTime || "",
				},
				{
					weekDay: "sunday",
					startTime: selectedClinicData?.workingTime[6].startTime || "",
					stopTime: selectedClinicData?.workingTime[6].stopTime || "",
				},
			],
		},
		validationSchema: editClinicValidation,
		enableReinitialize: true,
		onSubmit: values => {
			dispatch(updateClinic({ ...values, phoneNumber: +values.phoneNumber }));
		},
	});

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("clinics:editClinicLabel")}
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
						<Typography variant="h5" component="h2" p={"12px 0px"} display="block" width="100%">
							Clinic Photo
						</Typography>
						<Box m={2} sx={{ display: "grid", placeItems: "center" }}>
							<Avatar
								alt={`${selectedClinicData?.clinicName}`}
								src={selectedClinicData?.photo ? `${BASE_URL}${selectedClinicData.photo}` : undefined}
								sx={{
									width: "100px",
									height: "100px",
									border: "3px solid royalblue",
									boxShadow: "0 4px 8px black",
								}}
							/>
						</Box>
						<FormikProvider value={uploadClinicPhotoFormik}>
							<form onSubmit={uploadClinicPhotoFormik.handleSubmit}>
								<FileInputFormik
									id="avatar-input"
									name="photo"
									helperText={t("translation:accountManagementPage.uploadAvatarHelperText")}
									accept="image/*"
								/>
								{/* 
								{uploadUserPhotoFormik.values.photo.length !== 0 && ( */}
								<Button
									type="submit"
									isSubmitting={uploadClinicPhotoFormik.isSubmitting}
									startIcon={<FileUploadIcon />}
									sx={{ marginTop: "1rem" }}>
									{t("common:fileInput.sendFiles")}
								</Button>
								{/* )} */}
							</form>
						</FormikProvider>
						<FormikProvider value={editClinicFormik}>
							<form onSubmit={editClinicFormik.handleSubmit}>
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
									<Grid item xs={12} sm={12} md={12}></Grid>
								</Grid>
								<Button type="submit" isSubmitting={editClinicFormik.isSubmitting}>
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
export default EditClinic;
