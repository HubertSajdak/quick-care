import { de, enGB, pl } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";
export interface CalendarProps {
	filterTime: (date: Date) => boolean;
	filterDate: (date: Date) => boolean;
	setSelectedDate: ((val: Date | null) => void) | undefined;
	excludeTimes: Date[] | undefined;
	selectedDate: Date | null;
}
const Calendar = ({ filterTime, filterDate, selectedDate, setSelectedDate, excludeTimes }: CalendarProps) => {
	const { i18n } = useTranslation();
	let locale;
	let timerCaption;
	if (i18n.language === "pl") {
		registerLocale("pl", pl);
		locale = "pl";
		timerCaption = "Godzina";
	}
	if (i18n.language === "de") {
		locale = "de";
		registerLocale("de", de);
		timerCaption = "Stunde";
	}
	if (i18n.language === "en") {
		locale = "enGB";
		registerLocale("enGB", enGB);
		timerCaption = "Time";
	}
	return (
		<>
			<DatePicker
				dateFormat="dd.MM.yyyy"
				selected={selectedDate}
				onChange={val => {
					setSelectedDate && setSelectedDate(val);
				}}
				open
				inline
				locale={locale}
				timeCaption={timerCaption}
				filterTime={filterTime}
				filterDate={filterDate}
				excludeTimes={excludeTimes}
				showTimeSelect
			/>
			<StyledCalendar />
		</>
	);
};

export default Calendar;
const StyledCalendar = createGlobalStyle`
	.react-datepicker__month-container {
		background: transparent;
	}
	.react-datepicker__day--selected{
		background-color: ${({ theme }) => theme.palette.primary.main};
	}
	.react-datepicker__day:hover{
		background-color:${({ theme }) => theme.palette.primary.light}
	}
	.react-datepicker__header{
		background-color:${({ theme }) => theme.palette.primary.main} ;
	}
	.react-datepicker__current-month,.react-datepicker__day-name{
color:${({ theme }) => theme.palette.primary.contrastText};
	}
	.react-datepicker-time__header{
color:${({ theme }) => theme.palette.primary.contrastText};

	}
	.react-datepicker__time-list-item--selected{
				background-color: ${({ theme }) => theme.palette.primary.main} !important;
				color:${({ theme }) => theme.palette.primary.contrastText};
	}
	.react-datepicker{
		box-shadow: ${({ theme }) => theme.shadows[10]};
	}
`;
