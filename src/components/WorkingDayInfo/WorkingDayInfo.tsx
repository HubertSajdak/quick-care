import { Box, Typography } from "@mui/material";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import { useTranslation } from "react-i18next";

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
export default WorkingDayInfo;
