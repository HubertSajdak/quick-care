import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookIcon from "@mui/icons-material/Book";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import useDocumentTitle from "common/useDocumentTitle";
import Button from "components/Button/Button";
import CheckboxSelect from "components/CheckboxSelect/CheckboxSelect";
import Modal from "components/Modal/Modal";
import NotFoundContent from "components/NotFoundContent/NotFoundContent";
import Table from "components/Table/Table";
import { getAllSpecializations } from "features/specializations/specializationsSlice";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { getQueryParamsList } from "utils/queryParams/queryParams";
import DashboardLayoutWrapper from "wrappers/DashboardLayoutWrapper";
import { doctorsActions, getAllDoctors } from "../doctorsSlice";
const breadcrumbs: BreadcrumbsProps[] = [
	{
		label: "dashboard",
		to: "start",
	},
	{
		label: "allDoctors",
	},
];
const AllDoctors = () => {
	const { t } = useTranslation(["patients", "doctors.allDoctors", "modal"]);
	useDocumentTitle(t("allDoctors.allDoctors"));

	const dispatch = useAppDispatch();
	const {
		data,
		totalItems,
		isLoading,
		isError,
		sortBy,
		sortDirection,
		currentPage,
		search,
		pageSize,
		querySpecializations,
	} = useAppSelector(state => state.doctors.allDoctorsData);
	const [selectedSpecOptions, setSelectedSpecOptions] = useState<
		{ id: string | number; label: string; value: string | number }[]
	>([]);
	const { specializations } = useAppSelector(state => state.specializations);

	const [_, setSearchParams] = useSearchParams();

	const fetchDoctorsData = useCallback(async () => {
		await dispatch(getAllDoctors());
	}, [dispatch]);

	useEffect(() => {
		dispatch(getAllDoctors());
		setSearchParams({
			search,
			sortBy,
			sortDirection,
			pageSize: String(pageSize),
			currentPage: String(currentPage),
			querySpecializations,
		});
		console.log(getQueryParamsList());
	}, [dispatch, search, sortBy, sortDirection, pageSize, currentPage, querySpecializations, setSearchParams]);

	useEffect(() => {
		dispatch(getAllSpecializations());
	}, [dispatch]);

	const specializationOptions = specializations
		.map(({ _id, specializationKey }) => ({
			id: _id,
			label: specializationKey,
			value: _id,
		}))
		.sort((a, b) => {
			if (a.label < b.label) {
				return -1;
			}
			if (a.label > b.label) {
				return 1;
			}
			return 0;
		});

	const changeSortHandler = (sortingProperty: string, sortingDirection: "asc" | "desc") => {
		dispatch(doctorsActions.changeAllPatientsSort({ sortingProperty, sortingDirection }));
	};

	const changePageHandler = (page: number) => {
		dispatch(doctorsActions.changePage(page));
	};

	const changeRowsPerPageHandler = (rowsPerPage: number) => {
		dispatch(doctorsActions.changeRowsPerPage(rowsPerPage));
	};

	const debouncedOnChangeSearch = useDebouncedCallback((search: string) => {
		dispatch(doctorsActions.changeSearch(search));
	}, 1000);

	const selectHandler = (spec: { id: string | number; label: string; value: string | number }) => {
		if (selectedSpecOptions.some(el => el.id === spec.id)) {
			const updatedSelectedOptions = selectedSpecOptions.filter(el => el.id !== spec.id);
			setSelectedSpecOptions(updatedSelectedOptions);
		} else {
			setSelectedSpecOptions(prev => [...prev, spec]);
		}
	};

	useEffect(() => {
		console.log(selectedSpecOptions);

		if (selectedSpecOptions) {
			const specsIdArray: string[] = [];
			selectedSpecOptions.forEach(option => specsIdArray.push(`${option.value}`));
			const specsQueryParam = specsIdArray.join("_");
			dispatch(doctorsActions.changeQuerySpecializations(specsQueryParam));
		}
	}, [selectedSpecOptions, dispatch]);
	return (
		<DashboardLayoutWrapper breadcrumbs={breadcrumbs}>
			<Typography component="h1" variant="h4" textAlign="center" textTransform={"capitalize"} marginBottom={2}>
				{t("allDoctors")}
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
								<Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}>
									<div style={{ margin: "1rem" }}>
										<CheckboxSelect
											size="small"
											optionsList={specializationOptions}
											checkedList={selectedSpecOptions}
											value={selectedSpecOptions}
											onSelected={selectHandler}
											renderValue={() => selectedSpecOptions.map(el => el.label).join(", ")}
											sx={{ width: 200 }}
											label="specializations"
										/>
									</div>
									<div style={{ margin: "1rem" }}>
										<TextField
											placeholder={t("patients:table.searchInput")}
											defaultValue={search || ""}
											onChange={e => debouncedOnChangeSearch(e.target.value)}
											size="small"
											sx={{ width: 200 }}
											type="search"
										/>
									</div>
								</Box>
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
							tableName={t("table.tableDoctorName")}
							innerTableTitle="More info"
							data={data || []}
							collapsible
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
									title: t("tableHeadings.actions"),
									key: "actions",
									render: row => (
										<Box display="flex">
											<IconButton component={Link} to={`/addAppointment/${row._id}`}>
												<BookIcon color="info" />
											</IconButton>
											<IconButton component={Link} to={`/allDoctors/singleDoctor/${row._id}`}>
												<PersonIcon color="info" />
											</IconButton>
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
							innerColumns={[
								{
									title: "specializations",
									key: "specialization",
									render: row =>
										row.DoctorSpecialization?.map((spec, idx, arr) => {
											if (idx + 1 === arr.length) {
												return `${spec.Specialization?.specializationKey}`;
											}
											return `${spec.Specialization?.specializationKey}, `;
										}),
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

export default AllDoctors;
