import { Box } from "@mui/material";
import { useAppSelector } from "app/hooks";
import SpecializationBadge from "../SpecializationBadge/SpecializationBadge";

const SpecializationSection = () => {
	const doctorSpecializations = useAppSelector(state => state.doctors.singleDoctorData.data?.DoctorSpecialization);
	return (
		<Box
			width="100%"
			display="flex"
			padding={{ xs: 0, md: 3 }}
			flexWrap="wrap"
			justifyContent={{ xs: "center", md: "space-around", lg: "normal" }}
			gap={"8px"}>
			{doctorSpecializations?.map((spec: any) => {
				return <SpecializationBadge key={spec._id} specializationKey={spec.Specialization.specializationKey} />;
			})}
		</Box>
	);
};

export default SpecializationSection;
