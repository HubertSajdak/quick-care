import BusinessIcon from "@mui/icons-material/Business";
import CallIcon from "@mui/icons-material/Call";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Box, Card, CardContent, CardMedia, CardProps, Typography } from "@mui/material";
import React from "react";
import { ClinicResponse } from "types/api-types";
import { BASE_URL } from "utils/axios/axios";
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
						Address
					</Typography>
				</Box>
				<Typography variant="body2" color="text.secondary">
					Street: {address.street}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					City: {address.city}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Postal Code: {address.postalCode}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<CallIcon sx={{ color: "primary.main" }} />
					<Typography variant="h6" component="p" color="primary.main">
						Phone Number
					</Typography>
				</Box>
				<Typography variant="body2" color="text.secondary">
					{phoneNumber}
				</Typography>
				<Box display="flex" alignItems="center" gap={1}>
					<WatchLaterIcon sx={{ color: "primary.main" }} />

					<Typography variant="h6" component="p" color="primary.main">
						Working Time
					</Typography>
				</Box>
				{workingTime.map(day => {
					return (
						<Box display="flex" key={day.weekDay}>
							<Typography variant="subtitle2" color="text.secondary">
								{day.weekDay} {day.startTime} - {day.stopTime}
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
