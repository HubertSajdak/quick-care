import { CircularProgress, Button as MuiButton } from "@mui/material";
import { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { useState } from "react";
export interface ButtonProps extends MuiButtonProps {
	onAsyncClick?: () => Promise<void>;
	isSubmitting?: boolean;
}

const Button = ({ children, onAsyncClick, onClick, isSubmitting, ...ButtonProps }: ButtonProps) => {
	const [isWaiting, setIsWaiting] = useState(false);
	const AsyncFunction: ButtonProps["onClick"] = async e => {
		setIsWaiting(true);
		onClick && onClick(e);
		try {
			await onAsyncClick!();
			setIsWaiting(false);
		} catch (error) {
			setIsWaiting(false);
		}
	};
	const isLoading = isSubmitting || isWaiting;
	return (
		<MuiButton variant="contained" disabled={isLoading} onClick={AsyncFunction} {...ButtonProps}>
			{isLoading && <CircularProgress sx={{ position: "absolute" }} size={25} />}
			{children}
		</MuiButton>
	);
};

export default Button;
