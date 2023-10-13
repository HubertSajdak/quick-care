import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
	Avatar,
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import styled from "styled-components";
import theme from "styles/theme";
import { BASE_URL } from "utils/axios/axios";
import { ColumnsValue } from "../Table";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-child(4n+1)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));
const StyledInnerTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-child(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));
export interface RowProps<T> {
	data: Array<T>;
	columns: ColumnsValue<T>[];
	innerColumns?: ColumnsValue<T>[];
	innerTableTitle?: string;
	rowOpenId: string | null;
	setRowOpenId: (id: string | null) => void;
}
const RowsCollapsible = <T extends { _id: string }>({
	data,
	columns,
	innerColumns,
	innerTableTitle,
	rowOpenId,
	setRowOpenId,
}: RowProps<T>) => {
	return (
		<>
			{data.map(item => {
				return (
					<>
						<StyledTableRow key={item._id} sx={{ width: "100%", position: "relative" }}>
							{/* {isSelectable && (
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														onChange={e => clickHandler(e, item)}
														checked={selectedCheckboxes.includes(item)}
													/>
												</TableCell>
											)} */}
							<TableCell width={10}>
								<IconButton aria-label="expand row" size="small" onClick={() => setRowOpenId(item._id)}>
									{rowOpenId === item._id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
								</IconButton>
							</TableCell>
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
									<TableCell align="left" key={column.key} scope="row" padding="normal" sx={{ color: textColor }}>
										{column.key === "photo" ? (
											<Avatar src={column.render(item) ? `${BASE_URL}${column.render(item)}` : undefined} />
										) : (
											column.render(item)
										)}
									</TableCell>
								);
							})}
						</StyledTableRow>
						<StyledTableRow sx={{ width: "100%", position: "relative" }}>
							<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
								<Collapse in={rowOpenId === item._id} timeout="auto" unmountOnExit>
									<Box margin={2}>
										{innerTableTitle ? (
											<Typography variant="subtitle1" gutterBottom component="div">
												{innerTableTitle}
											</Typography>
										) : null}
										<TableContainer sx={{ overflowX: "auto" }}>
											<Table size="small">
												<TableHead>
													<TableRow key={`innerRow-${item._id}`}>
														{innerColumns?.map(innerColumn => {
															return (
																<TableCell
																	align="left"
																	key={`innerColumn-${innerColumn.key}`}
																	sx={{ textTransform: "capitalize" }}
																	scope="row">
																	{innerColumn.title}
																</TableCell>
															);
														})}
													</TableRow>
												</TableHead>
												<TableBody>
													{[item]?.map(data => (
														<StyledInnerTableRow key={`innerColumn-${data._id}`}>
															<>
																{/* {isSelectable && (
																					<TableCell padding="checkbox">
																						<Checkbox
																							color="primary"
																							onChange={e => clickHandler(e, item)}
																							checked={selectedCheckboxes.includes(item)}
																						/>
																					</TableCell>
																				)} */}

																{innerColumns?.map(innerColumn => {
																	let textColor = "inherit";
																	if (innerColumn.render(item) === "active") {
																		textColor = theme.palette.success.main;
																	}
																	if (innerColumn.render(item) === "canceled") {
																		textColor = theme.palette.error.main;
																	}
																	if (innerColumn.render(item) === "postponed") {
																		textColor = theme.palette.secondary.main;
																	}

																	return (
																		<TableCell
																			align="left"
																			key={`innerColumn-${innerColumn.key}`}
																			scope="row"
																			padding="normal"
																			sx={{ color: textColor }}>
																			{innerColumn.key === "photo" ? (
																				<Avatar
																					src={
																						innerColumn.render(item)
																							? `${BASE_URL}${innerColumn.render(item)}`
																							: undefined
																					}
																				/>
																			) : (
																				innerColumn.render(item)
																			)}
																		</TableCell>
																	);
																})}
															</>
														</StyledInnerTableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Box>
								</Collapse>
							</TableCell>
						</StyledTableRow>
					</>
				);
			})}
		</>
	);
};

export default RowsCollapsible;
