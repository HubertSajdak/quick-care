import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "styled-components";
const InfoCard = ({
	backgroundColor = "common.white",
	title,
	number,
	description,
	icon,
}: {
	backgroundColor?: string;
	title: string;
	number: number;
	description: string;
	icon: React.ReactNode;
}) => {
	const theme = useTheme();
	return (
		<Card
			sx={{
				backgroundColor: backgroundColor,
				padding: "18px",
			}}>
			<Stack spacing={0.5}>
				<Typography variant="h6" color={theme.palette.grey[600]}>
					{title}
				</Typography>
				<Grid container alignItems="center" columnGap={2}>
					<Grid itemScope>
						<Box display="flex" justifyContent="space-around" alignItems="center">
							{icon}
						</Box>
					</Grid>
					<Grid item>
						<Typography variant="h3" textAlign="center" sx={{ fontWeight: "bold" }}>
							{number}
						</Typography>
					</Grid>
				</Grid>
				<Typography variant="subtitle2" color={theme.palette.grey[500]}>
					{description}
				</Typography>
			</Stack>
		</Card>
	);
};

export default InfoCard;
