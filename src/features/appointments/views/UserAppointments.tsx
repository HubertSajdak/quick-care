import BookIcon from "@mui/icons-material/Book";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Modal from "components/Modal/Modal";
import NotFoundContent from "components/NotFoundContent/NotFoundContent";
import Table from "components/Table/Table";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { appointmentsActions, cancelUserAppointment, getUserAppointments } from "../appointmentsSlice";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "myAppointments",
	},
];
const UserAppointments = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation(["patients", "modal", "translation"]);
	const { userAppointments, totalItems, isLoading, isError, sortBy, sortDirection, currentPage, search, pageSize } =
		useAppSelector(state => state.appointments);
	useEffect(() => {
		dispatch(getUserAppointments());
	}, [dispatch, search, sortBy, sortDirection, pageSize, currentPage]);
	const changeSortHandler = (sortingProperty: string, sortingDirection: "asc" | "desc") => {
		dispatch(appointmentsActions.changeAllAppointmentsSort({ sortingProperty, sortingDirection }));
	};

	const changePageHandler = (page: number) => {
		dispatch(appointmentsActions.changePage(page));
	};

	const changeRowsPerPageHandler = (rowsPerPage: number) => {
		dispatch(appointmentsActions.changeRowsPerPage(rowsPerPage));
	};

	const debouncedOnChangeSearch = useDebouncedCallback((search: string) => {
		dispatch(appointmentsActions.changeSearch(search));
	}, 1000);

	const cancelUserAppointmentHandler = async (id: string) => {
		await dispatch(cancelUserAppointment(id));
		await dispatch(getUserAppointments());
	};

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform="capitalize" marginBottom={2}>
				{t("translation:sidebar.myAppointments")}
			</Typography>
			<Grid container xs={12}>
				<Grid item xs={12} display="flex" justifyContent="center">
					<Box sx={{ width: { xs: "260px", sm: "100%" }, maxWidth: "1400px" }}>
						{isError ? (
							<NotFoundContent returnPath="/" />
						) : (
							<Table
								filter={
									<div style={{ marginRight: "1rem" }}>
										<TextField
											placeholder={t("patients:table.searchInput")}
											defaultValue={search || ""}
											onChange={e => debouncedOnChangeSearch(e.target.value)}
											size="small"
										/>
									</div>
								}
								onChangePage={changePageHandler}
								onChangeSort={changeSortHandler}
								onChangeRowsPerPage={changeRowsPerPageHandler}
								pagination={{
									currentPage: currentPage,
									pageSize: pageSize,
									totalItems: totalItems,
								}}
								sort={{ sortBy: sortBy, sortDirection: sortDirection }}
								isSelectable={true}
								isLoading={isLoading}
								tableName={t("patients:table.tableAppointmentsLabel")}
								innerTableTitle="More info"
								data={userAppointments || []}
								collapsible
								columns={[
									// {
									// 	title: t("tableHeadings.name"),
									// 	key: "name",
									// 	render: row => row.doctorInfo.name,
									// 	sortable: false,
									// },
									// {
									// 	title: t("tableHeadings.surname"),
									// 	key: "surname",
									// 	render: row => row.doctorInfo.surname,
									// 	sortable: false,
									// },
									{
										title: t("tableHeadings.date"),
										key: "appointmentDate",
										render: row => row.appointmentDate,
										sortable: true,
									},
									{
										title: t("tableHeadings.clinicName"),
										key: "clinicName",
										render: row => row.clinicInfo.clinicName,
										sortable: true,
									},

									{
										title: t("tableHeadings.appointmentStatus"),
										key: "appointmentStatus",
										render: row => row.appointmentStatus,
										sortable: false,
									},
									{
										title: t("tableHeadings.actions"),
										key: "actions",
										render: row => (
											<Modal
												title={t("modal:cancelAppointment.title")}
												text={t("modal:cancelAppointment.text")}
												openModalBtnColor="warning"
												openModalBtnText={
													<BookIcon
														color={
															row.appointmentStatus === "canceled" || row.appointmentStatus === "completed"
																? "disabled"
																: "info"
														}
													/>
												}
												isOpenModalIconBtn={true}
												disableOpenModalBtn={
													row.appointmentStatus === "canceled" || row.appointmentStatus === "completed"
												}
												acceptBtnColor="error"
												rejectBtnVariant="contained"
												onAsyncClick={() => cancelUserAppointmentHandler(row._id)}
											/>
										),
										sortable: false,
									},
								]}
								innerColumns={[
									{
										title: t("tableHeadings.photo"),
										key: "photo",
										render: row => row.doctorInfo.photo,
										sortable: false,
									},
									{
										title: t("tableHeadings.name"),
										key: "name",
										render: row => row.doctorInfo.name,
										sortable: false,
									},
									{
										title: t("tableHeadings.surname"),
										key: "surname",
										render: row => row.doctorInfo.surname,
										sortable: false,
									},
									{
										title: t("tableHeadings.street"),
										key: "street",
										render: row => row.appointmentAddress.street,
										sortable: false,
									},
									{
										title: t("tableHeadings.city"),
										key: "city",
										render: row => row.appointmentAddress.city,
										sortable: false,
									},
									{
										title: t("tableHeadings.postalCode"),
										key: "postalCode",
										render: row => row.appointmentAddress.postalCode,
										sortable: false,
									},
								]}
							/>
						)}
					</Box>
				</Grid>
			</Grid>
		</DashboardLayoutWrapper>
	);
};

export default UserAppointments;
