import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useYupTranslation } from "common/useYupTranslation";
import { useFormik } from "formik";
import { ReactComponent as Logo } from "images/logo.svg";
import BasePageLayout from "layouts/BasePageLayout/BasePageLayout";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { decodeToken } from "react-jwt";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getRefreshTokenFromLocalStorage, getTokenFromLocalStorage } from "utils/localStorage/localStorage";
import * as Yup from "yup";

import useDocumentTitle from "common/useDocumentTitle";
import Tabs from "components/Tabs/Tabs";
import { DecodedToken } from "routes/PrivateRoute";
import { ValidationRegex } from "utils/regex/regex";
import { authActions, registerDoctor, registerPatient } from "../authSlice";
import DoctorRegister from "../components/DoctorRegister";
import PatientRegister from "../components/PatientRegister";
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

	const registerPatientValidation = Yup.object({
		name: Yup.string().matches(ValidationRegex.NAME, t("common:form.invalidName")).required().min(2),
		surname: Yup.string().matches(ValidationRegex.SURNAME, t("common:form.invalidSurname")).required().min(2),
		email: Yup.string().email().required(),
		phoneNumber: Yup.string().matches(ValidationRegex.PHONE_NUMBER, t("common:form.phoneNumberError")).required(),
		password: Yup.string().matches(ValidationRegex.PASSWORD, t("common:form.invalidPassword")).required().min(8),
		confirmPassword: Yup.string()
			.required()
			.matches(ValidationRegex.PASSWORD, t("common:form.invalidPassword"))
			.oneOf([Yup.ref("password"), null]),
		address: Yup.object({
			street: Yup.string().required(),
			city: Yup.string().required(),
			postalCode: Yup.string()
				.matches(ValidationRegex.POSTAL_CODE, t("common:form.invalidPostalCode"))
				.required()
				.max(6),
		}),
		termsAndConditions: Yup.boolean().oneOf([true], t("common:form.termsAndConditionsError")),
	});
	const registerDoctorValidation = Yup.object({
		name: Yup.string()
			.matches(ValidationRegex.NAME, t("common:form.invalidName"))
			.required()
			.min(2),
		surname: Yup.string()
			.matches(ValidationRegex.SURNAME, t("common:form.invalidSurname"))
			.required()
			.min(2),
		email: Yup.string().email().required(),
		password: Yup.string()
			.matches(ValidationRegex.PASSWORD, t("common:form.invalidPassword"))
			.required()
			.min(8),
		confirmPassword: Yup.string()
			.required()
			.matches(ValidationRegex.PASSWORD, t("common:form.invalidPassword"))
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
