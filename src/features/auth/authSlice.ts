import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
	FailedReqMsg,
	ReqeustRegisterDoctorCredentials,
	ReqeustRegisterPatientCredentials,
	RequestLoginCredentials,
	Tokens,
} from "types/api-types";
import { axiosInstance } from "utils/axios/axios";
import {
	removeRefreshTokenFromLocalStorage,
	removeTokenFromLocalStorage,
	setRefreshTokenToLocalStorage,
	setTokenToLocalStorage,
} from "utils/localStorage/localStorage";
export interface RegistrationInitialValues {
	isRegistrationSuccessful: boolean;
}

const registrationInitialValues: RegistrationInitialValues = {
	isRegistrationSuccessful: false,
};

export const refreshAccessToken = async (refreshToken: Tokens["refreshToken"]) => {
	const res = await axiosInstance.post("/auth/refreshToken", {
		refreshToken,
	});
	return res.data.accessToken;
};

export const logoutUser = () => {
	removeTokenFromLocalStorage();
	removeRefreshTokenFromLocalStorage();
};

export const loginUser = createAsyncThunk("auth/loginUser", async (values: RequestLoginCredentials, thunkAPI) => {
	try {
		const res = await axiosInstance.post("auth/login", values);
		setTokenToLocalStorage(res.data.accessToken);
		setRefreshTokenToLocalStorage(res.data.refreshToken);
		toast.success(res.data.message);
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message);
		thunkAPI.rejectWithValue(err.response?.data.message);
	}
});

export const registerPatient = createAsyncThunk(
	"auth/registerPatient",
	async (values: ReqeustRegisterPatientCredentials, thunkAPI) => {
		try {
			const res = await axiosInstance.post("/patients/register", {
				...values,
			});
			toast.success(res.data.message);

			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message, {
				autoClose: false,
			});
			thunkAPI.rejectWithValue(err.response?.data.message);
		}
	}
);
export const registerDoctor = createAsyncThunk(
	"auth/registerDoctor",
	async (values: ReqeustRegisterDoctorCredentials, thunkAPI) => {
		try {
			const res = await axiosInstance.post("/doctors/register", {
				...values,
			});
			toast.success(res.data.message);

			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message, {
				autoClose: false,
			});
			thunkAPI.rejectWithValue(err.response?.data.message);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: registrationInitialValues,
	reducers: {
		resetRegistrationState(state) {
			state.isRegistrationSuccessful = false;
		},
	},
	extraReducers: builder => {
		builder.addCase(registerPatient.fulfilled, state => {
			state.isRegistrationSuccessful = true;
		});
		builder.addCase(registerDoctor.fulfilled, state => {
			state.isRegistrationSuccessful = true;
		});
	},
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
