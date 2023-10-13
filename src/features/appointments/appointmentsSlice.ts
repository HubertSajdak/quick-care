import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AppointmentResponse, FailedReqMsg } from "types/api-types";
import { axiosPrivateInstance } from "utils/axios/axios";

export interface InitialStateProps {
	search: string;
	sortBy: string;
	sortDirection: "asc" | "desc";
	pageSize: number;
	currentPage: number;
	isLoading: boolean;
	isError: boolean;
	userAppointments: AppointmentResponse[] | null;
	doctorAppointments: AppointmentResponse[] | null;
	totalItems: number;
	isAppointmentCreated: boolean;
	createdAppointmentDetails: any;
}

const initialState: InitialStateProps = {
	search: "",
	sortBy: "appointmentDate",
	sortDirection: "asc",
	pageSize: 5,
	currentPage: 1,
	isLoading: false,
	isError: false,
	userAppointments: null,
	doctorAppointments: null,
	isAppointmentCreated: false,
	totalItems: 0,
	createdAppointmentDetails: null,
};
export const getUserAppointments = createAsyncThunk(
	"appointments/getUserAppointments",
	async (_, { rejectWithValue, getState }) => {
		const state = getState() as RootState;
		const { search, sortBy, sortDirection, pageSize, currentPage } = state.appointments;
		try {
			const res = await axiosPrivateInstance("/appointments/myAppointments", {
				params: {
					sortBy,
					sortDirection,
					pageSize,
					currentPage,
					...(search && { search }),
				},
			});
			console.log(res.data);
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
export const getDoctorAppointments = createAsyncThunk(
	"appointments/getDoctorAppointments",
	async (id: string, { rejectWithValue }) => {
		try {
			const res = await axiosPrivateInstance(`/appointments/${id}`);
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
export const cancelUserAppointment = createAsyncThunk(
	"appointments/cancelUserAppointment",
	async (id: string, { rejectWithValue }) => {
		console.log(id);
		try {
			const res = await axiosPrivateInstance.delete(`/appointments/myAppointments/${id}`);
			toast.success(res.data.message);
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
export const createAppointment = createAsyncThunk(
	"appointments/createAppointment",
	async (
		values: Omit<AppointmentResponse, "_id" | "patientId" | "doctorInfo" | "clinicInfo">,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const res = await axiosPrivateInstance.post("/appointments", values);
			toast.success(res.data.message);
			dispatch(appointmentsActions.setIsAppointmentCreated(true));
		} catch (error) {
			const err = error as AxiosError<FailedReqMsg>;
			toast.error(err.message, {
				autoClose: false,
			});
			rejectWithValue(err.response?.data.message);
		}
	}
);

const appointmentsSlice = createSlice({
	name: "appointments",
	initialState,
	reducers: {
		changeAllAppointmentsSort: (
			state,
			{ payload }: PayloadAction<{ sortingProperty: string; sortingDirection: "asc" | "desc" }>
		) => {
			state.sortBy = payload.sortingProperty;
			state.sortDirection = payload.sortingDirection;
		},
		changePage: (state, { payload }: PayloadAction<number>) => {
			state.currentPage = payload;
		},
		changeRowsPerPage: (state, { payload }: PayloadAction<number>) => {
			state.pageSize = payload;
			state.currentPage = 1;
		},
		changeSearch: (state, { payload }: PayloadAction<string>) => {
			state.search = payload;
			state.currentPage = 1;
		},
		setIsAppointmentCreated: (state, { payload }: PayloadAction<boolean>) => {
			state.isAppointmentCreated = payload;
		},
		setCreatedAppointmentDetails: (state, { payload }) => {
			state.createdAppointmentDetails = payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(getDoctorAppointments.pending, state => {
			state.isError = false;
			state.isLoading = true;
		});
		builder.addCase(getDoctorAppointments.fulfilled, (state, { payload }) => {
			state.doctorAppointments = payload.data;
			state.isLoading = false;
		});
		builder.addCase(getDoctorAppointments.rejected, state => {
			state.isError = true;
			state.isLoading = false;
		});
		builder.addCase(getUserAppointments.pending, state => {
			state.isLoading = true;
			state.isError = false;
		});
		builder.addCase(getUserAppointments.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.userAppointments = payload.data;
			state.totalItems = payload.totalItems;
		});
		builder.addCase(getUserAppointments.rejected, state => {
			state.isLoading = false;
			state.isError = true;
		});
	},
});
export const appointmentsActions = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
