import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AirIcon from "@mui/icons-material/Air";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import BugReportIcon from "@mui/icons-material/BugReport";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import FaceIcon from "@mui/icons-material/Face";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SpaIcon from "@mui/icons-material/Spa";
import WavesIcon from "@mui/icons-material/Waves";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
const specializationMappings = [
	{
		id: 0,
		specializationKey: "radiology",
		icon: <WavesIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 1,
		specializationKey: "allergology",
		icon: <SpaIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 2,
		specializationKey: "surgery",
		icon: <CarpenterIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 3,
		specializationKey: "dermatology",
		icon: <FaceRetouchingNaturalIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 4,
		specializationKey: "endocrinology",
		icon: <BloodtypeIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 5,
		specializationKey: "gynecology",
		icon: <FemaleIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 6,
		specializationKey: "dietetics",
		icon: <FastfoodIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 7,
		specializationKey: "gastroenterology",
		icon: <AccessibilityIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 8,
		specializationKey: "cardiology",
		icon: <FavoriteIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 9,
		specializationKey: "laryngology",
		icon: <RecordVoiceOverIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 10,
		specializationKey: "ophthalmology",
		icon: <RemoveRedEyeIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 11,
		specializationKey: "neurology",
		icon: <PsychologyIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 12,
		specializationKey: "oncology",
		icon: <BugReportIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 13,
		specializationKey: "orthopedics",
		icon: <AirlineSeatLegroomReducedIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 14,
		specializationKey: "pediatrics",
		icon: <FaceIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 15,
		specializationKey: "dentistry",
		icon: <AddReactionIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 16,
		specializationKey: "pulmonology",
		icon: <AirIcon fontSize="large" sx={{ color: "white" }} />,
	},
	{
		id: 17,
		specializationKey: "urology",
		icon: <MaleIcon fontSize="large" sx={{ color: "white" }} />,
	},
];

const SpecializationBadge = ({ specializationKey }: { specializationKey: string }) => {
	const { t } = useTranslation(["specializations"]);

	const findSpecializationMapping = specializationMappings.find(el => el.specializationKey === specializationKey);
	return (
		<StyledSpecializationBadge elevation={3}>
			<Box display="flex" justifyContent="center">
				{findSpecializationMapping?.icon}
			</Box>
			<Typography
				variant="body1"
				color="white"
				textAlign="center"
				sx={{ textTransform: "uppercase", fontWeight: "500" }}>
				{t(`specializations:specializationKey.${findSpecializationMapping?.specializationKey}`)}
			</Typography>
		</StyledSpecializationBadge>
	);
};

export default SpecializationBadge;

const StyledSpecializationBadge = styled(Paper)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	width: 100%;
  max-width:268px;
	height: 80px;
	margin: 16px 0;
	background: ${({ theme }) => theme.palette.primary.light};
`;
