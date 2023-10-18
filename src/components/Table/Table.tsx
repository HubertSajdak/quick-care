import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
	Box,
	IconButton,
	Table as MuiTable,
	Paper,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Rows from "./components/Rows";
import RowsCollapsible from "./components/RowsCollapsible";
export interface ColumnsValue<T> {
	/**
	 * Title of displayed column heading.
	 */
	title: string;
	/**
	 * "key" prop makes sorting options possible and provides unique value.
	 */
	key: string;
	/**
	 * Used to refer to certain key value from "data" array of objects and based on that column's row values are being rendered.
	 */
	render: (row: T) => React.ReactNode;
	/**
	 * Column receives "ascending", "descending" sort option.
	 */
	sortable: boolean;
}
export interface TableProps<T> {
	/**
	 * Provide "isLoading" prop to prevent user from taking any actions.
	 */
	isLoading: boolean;
	/**
	 * Each row will render its own "checkbox". If true then renderSelectedItemsOptions function is required.
	 */
	isSelectable: boolean;
	/**
   * Use this prop to add your own filters (such as search input).
   * 
   * @example 
   *  filter={
          <div style={{ marginRight: "1rem" }}>
            <TextField
              placeholder="search..."
              defaultValue={search || ""}
              onChange={(e) => onChangeSearch(e.target.value)}
              size="small"
            />
          </div>
        }
   */
	filter: React.ReactNode;
	tableName: string;
	/**
	 * Data based on which the column's row values are rendered.
	 */
	data: Array<T>;
	/**
   * Based on "columns" prop, column headings are being rendered. 
   * 
   * @example 
   *  columns={[
          {
            title: t("tableHeadings.name"),
            key: "name",
            render: (row) => row.name,
            sortable: true,
          },...
   */
	columns: ColumnsValue<T>[];
	/**
	 * Based on "innerColumns" prop, inner column headings are being rendered
	 */
	innerColumns?: ColumnsValue<T>[];
	/**
	 * Pass the "pagination" props to properly display information on the pagination bar.
	 */
	pagination: {
		currentPage: number;
		pageSize: number;
		totalItems: number;
	};
	/**
	 * Pass the "sort" props to properly display sorting arrow icon.
	 */
	sort: {
		sortBy: string;
		sortDirection: "asc" | "desc";
	};
	/**
   * Pass a function that takes number as an argument. The Previous button passes number: (-1) to the function, and the Next button passes number: (1) to the function. Based on that create a logic that will update the current page.
   * 
   * @example 
   * Function that triggers the update: 
   * 
   *  const changePageHandler = (page: number) => {
    dispatch(patientsActions.changePage(page));
  };
   * 
   * Function that updates the current page state:
   * 
   *  changePage: (state, { payload }: PayloadAction<number>) => {
      if (payload === 1) {
        state.currentPage++;
      }
      if (payload !== 1) {
        state.currentPage--;
      }
    },
   */
	onChangePage: (page: number) => void;
	/**
   * Pass a function that will change the number of visible rows per page.
   * 
   * @example
   * 
   * Function that triggers the update:
   * 
   * const changeRowsPerPageHandler = (rowsPerPage: number) => {
    dispatch(patientsActions.changeRowsPerPage(rowsPerPage));
  };

  Function that updates the rows per page state:

   changeRowsPerPage: (state, { payload }: PayloadAction<number>) => {
      state.pageSize = payload;
    },
   */
	onChangeRowsPerPage: (rowsPerPage: number) => void;
	/**
   * Pass a function that will change the sorting property. Sorting is based on provided to columns "key" prop.
   * 
   * @example 
   * 
   * Function that triggers the update:
   * 
   * const changeSortHandler = (sortingProperty: string) => {
    dispatch(patientsActions.changeSort(sortingProperty));
  };

  Sorting logic:

   changeAllPatientsSort: (state, { payload }: PayloadAction<string>) => {
      if (state.sortBy === payload) {
        state.sortDirection === "desc"
          ? (state.sortDirection = "asc")
          : (state.sortDirection = "desc");
      }
      if (state.sortBy !== payload) {
        state.sortBy = payload;
        state.sortDirection = "desc";
      }
    },
   */
	onChangeSort: (sortingProperty: string, sortingDirection: "asc" | "desc") => void;
	/**
   * If "isSelectable" is true, you can pass the render prop to the "renderSelectedItemsOptions" prop. This will allow you to programatically perform actions on selected items.
   * 
   * @example 
   * 
   *    renderSelectedItemsOptions={(selectedRows) => {
            return (
              <Tooltip title={t("patients:table.delete")}>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            );
          }};
  };
   */
	renderSelectedItemsOptions?: (selectedRows: T[]) => React.ReactNode;
	collapsible?: boolean;
	innerTableTitle?: string;
	refreshTableContent?: () => void;
}

const Table = <T extends { _id: string }>({
	isLoading,
	isSelectable,
	tableName,
	data,
	columns,
	pagination,
	sort,
	filter,
	collapsible,
	innerColumns,
	innerTableTitle,
	onChangePage,
	onChangeRowsPerPage,
	onChangeSort,
	renderSelectedItemsOptions,
	refreshTableContent,
}: TableProps<T>) => {
	const { t } = useTranslation();
	const [selectedCheckboxes, setSelectedCheckboxes] = useState<T[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [currentRowOpen, setCurrentRowOpen] = useState<string | null>(null);
	const filterHandler = () => {
		setIsFilterOpen(prevState => !prevState);
	};
	const toggleRowOpen = (id: string | null) => {
		if (currentRowOpen === id) {
			setCurrentRowOpen(null);
		} else {
			setCurrentRowOpen(id);
		}
	};
	const selectAllHandler = () => {
		if (selectedCheckboxes.length === pagination.pageSize) {
			setSelectedCheckboxes([]);
		} else {
			setSelectedCheckboxes(data);
		}
	};

	const clickHandler = (e: React.ChangeEvent<HTMLInputElement>, selectedRow: T) => {
		const { checked } = e.target;
		if (checked) {
			setSelectedCheckboxes(prevState => [...prevState, selectedRow]);
		} else {
			setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== selectedRow));
		}
	};
	return (
		<Box width="100%" maxWidth="100%" position="relative" sx={{ overflowX: "auto" }}>
			{isLoading && <LoadingSpinner />}
			<Paper sx={{ boxShadow: "5", width: "100%", maxWidth: "100%", mb: 2, overflowX: "auto" }}>
				<Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
					{selectedCheckboxes.length > 0 ? (
						<Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
							{`${selectedCheckboxes.length} ${t("patients:table.selected")}`}
						</Typography>
					) : (
						<Typography
							sx={{ flex: "1 1 100%" }}
							color="inherit"
							variant="subtitle1"
							component="div"
							textTransform="capitalize"
							fontWeight={700}>
							{tableName}
						</Typography>
					)}
					{isFilterOpen && filter}
					{isFilterOpen ? (
						<Tooltip title={t("patients:table.closeFilters")}>
							<IconButton onClick={filterHandler}>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					) : (
						<Tooltip title={t("patients:table.openFilters")}>
							<IconButton onClick={filterHandler}>
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					)}
					{refreshTableContent ? (
						<Tooltip title={t("patients:table.refreshTable")}>
							<IconButton onClick={refreshTableContent}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					) : null}
					{/* <Button startIcon={<RefreshIcon />} onAsyncClick={fetchDoctorsData} sx={{ margin: "0 0 0 16px" }}>
						{t("buttons:refresh")}
					</Button> */}
					{selectedCheckboxes.length > 0 &&
						renderSelectedItemsOptions &&
						renderSelectedItemsOptions(selectedCheckboxes)}
				</Toolbar>
				<TableContainer sx={{ overflowX: "auto", width: "100%", maxWidth: "100%", display: "block" }}>
					<MuiTable stickyHeader sx={{ overflowX: "auto", width: "100%", maxWidth: "100%" }}>
						<TableHead>
							<TableRow>
								<>
									{/* {isSelectable && (
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												onChange={selectAllHandler}
												checked={selectedCheckboxes.length > 0 && selectedCheckboxes.length === pagination.pageSize}
												indeterminate={selectedCheckboxes.length > 0 && selectedCheckboxes.length < pagination.pageSize}
											/>
										</TableCell>
									)} */}
									{collapsible ? <TableCell component="th" align="left" /> : null}
									{columns.map(column => {
										return column.sortable ? (
											<TableCell component="th" align="left" key={column.key}>
												<TableSortLabel
													active={sort.sortBy === column.key}
													direction={sort.sortDirection === "asc" ? "asc" : "desc"}
													onClick={() => {
														onChangeSort(
															column.key,
															sort.sortBy !== column.key
																? "asc"
																: sort.sortBy === column.key && sort.sortDirection === "desc"
																? "asc"
																: "desc"
														);
													}}
													sx={{ textTransform: "capitalize" }}>
													{column.title}
												</TableSortLabel>
											</TableCell>
										) : (
											<TableCell align="left" key={column.key} sx={{ textTransform: "capitalize" }}>
												{column.title}
											</TableCell>
										);
									})}
								</>
							</TableRow>
						</TableHead>
						<TableBody>
							{/* {data.map(item => {
								return (
									<StyledTableRow key={item._id} selected={selectedCheckboxes.includes(item)}>
										<>
											{isSelectable && (
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														onChange={e => clickHandler(e, item)}
														checked={selectedCheckboxes.includes(item)}
													/>
												</TableCell>
											)}
											{columns.map(column => {
												let textColor = "inherit";
												if (column.render(item) === "active") {
													textColor = theme.palette.success.main;
												}
												if (column.render(item) === "canceled") {
													textColor = theme.palette.error.main;
												}
												if (column.render(item) === "postponed") {
													textColor = theme.palette.secondary.main;
												}
												return (
													<TableCell
														align="left"
														key={column.key}
														scope="row"
														padding="normal"
														sx={{ color: textColor }}>
														{column.key === "photo" ? (
															<Avatar src={column.render(item) ? `${BASE_URL}${column.render(item)}` : undefined} />
														) : (
															column.render(item)
														)}
													</TableCell>
												);
											})}
										</>
									</StyledTableRow>
								);
							})} */}
							{!collapsible ? (
								<Rows data={data} columns={columns} />
							) : (
								<RowsCollapsible
									data={data}
									columns={columns}
									innerColumns={innerColumns}
									rowOpenId={currentRowOpen}
									innerTableTitle={innerTableTitle}
									setRowOpenId={toggleRowOpen}
								/>
							)}
						</TableBody>
					</MuiTable>
				</TableContainer>
				<TablePagination
					component="div"
					labelRowsPerPage={t("patients:table.rowsPerPage")}
					rowsPerPageOptions={[5, 10, 25]}
					count={pagination.totalItems}
					page={pagination.currentPage - 1}
					rowsPerPage={pagination.pageSize}
					backIconButtonProps={{
						title: t("patients:table.prevPageButton"),
					}}
					nextIconButtonProps={{
						title: t("patients:table.nextPageButton"),
					}}
					onPageChange={(_, page) => onChangePage(page + 1)}
					onRowsPerPageChange={e => onChangeRowsPerPage(+e.target.value)}
				/>
			</Paper>
		</Box>
	);
};

export default Table;
