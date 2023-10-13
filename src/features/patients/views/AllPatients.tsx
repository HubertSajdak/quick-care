import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import Button from "components/Button/Button";
import Modal from "components/Modal/Modal";
import NotFoundContent from "components/NotFoundContent/NotFoundContent";
import Table from "components/Table/Table";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { getAllPatients, patientsActions } from "../patientsSlice";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "allPatients",
	},
];
const AllPatients = () => {
	const { t } = useTranslation(["patients", "modal"]);
	useDocumentTitle(t("allPatients"));

	const dispatch = useAppDispatch();

	const { data, totalItems, isLoading, isError, sortBy, sortDirection, currentPage, search, pageSize } = useAppSelector(
		state => state.patients.allPatientsData
	);

	const fetchDoctorsData = useCallback(async () => {
		await dispatch(getAllPatients());
	}, [dispatch]);

	useEffect(() => {
		dispatch(getAllPatients());
	}, [dispatch, search, sortBy, sortDirection, pageSize, currentPage]);

	const changeSortHandler = (sortingProperty: string, sortingDirection: "asc" | "desc") => {
		dispatch(patientsActions.changeAllPatientsSort({ sortingProperty, sortingDirection }));
	};

	const changePageHandler = (page: number) => {
		dispatch(patientsActions.changePage(page));
	};

	const changeRowsPerPageHandler = (rowsPerPage: number) => {
		dispatch(patientsActions.changeRowsPerPage(rowsPerPage));
	};

	const debouncedOnChangeSearch = useDebouncedCallback((search: string) => {
		dispatch(patientsActions.changeSearch(search));
	}, 1000);

	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("allPatients")}
			</Typography>
			<Box
				width="100%"
				boxShadow="3"
				padding="1rem"
				maxWidth={{ lg: "lg", md: "850px", sm: "530px", xs: "300px" }}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignitems: "center",
					backgroundColor: "white",
					borderTop: 5,
					borderColor: "primary.main",
					borderRadius: "8px 8px 0 0",
					margin: "0 auto",
				}}>
				{isError ? (
					<NotFoundContent returnPath="/" />
				) : (
					<>
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
							tableName={t("table.tableName")}
							data={data || []}
							columns={[
								{
									title: t("tableHeadings.name"),
									key: "name",
									render: row => row.name,
									sortable: true,
								},
								{
									title: t("tableHeadings.surname"),
									key: "surname",
									render: row => row.surname,
									sortable: true,
								},
								{
									title: t("tableHeadings.email"),
									key: "email",
									render: row => row.email,
									sortable: true,
								},
								{
									title: t("tableHeadings.street"),
									key: "address.street",
									render: row => row.address.street,
									sortable: true,
								},
								{
									title: t("tableHeadings.city"),
									key: "address.city",
									render: row => row.address.city,
									sortable: true,
								},
								{
									title: t("tableHeadings.postalCode"),
									key: "address.postalCode",
									render: row => row.address.postalCode,
									sortable: true,
								},

								{
									title: t("tableHeadings.phoneNumber"),
									key: "phoneNumber",
									render: row => row.phoneNumber,
									sortable: true,
								},

								{
									title: t("tableHeadings.actions"),
									key: "actions",
									render: row => (
										<Box display="flex">
											{/* <IconButton component={Link} to={`/allPatients/editPatient/${row._id}`}>
												<EditIcon color="info" />
											</IconButton> */}
											<Modal
												title={t("modal:deletePatient.title")}
												text={t("modal:deletePatient.text")}
												openModalBtnColor="warning"
												openModalBtnText={<DeleteIcon />}
												isOpenModalIconBtn={true}
												acceptBtnColor="error"
												rejectBtnVariant="contained"
												onAsyncClick={function (): Promise<void> {
													throw new Error("Function not implemented.");
												}}
											/>
										</Box>
									),
									sortable: false,
								},
							]}
						/>

						<div style={{ display: "flex" }}>
							{/* @ts-ignore */}
							<Button component={Link} to={"/addPatient"} startIcon={<AddCircleOutlineIcon />}>
								{t("buttons:add")}
							</Button>
							<Button startIcon={<RefreshIcon />} onAsyncClick={fetchDoctorsData} sx={{ margin: "0 0 0 16px" }}>
								{t("buttons:refresh")}
							</Button>
						</div>
					</>
				)}
			</Box>
		</DashboardLayoutWrapper>
	);
};

export default AllPatients;
