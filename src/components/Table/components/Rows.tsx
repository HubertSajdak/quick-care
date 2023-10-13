import { Avatar, TableCell, TableRow } from "@mui/material";
import styled from "styled-components";
import theme from "styles/theme";
import { BASE_URL } from "utils/axios/axios";
import { ColumnsValue } from "../Table";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));
export interface RowProps<T> {
	data: Array<T>;
	columns: ColumnsValue<T>[];
}
const Rows = <T extends { _id: string }>({ data, columns }: RowProps<T>) => {
	return (
		<>
			{data.map(item => {
				return (
					<StyledTableRow key={item._id}>
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
						</>
					</StyledTableRow>
				);
			})}
		</>
	);
};

export default Rows;
