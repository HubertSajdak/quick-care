import { Box, Card, CardContent, Typography } from "@mui/material";
const InfoCard = ({
	backgroundColor = "primary.main",
	title,
	number,
	cardNumber,
	icon,
}: {
	backgroundColor?: string;
	title: string;
	number: number;
	cardNumber: number;
	icon: React.ReactNode;
}) => {
	return (
		<Card sx={{ width: "280px", backgroundColor: backgroundColor }}>
			<CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
				<Typography sx={{ fontSize: 14 }} color="primary.contrastText" gutterBottom>
					{cardNumber}
				</Typography>
				<Typography variant="h5" component="div" color="primary.contrastText" gutterBottom textAlign="center">
					{title}
				</Typography>
				<Box display="flex" justifyContent="space-around" alignItems="center">
					{icon}
					<Typography variant="h2" textAlign="center" color="primary.contrastText" sx={{ fontWeight: "bold" }}>
						{number}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

export default InfoCard;
