import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { DoctorResponse, FailedReqMsg, SuccessfulReqMsg } from "types/api-types";

import { axiosPrivateInstance } from "utils/axios/axios";
export interface initialDoctorsDataValue {
	search: string;
	sortBy: string;
	sortDirection: "asc" | "desc";
	pageSize: number;
	currentPage: number;
	querySpecializations: string;
	isLoading: boolean;
	isError: boolean;
	data: DoctorResponse[] | null;
	totalItems: 0;
}
export interface initialSingleDoctorDataValue {
	isLoading: boolean;
	isError: boolean;
	data: DoctorResponse | null;
}
const initialDoctorsData: initialDoctorsDataValue = {
	search: "",
	sortBy: "name",
	sortDirection: "asc",
	pageSize: 5,
	currentPage: 1,
	querySpecializations: "",
	isLoading: false,
	isError: false,
	data: null,
	totalItems: 0,
};
const initialSingleDoctorData: initialSingleDoctorDataValue = {
	isLoading: false,
	isError: false,
	data: null,
};

export const addDoctorSpecialization = async (specializationId: string) => {
	try {
		const res = await axiosPrivateInstance.post<SuccessfulReqMsg>("/doctorSpecializations/me", {
			specializationId: specializationId,
		});
		toast.success(res.data.message);
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.message);
	}
};
export const deleteDoctorSpecialization = async (doctorSpecializationId: string) => {
	try {
		const res = await axiosPrivateInstance.delete<SuccessfulReqMsg>(`/doctorSpecializations/${doctorSpecializationId}`);
		toast.success(res.data.message);
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.message);
	}
};
export const getAllDoctors = createAsyncThunk("doctors/getAllDoctors", async (_, { getState, rejectWithValue }) => {
	const state = getState() as RootState;
	const { search, sortBy, sortDirection, pageSize, currentPage, querySpecializations } = state.doctors.allDoctorsData;

	try {
		const res = await axiosPrivateInstance("/doctors", {
			params: {
				sortBy,
				sortDirection,
				pageSize,
				currentPage,
				...(querySpecializations && { querySpecializations }),
				...(search && { search }),
			},
		});
		console.log(res.data);
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message);
		return rejectWithValue(err);
	}
});

export const getSingleDoctor = createAsyncThunk("doctors/getSingleDoctor", async (id: string, { rejectWithValue }) => {
	try {
		const res = await axiosPrivateInstance<{ doctor: DoctorResponse }>(`/doctors/${id}`);
		return res.data.doctor;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message);
		return rejectWithValue(err);
	}
});

const doctorsSlice = createSlice({
	name: "doctors",
	initialState: {
		allDoctorsData: initialDoctorsData,
		singleDoctorData: initialSingleDoctorData,
	},
	reducers: {
		changeAllPatientsSort: (
			state,
			{ payload }: PayloadAction<{ sortingProperty: string; sortingDirection: "asc" | "desc" }>
		) => {
			state.allDoctorsData.sortBy = payload.sortingProperty;
			state.allDoctorsData.sortDirection = payload.sortingDirection;
		},
		changePage: (state, { payload }: PayloadAction<number>) => {
			state.allDoctorsData.currentPage = payload;
		},
		changeRowsPerPage: (state, { payload }: PayloadAction<number>) => {
			state.allDoctorsData.pageSize = payload;
			state.allDoctorsData.currentPage = 1;
		},
		changeSearch: (state, { payload }: PayloadAction<string>) => {
			state.allDoctorsData.search = payload;
			state.allDoctorsData.currentPage = 1;
		},
		changeQuerySpecializations: (state, { payload }: PayloadAction<string>) => {
			state.allDoctorsData.querySpecializations = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(getAllDoctors.pending, state => {
			state.allDoctorsData.isLoading = true;
			state.allDoctorsData.isError = false;
		});
		builder.addCase(getAllDoctors.fulfilled, (state, { payload }) => {
			state.allDoctorsData.data = payload.data;
			state.allDoctorsData.totalItems = payload.totalItems;
			state.allDoctorsData.isLoading = false;
		});
		builder.addCase(getAllDoctors.rejected, state => {
			state.allDoctorsData.isLoading = false;
			state.allDoctorsData.isError = true;
		});
		builder.addCase(getSingleDoctor.pending, state => {
			state.singleDoctorData.isLoading = true;
			state.singleDoctorData.isError = false;
		});
		builder.addCase(getSingleDoctor.fulfilled, (state, { payload }) => {
			state.singleDoctorData.isLoading = false;
			state.singleDoctorData.data = payload;
		});
		builder.addCase(getSingleDoctor.rejected, state => {
			state.singleDoctorData.isLoading = false;
			state.singleDoctorData.isError = true;
		});
	},
});

export const doctorsActions = doctorsSlice.actions;
export default doctorsSlice.reducer;
