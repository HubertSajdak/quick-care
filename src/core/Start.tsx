import CancelIcon from "@mui/icons-material/Cancel";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Grid, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import ColumnChart from "components/ColumnChart/ColumnChart";
import { appointmentsActions, getUserAppointments } from "features/appointments/appointmentsSlice";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import moment from "moment";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { mapMonthsToNumbers } from "utils/date/date";
import { capitalizeFirstLetter } from "utils/strings/string";
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

	const columnChartOptions = {
		chart: {
			type: "bar",
			height: 430,
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: "50%",
				borderRadius: 4,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 8,
			colors: ["transparent"],
		},
		xaxis: {
			categories: [
				capitalizeFirstLetter(t("months.january")),
				capitalizeFirstLetter(t("months.february")),
				capitalizeFirstLetter(t("months.march")),
				capitalizeFirstLetter(t("months.april")),
				capitalizeFirstLetter(t("months.may")),
				capitalizeFirstLetter(t("months.june")),
				capitalizeFirstLetter(t("months.july")),
				capitalizeFirstLetter(t("months.august")),
				capitalizeFirstLetter(t("months.september")),
				capitalizeFirstLetter(t("months.october")),
				capitalizeFirstLetter(t("months.november")),
				capitalizeFirstLetter(t("months.december")),
			],
		},

		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter(val: number) {
					return `${val} visits`;
				},
			},
		},

		legend: {
			show: true,
			fontFamily: `'Public Sans', sans-serif`,
			offsetX: 10,
			offsetY: 10,
			position: "top",
			horizontalAlign: "right",
			labels: {
				useSeriesColors: false,
			},
			markers: {
				width: 16,
				height: 16,
				radius: "50%",
				offsexX: 2,
				offsexY: 2,
			},
			itemMargin: {
				horizontal: 15,
				vertical: 50,
			},
		},
		responsive: [
			{
				breakpoint: 600,
				options: {
					yaxis: {
						show: false,
					},
				},
			},
		],
	};
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
			{/* <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-around"> */}
			<Grid container xs={12} rowSpacing={4.5} columnSpacing={2.75}>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					<InfoCard
						title={capitalizeFirstLetter(t("translation:infoCards.allVisits"))}
						number={calculatedMonthlyVisits?.length || 0}
						icon={<LocalHospitalIcon sx={{ color: "primary.main", fontSize: "60px" }} />}
						description={t("translation:infoCards.moreInfoLabel")}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					<InfoCard
						title={capitalizeFirstLetter(t("translation:infoCards.allVisits"))}
						number={calculatedMonthlyCanceledVisits?.length || 0}
						icon={<CancelIcon sx={{ color: "warning.light", fontSize: "60px" }} />}
						description={t("translation:infoCards.moreInfoLabel")}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					<InfoCard
						title={capitalizeFirstLetter(t("translation:infoCards.allVisits"))}
						number={calculatedMonthlyCompletedVisits?.length || 0}
						description={t("translation:infoCards.moreInfoLabel")}
						icon={<LibraryAddCheckIcon sx={{ color: "success.main", fontSize: "60px" }} />}
					/>
				</Grid>
			</Grid>
			<Grid container xs={12} rowSpacing={4.5} columnSpacing={2.75} marginTop={2}>
				<Grid item xs={12}>
					<Stack spacing={1.5} sx={{ backgroundColor: "white", boxShadow: theme.shadows[2], borderRadius: 2 }}>
						<ColumnChart
							series={[
								{
									name: t("translation:chart.allVisits"),
									data: calculateYearlyNumberOfVisits(),
									color: theme.palette.primary.main,
								},
								{
									name: t("translation:chart.canceledVisits"),
									data: calculateYearlyNumberOfCanceledVisits(),
									color: theme.palette.warning.main,
								},
								{
									name: t("translation:chart.completedVisits"),
									data: calculateYearlyNumberOfCompletedVisits(),
									color: theme.palette.success.main,
								},
							]}
							options={columnChartOptions}
							title={t("translation:chart.chartTitle")}
						/>
					</Stack>
				</Grid>
			</Grid>
		</DashboardLayoutWrapper>
	);
};

export default Welcome;
