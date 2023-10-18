export interface RequestLoginCredentials {
	email: string;
	password: string;
}
export interface SuccessfulReqMsg {
	message: string;
}

export interface FailedReqMsg {
	message: string;
	error?: any;
}
export interface AbsenceTimeValues {
	from: Date | string;
	to: Date | string;
}
export interface Tokens {
	accessToken: string;
	refreshToken: string;
}
export interface AddressValues {
	street: string;
	city: string;
	postalCode: string;
}

export interface ReqeustRegisterPatientCredentials {
	name: string;
	surname: string;
	phoneNumber: number;
	email: string;
	password: string;
	address: AddressValues;
}
export interface ReqeustRegisterDoctorCredentials {
	name: string;
	surname: string;
	email: string;
	password: string;
}
export interface DoctorResponse {
	_id: string;
	name: string;
	surname: string;
	email: string;
	professionalStatement: string | null;
	photo: string | null;
	role: "patient" | "doctor" | "admin";
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
		| []
		| null
		| undefined;
}
export interface DoctorSpecializationsResponse {
	_id: string;
	specializationId: string;
	doctorId: string;
}
export interface PatientResponse {
	_id: string;
	name: string;
	surname: string;
	email: string;
	phoneNumber: number;
	address: AddressValues;
	photo: string | null;
	role: "patient" | "doctor" | "admin";
}
export interface SpecializationsResponse {
	specializations: {
		_id: string;
		specializationKey: string;
	}[];
	totalItems: number;
}
export interface ClinicResponse {
	_id: string;
	clinicName: string;
	address: AddressValues;
	phoneNumber: number;
	workingTime: {
		weekDay: string;
		startTime: string;
		stopTime: string;
	}[];
	photo?: string;
}
export interface ClinicAffiliationsResponse {
	_id: string;
	doctorId: string;
	clinicId: string;
	clinicName: string;
	workingHours: {
		weekDay: string;
		startTime: string;
		stopTime: string;
	}[];
	available: boolean;
	absenceTime: AbsenceTimeValues;
	reasonOfAbsence: string;
	consultationFee: number;
	timePerPatient: number;
}
export interface AppointmentResponse {
	_id: string;
	patientId: string;
	doctorId: string;
	clinicId: string;
	clinicAffiliationId: string;
	appointmentDate: string;
	consultationFee: number | string;
	appointmentAddress: AddressValues;
	appointmentStatus: "active" | "canceled" | "postponed" | "completed";
	doctorInfo: {
		name: string;
		surname: string;
		photo: string;
		_id: string;
	};
	clinicInfo: {
		_id: string;
		clinicName: string;
		photo: string;
	};
	createdAt?: Date;
	updatedAt?: Date;
}
