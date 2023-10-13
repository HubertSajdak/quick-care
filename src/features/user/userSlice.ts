import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
	DoctorResponse,
	DoctorSpecializationsResponse,
	FailedReqMsg,
	PatientResponse,
	SpecializationsResponse,
	SuccessfulReqMsg,
} from "types/api-types";
import { axiosPrivateInstance, axiosPrivateUploadFileInstance } from "utils/axios/axios";

export interface PatientUserValues extends Omit<PatientResponse, "_id"> {}
export interface DoctorUserValues extends Omit<DoctorResponse, "_id"> {}
export interface UserValues extends PatientUserValues, DoctorUserValues {
	_id: string;
	DoctorSpecialization?:
		| {
				_id: string;
				specializationId: string;
				doctorId: string;
				Specialization?: {
					_id: string;
					specializationKey: string;
				};
		  }[]
		| [] | null | undefined;
}
const initialUserState: UserValues = {
	_id: "",
	name: "",
	surname: "",
	email: "",
	phoneNumber: 0,
	photo: "",
	address: {
		street: "",
		city: "",
		postalCode: "",
	},
	DoctorSpecialization: null,
	professionalStatement: null,
	role: "patient",
};

export const updateUserPhoto = createAsyncThunk(
	"user/updateUserPhoto",
	async (file: FormData, { dispatch, fulfillWithValue }) => {
		try {
			const res = await axiosPrivateUploadFileInstance.put<SuccessfulReqMsg>("/auth/me/uploadPhoto", file);
			dispatch(getUserData());
			fulfillWithValue(res);
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.message);
		}
	}
);

export interface updateUserDataValues {
	name: string;
	surname: string;
	email: string;
	phoneNumber: number | string;
	photo?: string;
	address?: {
		street: string;
		city: string;
		postalCode: string;
	};
}
export const getUserData = createAsyncThunk("user/getUserData", async (_, thunkAPI) => {
	try {
		const res = await axiosPrivateInstance("/auth/me");
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message);
		return thunkAPI.rejectWithValue(err.response?.data.message);
	}
});
export const updateUserData = createAsyncThunk(
	"user/updateUserData",
	async (values: updateUserDataValues, { dispatch, rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance.put("/auth/me", { ...values, phoneNumber: +values.phoneNumber });
			dispatch(getUserData());
			toast.success(res.data.message);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message);
			return rejectWithValue(err.response?.data.message);
		}
	}
);

export const updateUserPassword = async ({
	password,
	confirmPassword,
}: {
	password: string;
	confirmPassword: string;
}) => {
	try {
		const res = await axiosPrivateInstance.put<SuccessfulReqMsg>("/auth/me/updatePassword", {
			password,
			confirmPassword,
		});
		toast.success(res.data.message);
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message, {
			autoClose: false,
		});
	}
};

const userSlice = createSlice({
	name: "user",
	initialState: initialUserState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getUserData.fulfilled, (_, { payload }) => {
			return { ...payload };
		});
	},
});

export default userSlice.reducer;
