import {
	FormGroup,
	FormControlLabel,
	Switch as MuiSwitch,
	SwitchProps as MuiSwitchProps,
	FormControlLabelProps as MuiFormControlLabelProps,
	FormHelperText,
} from "@mui/material";
import React from "react";

export type SwitchTypesCombined = Omit<MuiSwitchProps, "id" | "checked" | "onChange" | "error"> &
	Omit<MuiFormControlLabelProps, "control" | "checked" | "onChange" | "label" | "disabled">;

export interface SwitchProps extends SwitchTypesCombined {
	/**
	 * Add this prop if there is more than one "switch" component.
	 */
	id?: string;
	label: React.ReactNode;
	/**
	 * Pass a boolean value (f.e. from useState) to determine if checkbox component is checked.
	 */
	checked: boolean;
	/**
	 * Pass the function that will change the checked state.
	 */
	onChange: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void;
	/**
	 * Allows user to make a helper text.
	 */
	helperText?: string;
	/**
	 * Use "error" prop to make error text appear.
	 *
	 * "SwitchFormik" adds and handles this prop automatically.
	 */
	error?: string;
}
const Switch = ({ id = "switch", label, checked, onChange, helperText, error, ...SwitchProps }: SwitchProps) => {
	return (
		<>
			<FormControlLabel
				id={id}
				onChange={onChange}
				control={<MuiSwitch id={id} checked={checked} {...SwitchProps} />}
				label={label}
			/>
			{(helperText || error) && (
				<FormHelperText
					sx={{
						textTransform: "capitalize",
						color: error ? "error.main" : "text.primary",
						margin: "3px 14px 0",
					}}>
					{error ? error : helperText}
				</FormHelperText>
			)}
		</>
	);
};

export default Switch;
