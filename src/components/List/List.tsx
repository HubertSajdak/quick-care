import { ListItem, ListItemIcon, ListItemText, List as MuiList } from "@mui/material";
export interface ListProps {
	listItemsArray: {
		id: string;
		text: string;
		icon?: React.ReactNode;
	}[];
	dense?: boolean;
}
const List = ({ listItemsArray, dense = false }: ListProps) => {
	return (
		<MuiList dense={dense}>
			{listItemsArray.map(({ id, text, icon }) => {
				return (
					<ListItem key={id}>
						{icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
						<ListItemText primary={text} />
					</ListItem>
				);
			})}
		</MuiList>
	);
};

export default List;
