import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import appointmentsSlice from "features/appointments/appointmentsSlice";
import authSlice from "features/auth/authSlice";
import clinicAffiliationsSlice from "features/clinicAffiliations/clinicAffiliationsSlice";
import clinicsSlice from "features/clinics/clinicsSlice";
import doctorsSlice from "features/doctors/doctorsSlice";
import patientsSlice from "features/patients/patientsSlice";
import specializationsSlice from "features/specializations/specializationsSlice";
import userSlice from "features/user/userSlice";

export const store = configureStore({
	reducer: {
		auth: authSlice,
		user: userSlice,
		doctors: doctorsSlice,
		patients: patientsSlice,
		specializations: specializationsSlice,
		clinics: clinicsSlice,
		clinicAffiliations: clinicAffiliationsSlice,
		appointments: appointmentsSlice,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
