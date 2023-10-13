import { Box } from "@mui/material";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

export interface DataSetValues {
	label: string;
	data: any[];
	borderColor: string;
	backgroundColor: string;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
	plugins: {
		legend: {
			position: "top" as const,
		},
	},
	scales: {
		y: {
			ticks: {
				stepSize: 1,
			},
		},
		x: {
			ticks: {
				autoskip: false,
				maxRotation: 90,
				minRotation: 90,
			},
		},
	},
	maintainAspectRatio: true,
};

const labels = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const LineChart = ({ dataSet }: { dataSet: DataSetValues[] }) => {
	const dataSettings = {
		labels,
		datasets: dataSet,
	};

	return (
		<Box display="flex" justifyContent="center" width={"90%"}>
			<Bar options={options} data={dataSettings} />
		</Box>
	);
};

export default LineChart;
