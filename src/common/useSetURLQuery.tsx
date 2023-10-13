import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export interface SetURLQueryProps {
	[key: string]: string;
}

const useSetURLQuery = ({ queryParams }: SetURLQueryProps) => {
	const [paramsKeys, setParamsKeys] = useState<{ key: string; value: string }[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const getParamsFromUrl = () => {
		const paramsArr: { key: string; value: string }[] = [];
		searchParams.forEach((value, key) => {
			paramsArr.push({ key, value });
		});
		setParamsKeys(paramsArr);
	};
	setSearchParams(queryParams);
	getParamsFromUrl();
	return { paramsKeys };
};

export default useSetURLQuery;
