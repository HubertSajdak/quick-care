import { Box, FormHelperText } from "@mui/material";
import Button from "components/Button/Button";
import { de, enGB, pl } from "date-fns/locale";
import { useField } from "formik";
import React, { ForwardedRef } from "react";
import DatePicker, { ReactDatePickerProps, registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";
export interface DatePickerFormikProps extends Omit<ReactDatePickerProps, "onChange"> {
	name: string;
	helperText?: string;
	setSelectedDate?: (val: Date | null) => void;
}
const CustomDatePickerInput = React.forwardRef<HTMLButtonElement>(
	({ value, onClick }: any, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<Button onClick={onClick} ref={ref} size="large" >
				{value || "Select Date"}
			</Button>
		);
	}
);

const DatePickerFormik = ({
	id = "date-picker",
	name,
	helperText,
	setSelectedDate,
	...DatePickerFromikProps
}: DatePickerFormikProps) => {
	const [field, meta, { setValue }] = useField(name);
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
			<Box display="flex" flexDirection="column">
				<DatePicker
					selected={field.value}
					onChange={val => {
						setValue(val);
						setSelectedDate && setSelectedDate(val);
					}}
					dateFormat="dd.MM.yyyy"
					locale={locale}
					timeCaption={timerCaption}
					wrapperClassName="datePicker"
					customInput={<CustomDatePickerInput />}
					{...DatePickerFromikProps}
				/>
				{(helperText || meta.error) && (
					<FormHelperText
						sx={{
							textTransform: "capitalize",
							fontSize: "1rem",
							color: meta.error ? "error.main" : "text.primary",
						}}>
						{meta.error ? meta.error : helperText}
					</FormHelperText>
				)}
			</Box>
			<StyledDatePickerFormik />
		</>
	);
};
const StyledDatePickerFormik = createGlobalStyle`
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
export default DatePickerFormik;
