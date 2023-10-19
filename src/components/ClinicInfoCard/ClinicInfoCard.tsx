import BusinessIcon from "@mui/icons-material/Business";
import CallIcon from "@mui/icons-material/Call";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Box, Card, CardContent, CardMedia, CardProps, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ClinicResponse } from "types/api-types";
import { BASE_URL } from "utils/axios/axios";
import { capitalizeFirstLetter } from "utils/strings/string";
export interface ClinicInfoCardProps extends Omit<ClinicResponse, "_id">, CardProps {
	renderButton: React.ReactNode;
}
const ClinicInfoCard = ({
	clinicName,
	address,
	photo,
	phoneNumber,
	workingTime,
	renderButton,
	...CardProps
}: ClinicInfoCardProps) => {
	const { t } = useTranslation(["doctors", "clinics"]);
	return (
		<Card {...CardProps}>
			{photo ? (
				<CardMedia sx={{ height: 140 }} image={photo ? `${BASE_URL}${photo}` : undefined} title={clinicName} />
			) : null}
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" color="primary.main" fontWeight="500">
					{clinicName}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<BusinessIcon sx={{ color: "primary.main" }} />
					<Typography variant="h6" component="p" color="primary.main">
						{capitalizeFirstLetter(t("doctors:clinicInfoCard.address"))}
					</Typography>
				</Box>
				<Typography variant="body2" color="text.secondary">
					{capitalizeFirstLetter(t("doctors:clinicInfoCard.street"))}: {address.street}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{capitalizeFirstLetter(t("doctors:clinicInfoCard.city"))}: {address.city}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{capitalizeFirstLetter(t("doctors:clinicInfoCard.postalCode"))}: {address.postalCode}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<CallIcon sx={{ color: "primary.main" }} />
					<Typography variant="h6" component="p" color="primary.main">
						{capitalizeFirstLetter(t("doctors:clinicInfoCard.phoneNumber"))}
					</Typography>
				</Box>
				<Typography variant="body2" color="text.secondary">
					{phoneNumber}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<WatchLaterIcon sx={{ color: "primary.main" }} />

					<Typography variant="h6" component="p" color="primary.main">
						{capitalizeFirstLetter(t("doctors:clinicInfoCard.workingTime"))}
					</Typography>
				</Box>
				{workingTime.map(day => {
					return (
						<Box display="flex" key={day.weekDay}>
							<Typography variant="subtitle2" color="text.secondary">
								{capitalizeFirstLetter(t(`clinics:weekDay.${day.weekDay}`))} {day.startTime} - {day.stopTime}
							</Typography>
						</Box>
					);
				})}
			</CardContent>
			{renderButton ? renderButton : null}
		</Card>
	);
};

export default ClinicInfoCard;
