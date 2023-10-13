import AddLocationIcon from "@mui/icons-material/AddLocation";
import BusinessIcon from "@mui/icons-material/Business";
import CircleIcon from "@mui/icons-material/Circle";
import PaymentsIcon from "@mui/icons-material/Payments";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Box, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useYupTranslation } from "common/useYupTranslation";
import BasicCard from "components/BasicCard.tsx/BasicCard";
import DatePickerFormik from "components/DatePickerFormik/DatePickerFormik";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import {
	DoctorClinicAffiliationsResponse,
	getSingleDoctorClinicAffiliations,
} from "features/clinicAffiliations/clinicAffiliationsSlice";
import { getSingleDoctor } from "features/doctors/doctorsSlice";
import { FormikProvider, useFormik } from "formik";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import theme from "styles/theme";
import { AppointmentResponse } from "types/api-types";
import { mapDayNamesToNumbers } from "utils/date/date";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import * as Yup from "yup";
import { appointmentsActions, createAppointment, getDoctorAppointments } from "../appointmentsSlice";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "userClinicAffiliations",
	},
];
const AddAppointment = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const { t } = useTranslation(["common", "clinics"]);
	const doctorClinicAffiliations = useAppSelector(state => state.clinicAffiliations.singleDoctorClinicAffiliations);
	const isLoading = useAppSelector(state => state.clinicAffiliations.isLoading);
	const doctor = useAppSelector(state => state.doctors.singleDoctorData.data);
	const doctorAppointments = useAppSelector(state => state.appointments.doctorAppointments);
	const { isAppointmentCreated } = useAppSelector(state => state.appointments);
	const [selectedClinicAffiliation, setSelectedClinicAffiliation] = useState<DoctorClinicAffiliationsResponse | null>(
		null
	);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const selectClinicAffiliationHandler = (clinicAffiliation: DoctorClinicAffiliationsResponse) => {
		setSelectedClinicAffiliation(clinicAffiliation);
	};

	const isWeekday = (date: Date) => {
		const day = new Date(date).getDay();
		const disabledDays = selectedClinicAffiliation?.workingHours.map(el => {
			if (!el.startTime && !el.stopTime) {
				return mapDayNamesToNumbers(el.weekDay);
			}
			return null;
		});
		if (disabledDays) {
			return !disabledDays.includes(day);
		}
		return true;
	};

	const filterTime = (date: Date) => {
		const now = new Date();
		const findWorkingDay = selectedClinicAffiliation?.workingHours.find(
			el => el.weekDay === new Date(date).toLocaleDateString("en-GB", { weekday: "long" }).toLowerCase()
		);
		if (!findWorkingDay || !findWorkingDay.startTime || !findWorkingDay.stopTime) {
			return false;
		}
		const getHoursFromDate = moment(date).format("HH:mm");
		return (
			moment(getHoursFromDate, "HH:mm").isBetween(
				moment(findWorkingDay.startTime, "HH:mm"),
				moment(findWorkingDay.stopTime, "HH:mm")
			) && moment(date, "dd MMMM yyyy, HH:mm").isSameOrAfter(moment(now, "dd MMMM yyyy, HH:mm"))
		);
	};
	const excludeTimesInDates = (date: AppointmentResponse[] | null) => {
		let excludedTimesArr: Date[] = [];
		if (date && selectedDate !== null) {
			date.forEach(item => {
				const selected = moment(selectedDate).format("DD-MMMM-YYYY");
				const appointmentDate = moment(item.appointmentDate).format("DD-MMMM-YYYY");

				if (
					moment(selected, "Do MMMM yyyy").isSame(moment(appointmentDate, "Do MMMM yyyy")) &&
					item.appointmentStatus !== "canceled"
				) {
					excludedTimesArr.push(new Date(item.appointmentDate));
				}
			});
		}
		if (excludedTimesArr.length) {
			return excludedTimesArr;
		}
		return undefined;
	};
	useEffect(() => {
		if (!params.doctorId) return;
		dispatch(getSingleDoctor(params.doctorId));
		dispatch(getSingleDoctorClinicAffiliations(params.doctorId));
		dispatch(getDoctorAppointments(params.doctorId));
	}, [dispatch, params.doctorId]);

	const addAppointmentValidation = Yup.object({
		doctorId: Yup.string().required(),
		clinicId: Yup.string().required(),
		clinicAffiliationId: Yup.string().required(),
		consultationFee: Yup.string().required(),
		appointmentDate: Yup.string().required(),
		appointmentAddress: Yup.object({
			street: Yup.string().required(),
			city: Yup.string().required(),
			postalCode: Yup.string().required(),
		}),
		appointmentStatus: Yup.string().oneOf(["active", "canceled", "postponed", "completed"]).required(),
	});

	const addAppointmentFormik = useFormik<Omit<AppointmentResponse, "_id" | "patientId" | "doctorInfo" | "clinicInfo">>({
		initialValues: {
			doctorId: selectedClinicAffiliation?.doctorId || "",
			clinicId: selectedClinicAffiliation?.clinicId || "",
			clinicAffiliationId: selectedClinicAffiliation?._id || "",
			consultationFee: selectedClinicAffiliation?.consultationFee || "",
			appointmentDate: "",
			appointmentAddress:
				{
					street: selectedClinicAffiliation?.clinicInfo.address.street || "",
					city: selectedClinicAffiliation?.clinicInfo.address.city || "",
					postalCode: selectedClinicAffiliation?.clinicInfo.address.postalCode || "",
				} || null,
			appointmentStatus: "active",
		},
		validationSchema: addAppointmentValidation,
		enableReinitialize: true,
		onSubmit: async values => {
			await dispatch(
				createAppointment({
					...values,
					consultationFee: +values.consultationFee,
					appointmentDate: moment(values.appointmentDate).format("dddd DD MMMM YYYY HH:mm"),
				})
			);
		},
	});

	useEffect(() => {
		if (isAppointmentCreated) {
			dispatch(appointmentsActions.setCreatedAppointmentDetails({ selectedDate, selectedClinicAffiliation, doctor }));

			navigate("/appointmentCreated");
		}
	}, [dispatch, doctor, isAppointmentCreated, navigate, selectedClinicAffiliation, selectedDate]);
	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform="capitalize" marginBottom={2}>
				Make an appointment with doctor: {doctor?.name} {doctor?.surname}
			</Typography>
			<Box
				width="100%"
				boxShadow="3"
				maxWidth={"md"}
				padding="16px"
				position="relative"
				sx={{
					display: "flex",
					flexDirection: "column",
					backgroundColor: "white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0px 0px",
					margin: "0 auto",
				}}>
				{isLoading && <LoadingSpinner />}
				<Typography component="h2" variant="h5" textTransform="capitalize" marginBottom={2} textAlign="center">
					Select an office:
				</Typography>
				<Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
					{doctorClinicAffiliations &&
						doctorClinicAffiliations?.map(affiliation => {
							const listItemsArray = affiliation.workingHours.map(day => {
								return {
									id: day.weekDay,
									text: `${day.weekDay}: ${day.startTime} - ${day.stopTime}`,
								};
							});
							return (
								<Box
									key={affiliation._id}
									width={"350px"}
									onClick={() => selectClinicAffiliationHandler(affiliation)}
									sx={{
										border:
											selectedClinicAffiliation?._id === affiliation._id
												? `2px solid ${theme.palette.primary.main}`
												: 0,
										boxShadow:
											selectedClinicAffiliation?._id === affiliation._id
												? `${theme.shadows[5]}`
												: `${theme.shadows[2]}`,
									}}>
									<BasicCard
										title={`Clinic Name: ${affiliation.clinicName}`}
										upperText={`Available: ${affiliation.available}`}
										upperTextIcon={<CircleIcon color={affiliation.available === true ? "success" : "error"} />}
										lowerText={`Address: ${affiliation.clinicInfo.address.street}, ${affiliation.clinicInfo.address.city}, ${affiliation.clinicInfo.address.postalCode}`}
										titleIcon={<BusinessIcon color="info" />}
										lowerTextIcon={<AddLocationIcon color="info" />}
										listItemsArrayTitle={
											<Box display="flex" gap={2}>
												<WatchLaterIcon color="info" /> <Typography>Working hours:</Typography>{" "}
											</Box>
										}
										additionalText={
											<Box display="flex" alignItems="center" gap={1}>
												<PaymentsIcon color="success" />
												<Typography variant="body1" component="p" fontWeight="500">
													Consultation Fee: {affiliation.consultationFee} zł
												</Typography>
											</Box>
										}
										listItemsArray={listItemsArray}
									/>
								</Box>
							);
						})}
				</Box>
				<FormikProvider value={addAppointmentFormik}>
					<form onSubmit={addAppointmentFormik.handleSubmit}>
						{selectedClinicAffiliation ? (
							<>
								<Typography component="h2" variant="h5" textTransform="capitalize" textAlign="center" marginY={2}>
									Select a day:
								</Typography>
								<Box width="100%" display="flex" justifyContent="center" marginY={4}>
									<DatePickerFormik
										name={"appointmentDate"}
										dateFormat="dd MMMM yyyy, HH:mm"
										showTimeSelect
										timeFormat="HH:mm"
										setSelectedDate={setSelectedDate}
										timeIntervals={selectedClinicAffiliation.timePerPatient}
										filterDate={isWeekday}
										filterTime={filterTime}
										excludeTimes={excludeTimesInDates(doctorAppointments)}
										minDate={new Date()}
									/>
								</Box>
								{/* <Button type="submit" isSubmitting={addAppointmentFormik.isSubmitting} disabled={!selectedDate}>
									{t("form.submitButton")}
								</Button> */}
								<Modal
									title={`Confirm your appointment`}
									text={`Date: ${moment(selectedDate).format("Do MMMM yyyy, HH:mm")}
									Doctor: ${doctor?.name} ${doctor?.surname}`}
									openModalBtnText={t("form.submitButton")}
									onAsyncClick={addAppointmentFormik.handleSubmit}
									disableOpenModalBtn={!selectedDate}
									rejectBtnColor="error"
									openModalBtnFullWidth
								/>
							</>
						) : null}
					</form>
				</FormikProvider>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default AddAppointment;
