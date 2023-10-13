import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FailedReqMsg, SpecializationsResponse } from "types/api-types";
import { axiosPrivateInstance } from "utils/axios/axios";

export interface InitialStateValues {
	isLoading: boolean;
	isError: boolean;
	specializations: SpecializationsResponse["specializations"];
	totalItems: SpecializationsResponse["totalItems"];
}

const initialState: InitialStateValues = {
	isLoading: false,
	isError: false,
	specializations: [],
	totalItems: 0,
};

export const getAllSpecializations = createAsyncThunk(
	"specializations/getAllSpecializations",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance("/specializations");

			return res.data;
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.response?.data.message);
			return rejectWithValue(err);
		}
	}
);

const specializationsSlice = createSlice({
	name: "specializations",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getAllSpecializations.pending, state => {
			state.isLoading = true;
			state.isError = false;
		});
		builder.addCase(getAllSpecializations.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.specializations = payload.specializations;
			state.totalItems = payload.totalItems;
		});
		builder.addCase(getAllSpecializations.rejected, state => {
			state.isError = true;
			state.isLoading = false;
		});
	},
});

export const specializationsActions = specializationsSlice.actions;
export default specializationsSlice.reducer;
