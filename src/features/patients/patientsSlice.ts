import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { PatientResponse, FailedReqMsg } from "types/api-types";

import { axiosPrivateInstance } from "utils/axios/axios";
export interface initialPatientsDataValue {
	search: string;
	sortBy: string;
	sortDirection: "asc" | "desc";
	pageSize: number;
	currentPage: number;
	isLoading: boolean;
	isError: boolean;
	data: PatientResponse[] | null;
	totalItems: 0;
}

const initialPatientsData: initialPatientsDataValue = {
	search: "",
	sortBy: "name",
	sortDirection: "asc",
	pageSize: 5,
	currentPage: 1,
	isLoading: false,
	isError: false,
	data: null,
	totalItems: 0,
};

export const getAllPatients = createAsyncThunk("patients/getAllPatients", async (_, { getState, rejectWithValue }) => {
	const state = getState() as RootState;

	const { search, sortBy, sortDirection, pageSize, currentPage } = state.patients.allPatientsData;

	try {
		const res = await axiosPrivateInstance("/patients", {
			params: {
				sortBy,
				sortDirection,
				pageSize,
				currentPage,
				...(search && { search }),
			},
		});
		return res.data;
	} catch (error) {
		const err = error as AxiosError<FailedReqMsg>;
		toast.error(err.response?.data.message);
		return rejectWithValue(err);
	}
});

const patientsSlice = createSlice({
	name: "patients",
	initialState: {
		allPatientsData: initialPatientsData,
	},
	reducers: {
		changeAllPatientsSort: (
			state,
			{ payload }: PayloadAction<{ sortingProperty: string; sortingDirection: "asc" | "desc" }>
		) => {
			state.allPatientsData.sortBy = payload.sortingProperty;
			state.allPatientsData.sortDirection = payload.sortingDirection;
		},
		changePage: (state, { payload }: PayloadAction<number>) => {
			state.allPatientsData.currentPage = payload;
		},
		changeRowsPerPage: (state, { payload }: PayloadAction<number>) => {
			state.allPatientsData.pageSize = payload;
			state.allPatientsData.currentPage = 1;
		},
		changeSearch: (state, { payload }: PayloadAction<string>) => {
			state.allPatientsData.search = payload;
			state.allPatientsData.currentPage = 1;
		},
	},
	extraReducers: builder => {
		builder.addCase(getAllPatients.pending, state => {
			state.allPatientsData.isLoading = true;
			state.allPatientsData.isError = false;
		});
		builder.addCase(getAllPatients.fulfilled, (state, { payload }) => {
			state.allPatientsData.data = payload.data;
			state.allPatientsData.totalItems = payload.totalItems;
			state.allPatientsData.isLoading = false;
		});
		builder.addCase(getAllPatients.rejected, state => {
			state.allPatientsData.isLoading = false;
			state.allPatientsData.isError = true;
		});
	},
});

export const patientsActions = patientsSlice.actions;
export default patientsSlice.reducer;
