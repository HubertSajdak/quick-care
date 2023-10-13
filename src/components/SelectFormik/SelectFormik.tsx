import { Box, FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { useField } from "formik";

export type SelectValues = {
	id?: string;
	/**
   * Helps formik identify to which "useFormik" hook you refer to.
   *
   * Pass the same name as the name of a formik value you refer to.
   * 
   * @example 
   * 
   *   const updateUserInfoFormik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
    },
    onSubmit: (values) => {},
    validationSchema: updateUserValidation,
    *
    * <TextFieldFormik name="name" />
  });
   * 
   */
	name: string;

	optionsList: {
		id: number | string;
		value: number | string;
		label: string;
	}[];
	label: string;
	onAddButton?: React.ReactNode;
} & SelectProps;
const SelectFormik = ({ id = "select", name, label, optionsList, onAddButton, ...SelectProps }: SelectValues) => {
	const [field, meta] = useField(name);

	return (
		<Box display="flex" sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id={id}>{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id={id}
					value={field.value}
					label={label}
					name={name}
					onChange={field.onChange}
					onBlur={field.onBlur}
					error={meta.error && meta.touched ? true : false}
					{...SelectProps}>
					{optionsList.map(select => {
						return (
							<MenuItem key={select.id} value={select.value}>
								{select.label}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			{onAddButton ? onAddButton : null}
		</Box>
	);
};
export default SelectFormik;
