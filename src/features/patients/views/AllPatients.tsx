import { Box, Grid, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import NotFoundContent from "components/NotFoundContent/NotFoundContent";
import Table from "components/Table/Table";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

	const fetchPatientsData = useCallback(async () => {
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
			<Grid container xs={12}>
				<Grid item xs={12} display="flex" justifyContent="center">
					<Box
						position="relative"
						sx={{ overflowX: "auto", width: { xs: "260px", sm: "500px", md: "100%" }, maxWidth: "1400px" }}>
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
												sx={{ width: 200 }}
												type="search"
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
									refreshTableContent={fetchPatientsData}
									columns={[
										{
											title: t("tableHeadings.photo"),
											key: "photo",
											render: row => row.photo,
											sortable: false,
										},
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

										// {
										// 	title: t("tableHeadings.actions"),
										// 	key: "actions",
										// 	render: row => (
										// 		<Box display="flex">
										// 			<Modal
										// 				title={t("modal:deletePatient.title")}
										// 				text={t("modal:deletePatient.text")}
										// 				openModalBtnColor="warning"
										// 				openModalBtnText={<DeleteIcon />}
										// 				isOpenModalIconBtn={true}
										// 				acceptBtnColor="error"
										// 				rejectBtnVariant="contained"
										// 				onAsyncClick={function (): Promise<void> {
										// 					throw new Error("Function not implemented.");
										// 				}}
										// 			/>
										// 		</Box>
										// 	),
										// 	sortable: false,
										// },
									]}
								/>
							</>
						)}
					</Box>
				</Grid>
			</Grid>
		</DashboardLayoutWrapper>
	);
};

export default AllPatients;
