const QUICK_CARE_APP_ACCESS_TOKEN = "quick-care-access-token";
const QUICK_CARE_APP_REFRESH_TOKEN = "quick-care-refresh-token";
export const setTokenToLocalStorage = (accessToken: string) => {
	localStorage.setItem(QUICK_CARE_APP_ACCESS_TOKEN, JSON.stringify(accessToken));
};
export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
	localStorage.setItem(QUICK_CARE_APP_REFRESH_TOKEN, JSON.stringify(refreshToken));
};
export const getTokenFromLocalStorage = () => {
	const result = localStorage.getItem(QUICK_CARE_APP_ACCESS_TOKEN);
	const token: string = result ? JSON.parse(result) : "";
	return token;
};
export const getRefreshTokenFromLocalStorage = () => {
	const result = localStorage.getItem(QUICK_CARE_APP_REFRESH_TOKEN);
	const token: string = result ? JSON.parse(result) : "";
	return token;
};

export const removeTokenFromLocalStorage = () => {
	localStorage.removeItem(QUICK_CARE_APP_ACCESS_TOKEN);
};
export const removeRefreshTokenFromLocalStorage = () => {
	localStorage.removeItem(QUICK_CARE_APP_REFRESH_TOKEN);
};
