import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AddressValues, ClinicAffiliationsResponse, FailedReqMsg } from "types/api-types";
import { axiosPrivateInstance } from "utils/axios/axios";

export interface DoctorClinicAffiliationsResponse extends ClinicAffiliationsResponse {
	clinicInfo: {
		workingTime: {
			weekDay: string;
			startTime: string;
			stopTime: string;
		};
		address: AddressValues;
		phoneNumber: number;
	};
}

export interface InitialStateProps {
	data: ClinicAffiliationsResponse[] | null;
	totalItems: number;
	singleClinicAffiliation: ClinicAffiliationsResponse | null;
	singleDoctorClinicAffiliations: DoctorClinicAffiliationsResponse[] | null;
	isLoading: boolean;
}
const initialState: InitialStateProps = {
	data: null,
	totalItems: 0,
	singleClinicAffiliation: null,
	singleDoctorClinicAffiliations: null,
	isLoading: false,
};

export const createClinicAffiliations = createAsyncThunk(
	"clinicsAffiliations/createClinicAffiliation",
	async (values: Omit<ClinicAffiliationsResponse, "_id" | "doctorId">, { rejectWithValue }) => {
		console.log(values);
		try {
			const res = await axiosPrivateInstance.post("/clinicAffiliations", { ...values });
			toast.success(res.data.message);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			console.log(err);
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);
export const updateClinicAffiliations = createAsyncThunk(
	"clinicsAffiliations/createClinicAffiliation",
	async (values: Omit<ClinicAffiliationsResponse, "doctorId">, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance.put(`/clinicAffiliations/${values._id}`, { ...values });
			toast.success(res.data.message);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			console.log(err);
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);

export const getCurrentUserClinicAffiliations = createAsyncThunk(
	"clinicAffiliations/getCurrentUserClinicAffiliations",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance("/clinicAffiliations/userClinicAffiliations");
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			console.log(err);
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);
export const getSingleDoctorClinicAffiliations = createAsyncThunk(
	"clinicAffiliations/getSingleDoctorClinicAffiliation",
	async (id: string, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance(`/clinicAffiliations/doctorClinicAffiliations/${id}`);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);
export const getSingleClinicAffiliation = createAsyncThunk(
	"clinicAffiliations/getSingleClinicAffiliation",
	async (id: string, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance(`/clinicAffiliations/${id}`);
			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);

const clinicAffiliationsSlice = createSlice({
	name: "clinicAffiliations",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getCurrentUserClinicAffiliations.fulfilled, (_, { payload }) => {
			return { ...payload };
		});
		builder.addCase(getSingleClinicAffiliation.fulfilled, (state, { payload }) => {
			state.singleClinicAffiliation = payload;
		});
		builder.addCase(getSingleDoctorClinicAffiliations.pending, state => {
			state.isLoading = true;
		});
		builder.addCase(getSingleDoctorClinicAffiliations.fulfilled, (state, { payload }) => {
			state.singleDoctorClinicAffiliations = payload;
			state.isLoading = false;
		});
		builder.addCase(getSingleDoctorClinicAffiliations.rejected, state => {
			state.isLoading = false;
		});
	},
});
export default clinicAffiliationsSlice.reducer;
