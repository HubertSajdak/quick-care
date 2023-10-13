import { ButtonProps as MuiButtonProps, Modal as MuiModal } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "components/Button/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "styles/theme";
import { ModalContentWrapper } from "./Modal.styled";

export interface ModalProps {
	/**
	 * Modal's title.
	 */
	title: string;
	/**
	 * Modal's text.
	 */
	text: string;
	/**
	 * Renders button with text/icon inside that opens up modal.
	 */
	openModalBtnText: React.ReactNode;
	/**
	 * Change variant of modal's open button.
	 *
	 * @example
	 * "text" | "outlined" | "contained" | undefined
	 */
	openModalBtnVariant?: MuiButtonProps["variant"];
	/**
	 * Change color of modal's open button.
	 *
	 * @example
	 * "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "string"
	 */
	openModalBtnColor?: MuiButtonProps["color"];
	/**
	 * If true, open modal button will look like Material UI's Icon Button
	 */
	isOpenModalIconBtn?: boolean;
	/**
	 * Change variant of modal's accept button.
	 *
	 * @example
	 * "text" | "outlined" | "contained" | undefined
	 */
	acceptBtnVariant?: MuiButtonProps["variant"];
	/**
	 * Change color of modal's open button.
	 *
	 * @example
	 * "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "string"
	 */
	acceptBtnColor?: MuiButtonProps["color"];
	/**
	 * Change variant of modal's reject button.
	 *
	 * @example
	 * "text" | "outlined" | "contained" | undefined
	 */
	rejectBtnVariant?: MuiButtonProps["variant"];
	/**
	 * Change color of modal's open button.
	 *
	 * @example
	 * "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "string"
	 */
	rejectBtnColor?: MuiButtonProps["color"];
	/**
	 * Make open button take full container's width.
	 */
	openModalBtnFullWidth?: boolean;
	/**
	 * Make open modal button disabled.
	 */
	disableOpenModalBtn?: boolean;
	/**
	 * Pass a function that accept button will trigger.
	 */
	onAsyncClick?: (() => Promise<void>) | ((e?: React.FormEvent<HTMLFormElement> | undefined) => void);
	isSubmitting?: boolean;
}

const Modal = ({
	title,
	text,
	onAsyncClick,
	openModalBtnText,
	openModalBtnVariant,
	openModalBtnColor = "primary",
	isOpenModalIconBtn = false,
	acceptBtnVariant,
	acceptBtnColor = "primary",
	rejectBtnVariant,
	rejectBtnColor = "primary",
	openModalBtnFullWidth = false,
	disableOpenModalBtn = false,
	isSubmitting,
}: ModalProps) => {
	const { t } = useTranslation("buttons");
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const asyncFunction = async () => {
		if (onAsyncClick) {
			await onAsyncClick();
		}
		handleClose();
	};

	return (
		<div>
			<Button
				onClick={handleOpen}
				disabled={disableOpenModalBtn}
				color={openModalBtnColor}
				variant={openModalBtnVariant}
				fullWidth={openModalBtnFullWidth}
				// sx={isOpenModalIconBtn === true ? { minWidth: 0, borderRadius: "50%" } : null}>
				sx={{
					...(isOpenModalIconBtn && { minWidth: 0, borderRadius: "50%" }),
					...(disableOpenModalBtn && { color: theme.palette.grey[400] }),
				}}>
				{openModalBtnText}
			</Button>
			<MuiModal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<ModalContentWrapper>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						{title}
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						{text}
					</Typography>
					<div
						className="options"
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "space-evenly",
							marginTop: "1rem",
						}}>
						<Button
							onAsyncClick={asyncFunction}
							isSubmitting={isSubmitting}
							color={acceptBtnColor}
							variant={acceptBtnVariant}>
							{t("buttons:submit")}
						</Button>
						<Button onClick={handleClose} color={rejectBtnColor} variant={rejectBtnVariant}>
							{t("buttons:cancel")}
						</Button>
					</div>
				</ModalContentWrapper>
			</MuiModal>
		</div>
	);
};

export default Modal;
