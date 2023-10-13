import Switch, { SwitchProps } from "components/Switch/Switch";
import { useField } from "formik";
import React from "react";
export type SwitchFormikProps = {
	/**
	 * Add this prop if there is more than one "CheckboxFormik" component
	 */
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
	label: React.ReactNode;
} & Omit<SwitchProps, "id" | "checked" | "onChange" | "label" | "error">;
const SwitchFormik = ({ id = "switch-formik", name, label, ...SwitchFormikProps }: SwitchFormikProps) => {
	const [field, meta] = useField(name);
	return (
		<Switch
			id={id}
			name={name}
			checked={field.value}
			onChange={field.onChange}
			label={label}
			error={meta.error && meta.touched ? meta.error : undefined}
			{...SwitchFormikProps}
		/>
	);
};

export default SwitchFormik;
