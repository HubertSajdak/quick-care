import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ClinicResponse, FailedReqMsg, SuccessfulReqMsg } from "types/api-types";
import { axiosPrivateInstance, axiosPrivateUploadFileInstance } from "utils/axios/axios";
export interface InitialStateProps {
	data: ClinicResponse[] | null;
	totalItems: number;
	singleClinicData: ClinicResponse | null;
}
export interface UploadClinicPhotoValues {
	id: string;
	file: FormData;
}
const initialState: InitialStateProps = {
	data: null,
	totalItems: 0,
	singleClinicData: null,
};

export const createClinic = createAsyncThunk(
	"clinics/createClinic",
	async (values: Omit<ClinicResponse, "_id" | "photo">, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance.post("/clinics", { ...values });
			toast.success(res.data.message);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);
export const getAllClinics = createAsyncThunk("clinics/getAllClinics", async (_, { rejectWithValue }) => {
	try {
		const res = await axiosPrivateInstance("/clinics");
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message, {
			autoClose: false,
		});
		rejectWithValue(err.response?.data.message);
	}
});
export const getSingleClinic = createAsyncThunk("clinics/getSingleClinic", async (id: string, { rejectWithValue }) => {
	try {
		const res = await axiosPrivateInstance(`/clinics/${id}`);
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message, {
			autoClose: false,
		});
		rejectWithValue(err.response?.data.message);
	}
});
export const updateClinic = createAsyncThunk(
	"clinics/updateClinic",
	async (values: Omit<ClinicResponse, "photo">, { dispatch, rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance.put(`/clinics/${values._id}`, values);
			dispatch(getSingleClinic(values._id));
			toast.success(res.data.message);
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);

export const updateClinicPhoto = createAsyncThunk(
	"user/updateUserPhoto",
	async (values: UploadClinicPhotoValues, { dispatch, fulfillWithValue }) => {
		try {
			const res = await axiosPrivateUploadFileInstance.put<SuccessfulReqMsg>(
				`/clinics/uploadPhoto/${values.id}`,
				values.file
			);
			dispatch(getSingleClinic(values.id));
			fulfillWithValue(res);
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.message);
		}
	}
);

const clinicsSlice = createSlice({
	name: "clinics",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getAllClinics.fulfilled, (_, { payload }) => {
			return { ...payload };
		});
		builder.addCase(getSingleClinic.fulfilled, (state, { payload }) => {
			state.singleClinicData = payload;
		});
	},
});

export default clinicsSlice.reducer;
