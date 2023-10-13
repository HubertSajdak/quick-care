import { CircularProgress } from "@mui/material";
import theme from "styles/theme";

const LoadingSpinner = () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				display: "grid",
				placeItems: "center",
				background: theme.palette.grey[100],
				zIndex: 1,
				opacity: 0.7,
			}}>
			<CircularProgress />
		</div>
	);
};

export default LoadingSpinner;
