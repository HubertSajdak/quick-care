import { Box, Paper } from "@mui/material";
import { useAppSelector } from "app/hooks";
import ClinicInfoCard from "components/ClinicInfoCard/ClinicInfoCard";

const ClinicAffiliationsSection = () => {
	const doctorClinicAffiliations = useAppSelector(state => state.clinicAffiliations.singleDoctorClinicAffiliations);
	return (
		<Box display="flex" flexWrap="wrap" gap={2} justifyContent={{ xs: "center", md: "flex-start" }}>
			{doctorClinicAffiliations?.map(clinicAffiliation => {
				return (
					<Paper
						key={clinicAffiliation._id}
						elevation={3}
						sx={{
							width: "100%",
							maxWidth: "260px",
							borderTop: 5,
							borderColor: "primary.main",
							borderRadius: "8px 8px 0 0",
						}}>
						<ClinicInfoCard
							renderButton={false}
							phoneNumber={clinicAffiliation.clinicInfo.phoneNumber}
							address={clinicAffiliation.clinicInfo.address}
							clinicName={clinicAffiliation.clinicName}
							workingTime={clinicAffiliation.workingHours}
						/>
					</Paper>
				);
			})}
		</Box>
	);
};

export default ClinicAffiliationsSection;
