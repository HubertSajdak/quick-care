import FileUploadIcon from "@mui/icons-material/FileUpload";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Avatar, Box, Card, CardContent, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useYupTranslation } from "common/useYupTranslation";
import Button from "components/Button/Button";
import FileInputFormik from "components/FileInputFormik/FileInputFormik";
import PasswordFieldFormik from "components/PasswordFieldFormik/PasswordFieldFormik";
import TextFieldFormik from "components/TextFieldFormik/TextFieldFormik";
import { FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import { FileInputProps } from "components/FileInput/FileInput";
import Modal from "components/Modal/Modal";
import { logoutUser } from "features/auth/authSlice";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { DecodedToken } from "routes/PrivateRoute";
import { BASE_URL } from "utils/axios/axios";
import { getTokenFromLocalStorage } from "utils/localStorage/localStorage";
import { ValidationRegex } from "utils/regex/regex";
import { updateUserData, updateUserPassword, updateUserPhoto } from "../userSlice";

const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "accountManagement",
	},
];

const AccountManagement = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation(["translation", "common", "buttons", "modal"]);
	const accessToken = getTokenFromLocalStorage();
	const decodedAccessToken = decodeToken<DecodedToken["accessToken"]>(accessToken);
	useDocumentTitle(t("translation:accountManagementPage.heading"));

	const user = useAppSelector(state => state.user);

	const deleteUserAndRedirect = async () => {
		// await deleteAccount();
		await logoutUser();
		navigate("/login");
	};

	const uploadUserPhotoValidation = Yup.object({
		photo: Yup.array()
			.of(Yup.object())
			.min(1, `${t("common:fileInput.maxFilesError")} 1`)
			.required()
			.nullable(),
	});

	const updateUserValidation = Yup.object({
		name: Yup.string().required().min(2),
		surname: Yup.string().required().min(2),
		email: Yup.string().email().required(),
		phoneNumber:
			user.role !== "doctor"
				? Yup.string().matches(ValidationRegex.PHONE_NUMBER, t("common:form.phoneNumberError")).required()
				: Yup.string().nullable(),
		address:
			user.role !== "doctor"
				? Yup.object({
						street: Yup.string().required(),
						city: Yup.string().required(),
						postalCode: Yup.string()
							.matches(ValidationRegex.POSTAL_CODE, t("common:form.invalidPostalCode"))
							.required()
							.max(6),
				  })
				: Yup.object({}).nullable(),
	});

	const changePasswordValidation = Yup.object({
		password: Yup.string().matches(ValidationRegex.PHONE_NUMBER, t("common:form.phoneNumberError")).required(),
		confirmPassword: Yup.string()
			.required()
			.matches(ValidationRegex.PASSWORD, t("common:form.invalidPassword"))
			.oneOf([Yup.ref("password"), null]),
	});

	const uploadUserPhotoFormik = useFormik({
		initialValues: {
			photo: [] as FileInputProps["value"],
		},
		onSubmit: async (values, { resetForm }) => {
			const formData = new FormData();
			values.photo.forEach(file => {
				formData.append("file", file.file);
			});
			await dispatch(updateUserPhoto(formData));
			resetForm();
		},
		validationSchema: uploadUserPhotoValidation,
	});

	const updateUserInfoFormik = useFormik({
		initialValues: {
			name: user.name || "",
			surname: user.surname || "",
			email: user.email || "",
			phoneNumber: user.phoneNumber || "",
			address: {
				street: user.address?.street || "",
				city: user.address?.city || "",
				postalCode: user.address?.postalCode || "",
			},
		},
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			dispatch(updateUserData(values));
			resetForm();
		},
		validationSchema: updateUserValidation,
	});
	const changePasswordFormik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		onSubmit: (values, { resetForm }) => {
			updateUserPassword({ ...values });
			resetForm();
		},
		validationSchema: changePasswordValidation,
	});

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("translation:accountManagementPage.heading")}
			</Typography>
			<Box
				width="100%"
				boxShadow="3"
				maxWidth={"md"}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					backgroundColor: "white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0px 0px",
					margin: "0 auto",
				}}>
				<Box m={2} sx={{ display: "grid", placeItems: "center" }}>
					<Avatar
						alt={`${user.name} ${user.surname}`}
						src={user.photo ? `${BASE_URL}${user.photo}` : undefined}
						sx={{
							width: "100px",
							height: "100px",
							border: "3px solid royalblue",
							boxShadow: "0 4px 8px black",
						}}
					/>
					<Typography variant="h4" mt={2}>{`${user.name} ${user.surname}`}</Typography>
					{/* <Button
						startIcon={<DeleteIcon />}
						sx={{ marginTop: "0.5rem", backgroundColor: "action.active" }}
						onClick={() => dispatch(deleteUserAvatar())}>
						{t("buttons:remove")}
					</Button> */}
				</Box>
				<Card sx={{ width: "100%" }}>
					<CardContent
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
						}}>
						<Typography component="h2" variant="h5" textAlign={"left"} sx={{ textTransform: "capitalize" }}>
							{t("translation:accountManagementPage.changeAvatar")}
						</Typography>
						<FormikProvider value={uploadUserPhotoFormik}>
							<form onSubmit={uploadUserPhotoFormik.handleSubmit}>
								<FileInputFormik
									id="avatar-input"
									name="photo"
									helperText={t("translation:accountManagementPage.uploadAvatarHelperText")}
									accept="image/*"
								/>
								{/* 
								{uploadUserPhotoFormik.values.photo.length !== 0 && ( */}
								<Button
									type="submit"
									isSubmitting={uploadUserPhotoFormik.isSubmitting}
									startIcon={<FileUploadIcon />}
									sx={{ marginTop: "1rem" }}>
									{t("common:fileInput.sendFiles")}
								</Button>
								{/* )} */}
							</form>
						</FormikProvider>
						<Typography component="h2" variant="h5" textAlign={"left"} sx={{ textTransform: "capitalize" }}>
							{t("translation:accountManagementPage.userInfo")}
						</Typography>
						<FormikProvider value={updateUserInfoFormik}>
							<form onSubmit={updateUserInfoFormik.handleSubmit}>
								<Grid
									container
									columnSpacing={2}
									rowSpacing={1.5}
									sx={{
										display: "flex",
										marginBottom: "1rem",
									}}>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="name" label={t("common:form.name")} name="name" />
									</Grid>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="surname" label={t("common:form.surname")} name="surname" />
									</Grid>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<TextFieldFormik id="email" label={t("common:form.email")} name="email" />
									</Grid>
									{decodedAccessToken?.role === "patient" ? (
										<>
											<Grid item xs={12} sm={6} md={4} minHeight="100px">
												<TextFieldFormik id="street" label={t("common:form.street")} name="address.street" />
											</Grid>
											<Grid item xs={12} sm={6} md={4} minHeight="100px">
												<TextFieldFormik id="city" label={t("common:form.city")} name="address.city" />
											</Grid>
											<Grid item xs={12} sm={6} md={4} minHeight="100px">
												<TextFieldFormik
													id="postalCode"
													label={t("common:form.postalCode")}
													name="address.postalCode"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={4} minHeight="100px">
												<TextFieldFormik
													id="phoneNumber"
													label={t("common:form.phoneNumber")}
													name="phoneNumber"
													type="tel"
												/>
											</Grid>
										</>
									) : null}
								</Grid>
								<Button type="submit" startIcon={<TaskAltIcon />} isSubmitting={updateUserInfoFormik.isSubmitting}>
									{t("common:form.submitButton")}
								</Button>
							</form>
						</FormikProvider>
					</CardContent>
				</Card>
				<Card sx={{ width: "100%" }}>
					<CardContent
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
						}}>
						<Typography component="h2" variant="h5" textAlign={"left"} sx={{ textTransform: "capitalize" }}>
							{t("accountManagementPage.changePass")}
						</Typography>
						<FormikProvider value={changePasswordFormik}>
							<form onSubmit={changePasswordFormik.handleSubmit}>
								<Grid
									container
									columnSpacing={2}
									rowSpacing={1.5}
									sx={{
										display: "flex",
										marginBottom: "1rem",
									}}>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<PasswordFieldFormik id="password" label={t("common:form.password")} name="password" />
									</Grid>
									<Grid item xs={12} sm={6} md={4} minHeight="100px">
										<PasswordFieldFormik
											id="confirm-password"
											label={t("common:form.confirmPassword")}
											name="confirmPassword"
										/>
									</Grid>
								</Grid>
								<Button type="submit" startIcon={<TaskAltIcon />} isSubmitting={changePasswordFormik.isSubmitting}>
									{t("common:form.submitButton")}
								</Button>
							</form>
						</FormikProvider>
						<Modal
							title={t("modal:deleteAccount.title")}
							text={t("modal:deleteAccount.text")}
							openModalBtnText={t("modal:deleteAccount.openModalButton")}
							openModalBtnColor="error"
							onAsyncClick={() => deleteUserAndRedirect()}
							openModalBtnVariant="text"
							openModalBtnFullWidth={true}
							acceptBtnVariant="text"
							acceptBtnColor="error"
							rejectBtnVariant="contained"
						/>
					</CardContent>
				</Card>
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default AccountManagement;
