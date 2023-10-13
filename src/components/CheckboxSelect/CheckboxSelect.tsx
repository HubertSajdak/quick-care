import { Box, FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import Checkbox from "components/Checkbox/Checkbox";
export type CheckboxSelectValues = {
	id?: string;

	optionsList: {
		id: number | string;
		value: number | string;
		label: string;
	}[];
	label?: string;
	onAddButton?: React.ReactNode;
	onSelected: (spec: { id: string | number; label: string; value: string | number }) => void;
	checkedList: { id: string | number; label: string; value: string | number }[];
} & SelectProps;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const CheckboxSelect = ({
	id = "select",
	label,
	optionsList,
	onAddButton,
	checkedList,
	onSelected,
	...SelectProps
}: CheckboxSelectValues) => {
	return (
		<Box>
			<FormControl>
				<InputLabel id={id}>
					{label}
				</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id={id}
					label={label}
					multiple
					MenuProps={MenuProps}
					{...SelectProps}>
					{optionsList.map(select => {
						return (
							<MenuItem key={select.id} value={select.value}>
								<Checkbox
									checked={checkedList.some(el => el.id === select.id)}
									label={select.label}
									onChange={e => onSelected(select)}
								/>
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			{onAddButton ? onAddButton : null}
		</Box>
	);
};

export default CheckboxSelect;
