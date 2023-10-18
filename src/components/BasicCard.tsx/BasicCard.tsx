import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Card,
	CardActions,
	CardContent,
	CardProps,
	Typography,
} from "@mui/material";
import Button from "components/Button/Button";
import List, { ListProps } from "components/List/List";
import { Link } from "react-router-dom";
export interface BasicCardProps extends CardProps {
	title: string;
	titleIcon?: React.ReactNode;
	upperText: string;
	upperTextIcon?: React.ReactNode;
	lowerText: string;
	lowerTextIcon?: React.ReactNode;
	description?: React.ReactNode;
	descriptionIcon?: React.ReactNode;
	additionalText?: React.ReactNode;
	onClick?: () => void;
	buttonText?: string;
	isLink?: boolean;
	to?: string;
	listItemsArray?: ListProps["listItemsArray"];
	listItemsArrayTitle?: React.ReactNode;
}
const BasicCard = ({
	title,
	titleIcon,
	upperText,
	upperTextIcon,
	lowerText,
	lowerTextIcon,
	description,
	descriptionIcon,
	additionalText,
	onClick,
	buttonText,
	isLink = false,
	to,
	listItemsArray,
	listItemsArrayTitle,
	...CardProps
}: BasicCardProps) => {
	return (
		<Card {...CardProps} sx={{ cursor: "pointer", height: "100%" }}>
			<CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Box display="flex" flexDirection="column" alignItems="center" gap={1}>
					{upperTextIcon}
					<Typography sx={{ fontSize: 14 }} color="text.secondary">
						{upperText}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap={1} flexDirection="column">
					{titleIcon}
					<Typography variant="h5" component="div">
						{title}
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap={1} flexDirection="column" height="9-px">
					{lowerTextIcon}
					<Typography color="text.secondary">{lowerText}</Typography>
				</Box>
				<Box display="flex" alignItems="center" gap={1} flexDirection="column">
					{descriptionIcon}
					<Typography variant="body1">{description}</Typography>
				</Box>
				{listItemsArray ? (
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>{listItemsArrayTitle}</AccordionSummary>
						<AccordionDetails>
							<List listItemsArray={listItemsArray} />
						</AccordionDetails>
					</Accordion>
				) : null}
				{additionalText}
			</CardContent>
			{buttonText ? (
				<CardActions>
					{!isLink ? (
						<Button onClick={onClick}>{buttonText}</Button>
					) : (
						<>
							{/* @ts-ignore */}
							<Button component={Link} to={to}>
								{buttonText}
							</Button>
						</>
					)}
				</CardActions>
			) : null}
		</Card>
	);
};

export default BasicCard;
