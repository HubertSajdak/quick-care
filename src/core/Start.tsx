import CancelIcon from "@mui/icons-material/Cancel";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import LineChart from "components/LineChart/LineChart";
import { appointmentsActions, getUserAppointments } from "features/appointments/appointmentsSlice";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { mapMonthsToNumbers } from "utils/date/date";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import InfoCard from "./components/InfoCard/InfoCard";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "start",
	},
];

const Welcome = () => {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { t } = useTranslation("translation");
	useDocumentTitle(t("start"));
	const { name, surname } = useAppSelector(state => state.user);
	const { userAppointments } = useAppSelector(state => state.appointments);
	useEffect(() => {
		dispatch(appointmentsActions.changeRowsPerPage(200));
		dispatch(getUserAppointments());
		dispatch(appointmentsActions.changeRowsPerPage(5));

	}, [dispatch]);

	const calculatedMonthlyVisits = userAppointments?.filter(appointment => {
		const day = new Date();
		const dayMoment = moment(day).format("MMMM yyyy");
		const date = moment(appointment.appointmentDate).format("MMMM yyyy");
		if (moment(date).isSame(moment(dayMoment))) {
			return appointment;
		}
	});
	const calculatedMonthlyCanceledVisits = userAppointments?.filter(appointment => {
		const day = new Date();
		const dayMoment = moment(day).format("MMMM yyyy");
		const date = moment(appointment.appointmentDate).format("MMMM yyyy");
		if (moment(date).isSame(moment(dayMoment)) && appointment.appointmentStatus === "canceled") {
			return appointment;
		}
	});
	const calculatedMonthlyCompletedVisits = userAppointments?.filter(appointment => {
		const day = new Date();
		const dayMoment = moment(day).format("MMMM yyyy");
		const date = moment(appointment.appointmentDate).format("MMMM yyyy");
		if (moment(date).isSame(moment(dayMoment)) && appointment.appointmentStatus === "completed") {
			return appointment;
		}
	});

	const calculateYearlyNumberOfVisits = () => {
		let visitsNum = 0;
		let visitsForEachMonth: any[] = [];
		while (visitsNum < 12) {
			const findAppointmentDate = userAppointments?.filter(
				appointment => mapMonthsToNumbers(appointment.appointmentDate.split(" ")?.[2]) === visitsNum
			);
			if (findAppointmentDate && findAppointmentDate.length > 0) {
				visitsForEachMonth.push(findAppointmentDate.length);
				visitsNum++;
			} else {
				visitsForEachMonth.push(0);
				visitsNum++;
			}
		}
		return visitsForEachMonth;
	};
	const calculateYearlyNumberOfCanceledVisits = () => {
		let visitsNum = 0;
		let visitsForEachMonth: any[] = [];
		while (visitsNum < 12) {
			const findAppointmentDate = userAppointments?.filter(
				appointment =>
					mapMonthsToNumbers(appointment.appointmentDate.split(" ")?.[2]) === visitsNum &&
					appointment.appointmentStatus === "canceled"
			);
			if (findAppointmentDate && findAppointmentDate.length > 0) {
				visitsForEachMonth.push(findAppointmentDate.length);
				visitsNum++;
			} else {
				visitsForEachMonth.push(0);
				visitsNum++;
			}
		}
		return visitsForEachMonth;
	};
	const calculateYearlyNumberOfCompletedVisits = () => {
		let visitsNum = 0;
		let visitsForEachMonth: any[] = [];
		while (visitsNum < 12) {
			const findAppointmentDate = userAppointments?.filter(
				appointment =>
					mapMonthsToNumbers(appointment.appointmentDate.split(" ")?.[2]) === visitsNum &&
					appointment.appointmentStatus === "completed"
			);
			if (findAppointmentDate && findAppointmentDate.length > 0) {
				visitsForEachMonth.push(findAppointmentDate.length);
				visitsNum++;
			} else {
				visitsForEachMonth.push(0);
				visitsNum++;
			}
		}
		return visitsForEachMonth;
	};
	const dataSets = [
		{
			label: "All visits",
			data: calculateYearlyNumberOfVisits(),
			borderColor: theme.palette.primary.main,
			backgroundColor: theme.palette.primary.main,
		},
		{
			label: "Canceled visits",
			data: calculateYearlyNumberOfCanceledVisits(),
			borderColor: theme.palette.error.main,
			backgroundColor: theme.palette.error.main,
		},
		{
			label: "Completed visits",
			data: calculateYearlyNumberOfCompletedVisits(),
			borderColor: theme.palette.success.main,
			backgroundColor: theme.palette.success.main,
		},
	];

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography
				component="h1"
				variant="h4"
				textAlign={"center"}
				width="100%"
				textTransform="capitalize"
				marginBottom={4}>
				{t(`welcomePage.welcome`)}
				{` ${name} ${surname}`}
			</Typography>
			<Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-around">
				<InfoCard
					title={"All visits this month"}
					number={calculatedMonthlyVisits?.length || 0}
					cardNumber={1}
					icon={<LocalHospitalIcon sx={{ color: "primary.contrastText", fontSize: "60px" }} />}
				/>
				<InfoCard
					title={"Canceled visits this month"}
					number={calculatedMonthlyCanceledVisits?.length || 0}
					cardNumber={2}
					backgroundColor="error.light"
					icon={<CancelIcon sx={{ color: "primary.contrastText", fontSize: "60px" }} />}
				/>
				<InfoCard
					title={"Completed visits this month"}
					number={calculatedMonthlyCompletedVisits?.length || 0}
					cardNumber={3}
					backgroundColor="success.light"
					icon={<LibraryAddCheckIcon sx={{ color: "primary.contrastText", fontSize: "60px" }} />}
				/>
			</Box>
			<Box display="flex" justifyContent="center" margin={4}>
				<LineChart dataSet={dataSets} />
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default Welcome;
