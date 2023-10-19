import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Calendar from "components/Calendar/Calendar";
import { getDoctorAppointments } from "features/appointments/appointmentsSlice";
import { getSingleDoctorClinicAffiliations } from "features/clinicAffiliations/clinicAffiliationsSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { AppointmentResponse } from "types/api-types";
import { BASE_URL } from "utils/axios/axios";
import { mapDayNamesToNumbers } from "utils/date/date";
import { capitalizeFirstLetter } from "utils/strings/string";
export interface DoctorInfoSectionProps {
	name: string;
	surname: string;
	email: string;
	photo: string;
}
const DoctorInfoSection = ({ name, surname, email, photo }: DoctorInfoSectionProps) => {
	const dispatch = useAppDispatch();
	const params = useParams();
	const { t } = useTranslation(["doctors"]);
	useEffect(() => {
		if (!params.doctorId) return;
		dispatch(getSingleDoctorClinicAffiliations(params.doctorId));
		dispatch(getDoctorAppointments(params.doctorId));
	}, [dispatch, params.doctorId]);

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const doctorClinicAffiliations = useAppSelector(state => state.clinicAffiliations.singleDoctorClinicAffiliations);
	const doctorAppointments = useAppSelector(state => state.appointments.doctorAppointments);
	const filterTime = (date: Date) => {
		const now = new Date();
		const allWorkingHours = doctorClinicAffiliations?.map(clinicAffiliation => clinicAffiliation.workingHours)?.flat(1);

		const findWorkingDay = allWorkingHours?.find(
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
	const isWeekday = (date: Date) => {
		const day = new Date(date).getDay();
		const allClinicAffiliations = doctorClinicAffiliations
			?.map(clinicAffiliation => clinicAffiliation.workingHours)
			?.flat(1);

		const disabledDays = allClinicAffiliations?.map(el => {
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
	const excludeTimesInDates = (date: AppointmentResponse[] | null) => {
		let excludedTimesArr: Date[] = [];
		if (date && selectedDate !== null) {
			date.forEach(item => {
				const selected = moment(selectedDate).format("DD-MMMM-YYYY");
				const appointmentDate = moment(item.appointmentDate).format("DD-MMMM-YYYY");

				if (moment(selected, "Do MMMM yyyy").isSame(moment(appointmentDate, "Do MMMM yyyy"))) {
					excludedTimesArr.push(new Date(item.appointmentDate));
				}
			});
		}
		if (excludedTimesArr.length) {
			return excludedTimesArr;
		}
		return undefined;
	};
	// const excludeDates = () => {
	// 	const allClinicAffiliations = doctorClinicAffiliations
	// 		?.map(clinicAffiliation => clinicAffiliation.workingHours)
	// 		?.flat(1);
	// 	const allDoctorAppointments = doctorAppointments;
	// 	const disabledDays = allDoctorAppointments?.map(appointment => {
	// 		const appointmentDay = moment(appointment.appointmentDate).format("dddd");
	// 		const findWorkingHours = allClinicAffiliations?.find(
	// 			affiliation => affiliation.weekDay === String(appointmentDay)
	// 		);
	// 	});
	// 	console.log(allClinicAffiliations);
	// 	console.log(allDoctorAppointments);
	// };
	return (
		<Box width="100%" display="flex" justifyContent="center" padding={3} alignItems="center" flexWrap="wrap" gap={10}>
			<Avatar
				alt={`${name} ${surname}`}
				src={photo ? `${BASE_URL}${photo}` : undefined}
				sx={{
					width: "200px",
					height: "200px",
					border: "3px solid royalblue",
					boxShadow: "0 4px 8px black",
				}}
			/>
			{
				// TODO: ADD LABELS
				// TODO: Disable days when no time is available
			}
			<Box display="grid" color="primary" gap={2}>
				<Box display="flex" alignItems="center" gap={2}>
					<BadgeIcon fontSize="large" sx={{ color: "primary.main" }} />
					<Typography color="primary.main" sx={{ fontWeight: "500", typography: { xs: "h6", sm: "h5", md: "h4" } }}>
						{name} {surname}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap={2}>
					<EmailIcon fontSize="large" sx={{ color: "primary.main" }} />
					<Typography color="primary.main" sx={{ fontWeight: "500", typography: { xs: "h6", sm: "h5", md: "h4" } }}>
						{email}
					</Typography>
				</Box>
				<Divider orientation="vertical" />
			</Box>
			<Box display="flex" flexDirection="column">
				<Typography textAlign="center" variant="body1" color="primary.light" sx={{ fontWeight: "bold" }}>
					{capitalizeFirstLetter(t("doctors:singleDoctorPage.doctorsAvailabilityLabel"))}
				</Typography>
				<Calendar
					filterTime={filterTime}
					filterDate={isWeekday}
					setSelectedDate={setSelectedDate}
					excludeTimes={excludeTimesInDates(doctorAppointments)}
					selectedDate={selectedDate}
				/>
			</Box>
		</Box>
	);
};

export default DoctorInfoSection;
