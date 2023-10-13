export const getQueryParamsList = () => {
	const paramsArr: { key: string; value: string }[] = [];
	window.location.search
		.split("?")?.[1]
		?.split("&")
		?.forEach(query => {
			const key = query?.split("=")?.[0];
			const value = query?.split("=")?.[1];
			paramsArr.push({ key, value });
		});

	return paramsArr;
};
