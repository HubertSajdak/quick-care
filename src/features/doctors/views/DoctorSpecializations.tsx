import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useYupTranslation } from "common/useYupTranslation";
import SelectFormik from "components/SelectFormik/SelectFormik";
import { getAllSpecializations } from "features/specializations/specializationsSlice";
import { getUserData } from "features/user/userSlice";
import { FormikProvider, useFormik } from "formik";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "utils/axios/axios";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import * as Yup from "yup";
import { addDoctorSpecialization, deleteDoctorSpecialization } from "../doctorsSlice";

const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "mySpecializations",
	},
];

const DoctorSpecializations = () => {
	useYupTranslation();
	const dispatch = useAppDispatch();
	const { t } = useTranslation(["doctors", "specializations"]);
	const user = useAppSelector(state => state.user);
	const specializationKeys = useAppSelector(state => state.specializations.specializations);
	const [isAcceptBtn, setIsAcceptBtn] = useState(false);
	const doctorSpecializations = user.DoctorSpecialization?.map(doctorSpecialization => {
		const specializationKey = specializationKeys.find(
			specialization => specialization._id === doctorSpecialization.specializationId
		);
		const updatedValue = {
			_id: doctorSpecialization._id,
			doctorId: doctorSpecialization.doctorId,
			specializationId: doctorSpecialization.specializationId,
			specializationKey: specializationKey?.specializationKey,
		};
		return updatedValue;
	});

	const optionsList = specializationKeys.map(specialization => {
		const updatedValue = {
			id: specialization._id,
			value: specialization._id,
			label: t(`specializations:specializationKey.${specialization.specializationKey}`),
		};
		return updatedValue;
	});

	const handleRemoveDoctorSpecialization = async (doctorSpecializationId: string) => {
		await deleteDoctorSpecialization(doctorSpecializationId);
		await dispatch(getUserData());
	};
	useEffect(() => {
		dispatch(getAllSpecializations());
	}, [dispatch]);

	const addDoctorSpecializationValidation = Yup.object({
		specializationId: Yup.string().required(),
	});
	const addDoctorSpecializationFormik = useFormik({
		initialValues: {
			specializationId: "",
		},
		onSubmit: async (values, { resetForm }) => {
			await addDoctorSpecialization(values.specializationId);
			await dispatch(getUserData());
			resetForm();
		},
		validationSchema: addDoctorSpecializationValidation,
	});

	useEffect(() => {
		if (addDoctorSpecializationFormik.values.specializationId) {
			return setIsAcceptBtn(true);
		}
		return setIsAcceptBtn(false);
	}, [addDoctorSpecializationFormik.values.specializationId]);

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("doctors:doctorSpecializations.mySpecializations")}
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
				</Box>
				<Divider variant="middle" flexItem={true} />
				<Box display="flex" flexWrap="wrap" gap="16px">
					{doctorSpecializations
						? doctorSpecializations.map(specialization => {
								return (
									<Chip
										key={specialization._id}
										label={t(`specializations:specializationKey.${specialization.specializationKey}`)}
										sx={{
											minWidth: "200px",
											height: "50px",
											fontSize: "30px",
											textTransform: "capitalize",
											backgroundColor: "primary.main",
											color: "primary.contrastText",
										}}
										onDelete={() => handleRemoveDoctorSpecialization(specialization._id)}
										color="primary"
										variant="outlined"
									/>
								);
						  })
						: null}
					<FormikProvider value={addDoctorSpecializationFormik}>
						<form onSubmit={addDoctorSpecializationFormik.handleSubmit}>
							<SelectFormik
								id="specializationKey"
								name="specializationId"
								optionsList={optionsList ? optionsList : []}
								label={t("specializations:specializationLabel")}
								sx={{ borderRadius: "16px", height: "50px", minWidth: "180px" }}
								onAddButton={
									isAcceptBtn ? (
										<IconButton type="submit" size="large" color="primary">
											<AddCircleOutlineIcon />
										</IconButton>
									) : null
								}
							/>
						</form>
					</FormikProvider>
				</Box>
			</Box>
		</DashboardLayoutWrapper>
	);
};
export default DoctorSpecializations;
