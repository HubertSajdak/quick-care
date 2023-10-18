import { Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "styled-components";

const ColumnChart = ({
	title,
	options,
	series,
}: {
	title: string;
	options: ApexCharts.ApexOptions | any;
	series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined | any;
}) => {
	const theme = useTheme();
	return (
		<div id="chart">
			<Typography variant="body1" color={theme.palette.grey[600]} margin="16px 0 0 16px">
				{title}
			</Typography>
			<ReactApexChart options={options} series={series} type="bar" height={430} />
		</div>
	);
};

export default ColumnChart;
