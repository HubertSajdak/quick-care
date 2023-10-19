import { AddressValues } from "types/api-types";

// export interface DoctorClinicAffiliationsResponse extends ClinicAffiliationsResponse {

// 	doctorClinicAffiliations: {
// 		clinicInfo: {
// 			workingHours: {
// 				weekDay: string;
// 				startTime: string;
// 				stopTime: string;
// 			};
// 			address: AddressValues;
// 		};
// 	};
// }
export const mapDayNamesToNumbers = (weekDay: string): number | undefined => {
	if (weekDay === "monday") return 1;
	if (weekDay === "tuesday") return 2;
	if (weekDay === "wednesday") return 3;
	if (weekDay === "thursday") return 4;
	if (weekDay === "friday") return 5;
	if (weekDay === "saturday") return 6;
	if (weekDay === "sunday") return 0;
};
export const mapMonthsToNumbers = (month: string): number | undefined => {
	if (month === "January") return 0;
	if (month === "February") return 1;
	if (month === "March") return 2;
	if (month === "April") return 3;
	if (month === "May") return 4;
	if (month === "June") return 5;
	if (month === "July") return 6;
	if (month === "August") return 7;
	if (month === "September") return 8;
	if (month === "October") return 9;
	if (month === "November") return 10;
	if (month === "December") return 11;
};

// export const disableWeekday = (date: Date, doctorClinicAffiliations: DoctorClinicAffiliationsResponse[] | null) => {
// 	const day = new Date(date).getDay();
// 	const allClinicAffiliations = doctorClinicAffiliations
// 		?.map(clinicAffiliation => clinicAffiliation.workingHours)
// 		?.flat(1);
// 	const disabledDays = allClinicAffiliations?.map(el => {
// 		if (!el.startTime && !el.stopTime) {
// 			return mapDayNamesToNumbers(el.weekDay);
// 		}
// 		return null;
// 	});
// 	if (disabledDays) {
// 		return !disabledDays.includes(day);
// 	}
// 	return true;
// };
