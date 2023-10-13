import BasePageLayout from "layouts/BasePageLayout/BasePageLayout";
import { ReactComponent as Logo } from "images/logo.svg";
import { Box, Grid, Typography } from "@mui/material";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import PasswordFieldFormik from "components/PasswordFieldFormik/PasswordFieldFormik";
import { useFormik, FormikProvider } from "formik";
import RegisterImg from "images/register.svg";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useYupTranslation } from "common/useYupTranslation";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getRefreshTokenFromLocalStorage, getTokenFromLocalStorage } from "utils/localStorage/localStorage";
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

import useDocumentTitle from "common/useDocumentTitle";
import DoctorRegister from "../components/DoctorRegister";
import Tabs from "components/Tabs/Tabs";
import PatientRegister from "../components/PatientRegister";
import { authActions, registerDoctor, registerPatient } from "../authSlice";
import { DecodedToken } from "routes/PrivateRoute";
const Register = () => {
	useYupTranslation();
	const { t } = useTranslation(["common", "registerPage"]);
	const dispatch = useAppDispatch();
	useDocumentTitle(t("registerPage:header"));
	const { isRegistrationSuccessful } = useAppSelector(state => state.auth);
	const token = getTokenFromLocalStorage();
	const refreshToken = getRefreshTokenFromLocalStorage();
	const location = useLocation();
	const navigate = useNavigate();
	const currentTime = new Date().getTime();
	const decodedAccessToken = decodeToken<DecodedToken["accessToken"]>(token!);
	const decodedRefreshToken = decodeToken<DecodedToken["refreshToken"]>(refreshToken!);
	useEffect(() => {
		if (isRegistrationSuccessful) {
			navigate("/login");
			dispatch(authActions.resetRegistrationState());
		}
	}, [dispatch, isRegistrationSuccessful, navigate]);
	const PHONE_NUM_REGEX = /^[0-9\- ]{8,14}$/;

	const registerPatientValidation = Yup.object({
		name: Yup.string().required(),
		surname: Yup.string().required(),
		phoneNumber: Yup.string().matches(PHONE_NUM_REGEX, t("common:form.phoneNumberError")).required(),
		password: Yup.string().required().min(8),
		confirmPassword: Yup.string()
			.required()
			.oneOf([Yup.ref("password"), null]),
		address: Yup.object({
			street: Yup.string().required(),
			city: Yup.string().required(),
			postalCode: Yup.string().required(),
		}),
		termsAndConditions: Yup.boolean().oneOf([true], t("common:form.termsAndConditionsError")),
	});
	const registerDoctorValidation = Yup.object({
		name: Yup.string().min(2).required(),
		surname: Yup.string().min(2).required(),
		email: Yup.string().email().required(),
		password: Yup.string().required().min(8),
		confirmPassword: Yup.string()
			.required()
			.oneOf([Yup.ref("password"), null]),
		termsAndConditions: Yup.boolean().oneOf([true], t("common:form.termsAndConditionsError")),
	});

	const registerPatientFormik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			phoneNumber: "",
			email: "",
			password: "",
			confirmPassword: "",
			address: {
				street: "",
				city: "",
				postalCode: "",
			},
			termsAndConditions: false,
		},
		onSubmit: async values => {
			await dispatch(registerPatient({ ...values, phoneNumber: +values.phoneNumber }));
		},
		validationSchema: registerPatientValidation,
	});
	const registerDoctorFormik = useFormik({
		initialValues: {
			name: "",
			surname: "",
			email: "",
			password: "",
			confirmPassword: "",
			termsAndConditions: false,
		},
		onSubmit: async values => {
			await dispatch(registerDoctor(values));
		},
		validationSchema: registerDoctorValidation,
	});

	if (
		token &&
		decodedAccessToken &&
		currentTime / 1000 < decodedAccessToken.exp &&
		decodedRefreshToken &&
		currentTime / 1000 < decodedRefreshToken.exp
	) {
		return <Navigate to={`${location.state ? location.state : "/start"}`} />;
	}
	return (
		<BasePageLayout img={<Logo width={"100%"} />}>
			<Box
				boxShadow={3}
				maxWidth={800}
				marginY="0.5rem"
				sx={{
					display: "flex",
					flexDirection: "column",
					backgroundColor: "common.white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0px 0px",
				}}>
				<Tabs
					content={[
						{
							id: 0,
							label: t("common:form.asPatient"),
							render: <PatientRegister formikHookName={registerPatientFormik} />,
						},
						{
							id: 1,
							label: t("common:form.asDoctor"),
							render: <DoctorRegister formikHookName={registerDoctorFormik} />,
						},
					]}
				/>
			</Box>
		</BasePageLayout>
	);
};

export default Register;
