import { Box, Grid, Typography } from "@mui/material";
import Button from "components/Button/Button";
import CheckboxFormik from "components/CheckboxFormik/CheckboxFormik";
import PasswordFieldFormik from "components/PasswordFieldFormik/PasswordFieldFormik";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import pdf from "documents/Terms.pdf";
import { FormikProvider } from "formik";
import RegisterImg from "images/register.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DoctorRegisterProps } from "./DoctorRegister";

const PatientRegister = <T,>({ formikHookName }: DoctorRegisterProps<T>) => {
	const { t } = useTranslation(["common", "registerPage"]);
	const label = (
		<Typography>
			{t("common:form.iAgreeOn")}{" "}
			<a href={pdf} target="_blank" rel="noreferrer" style={{ color: "royalblue" }}>
				{t("common:form.terms")}
			</a>{" "}
			{t("common:form.conditions")}
		</Typography>
	);
	return (
		<Box display={"flex"}>
			<Box minWidth={350} maxWidth={350} padding={2} display={{ xs: "none", md: "block" }}>
				<img width={"100%"} height={"100%"} src={RegisterImg} alt="a woman holding a form illustration" />
			</Box>
			<Box padding={2}>
				<Typography marginY={2} textAlign="center" component="h1" variant="h4" textTransform="capitalize">
					{t("registerPage:header")}
				</Typography>
				<FormikProvider value={formikHookName}>
					<form onSubmit={formikHookName.handleSubmit} style={{ maxWidth: "520px" }}>
						<Grid container columnSpacing={2} rowSpacing={2.5}>
							<Grid item xs={12} sm={12} md={6} minHeight="100px">
								<TextFieldFormik id="name" label={t("common:form.name")} name="name" />
							</Grid>
							<Grid item xs={12} sm={12} md={6} minHeight="100px">
								<TextFieldFormik id="surname" label={t("common:form.surname")} name="surname" />
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<TextFieldFormik
									id="email"
									label={t("common:form.email")}
									name="email"
									helperText={t("common:form.emailHelperText")}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<TextFieldFormik
									id="phoneNumber"
									label={t("common:form.phoneNumber")}
									name="phoneNumber"
									type="tel"
									helperText={t("common:form.phoneNumberHelperText")}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<PasswordFieldFormik
									id="password"
									label={t("common:form.password")}
									name="password"
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<PasswordFieldFormik
									id="confirm-password"
									label={t("common:form.confirmPassword")}
									name="confirmPassword"
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<TextFieldFormik
									id="street"
									label={t("common:form.street")}
									name="address.street"
									helperText={t("common:form.streetHelperText")}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<TextFieldFormik
									id="city"
									label={t("common:form.city")}
									name="address.city"
									helperText={t("common:form.cityHelperText")}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<TextFieldFormik
									id="postalCode"
									label={t("common:form.postalCode")}
									name="address.postalCode"
									helperText={t("common:form.postalCodeHelperText")}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={12} minHeight="100px">
								<CheckboxFormik name="termsAndConditions" label={label} />
							</Grid>
						</Grid>
						<Button type="submit" isSubmitting={formikHookName.isSubmitting} sx={{ marginY: "1rem" }}>
							{t("buttons:submit")}
						</Button>
					</form>
				</FormikProvider>
				<Typography marginY="0.5rem">
					{t("registerPage:accountInfo")}?
					<Link
						to="/login"
						style={{
							marginLeft: "0.5rem",
							color: "royalblue",
						}}>
						{t("registerPage:loginButton")}
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default PatientRegister;
