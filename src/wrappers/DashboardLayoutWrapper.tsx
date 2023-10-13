import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import { ReactComponent as Logo } from "images/logo.svg";
import { useAppSelector } from "app/hooks";
import { BreadcrumbsProps } from "layouts/DashboardLayout/components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";
import { SidebarLinksProps } from "layouts/DashboardLayout/components/SidebarItem/SidebarItem";
import DashboardLayout from "layouts/DashboardLayout/DashboardLayout";
import { decodeToken } from "react-jwt";
import { getTokenFromLocalStorage } from "utils/localStorage/localStorage";
import { DecodedToken } from "routes/PrivateRoute";
import { BASE_URL } from "utils/axios/axios";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
export interface DashboardLayoutWrapperProps {
	children: React.ReactNode;
	breadcrumbs: BreadcrumbsProps[];
}

const DashboardLayoutWrapper = ({ children, breadcrumbs }: DashboardLayoutWrapperProps) => {
	const { t } = useTranslation("translation");
	const { name, surname, photo } = useAppSelector(state => state.user);
	const accessToken = getTokenFromLocalStorage();
	const decodedToken = decodeToken<DecodedToken["accessToken"]>(accessToken);
	const role = decodedToken!.role;
	const sidebarPatientLinks: SidebarLinksProps[] = [
		{
			variant: "base",
			text: t("sidebar.start"),
			path: "/start",
			icon: <PlayArrowIcon />,
		},
		{
			variant: "submenu",
			text: t("sidebar.doctors"),
			icon: <GroupIcon />,
			sublinks: [
				{
					text: t("sidebar.allDoctors"),
					path: "/allDoctors",
					subIcon: <GroupsIcon />,
				},
			],
		},
		{
			variant: "submenu",
			text: t("sidebar.appointment"),
			icon: <BookmarkIcon />,
			sublinks: [
				{
					text: t("sidebar.makeAppointment"),
					path: "/makeAppointment",
					subIcon: <BookmarkAddIcon />,
				},
				{
					text: t("sidebar.myAppointments"),
					path: "/myAppointments",
					subIcon: <BookmarksIcon />,
				},
			],
		},
		{
			variant: "submenu",
			text: t("sidebar.settings"),
			icon: <SettingsIcon />,
			sublinks: [
				{
					text: t("sidebar.accountManagement"),
					path: "/accountManagement",
					subIcon: <PersonIcon />,
				},
			],
		},
	];
	const sidebarDoctorLinks: SidebarLinksProps[] = [
		{
			variant: "base",
			text: t("sidebar.start"),
			path: "/start",
			icon: <PlayArrowIcon />,
		},
		{
			variant: "submenu",
			text: t("sidebar.patients"),
			icon: <GroupIcon />,
			sublinks: [
				{
					text: t("sidebar.allPatients"),
					path: "/allPatients",
					subIcon: <GroupsIcon />,
				},
				{
					text: t("sidebar.addPatient"),
					path: "/addPatient",
					subIcon: <PersonAddIcon />,
				},
			],
		},
		{
			variant: "submenu",
			text: t("sidebar.specializations"),
			icon: <MedicalInformationIcon />,
			sublinks: [
				{
					text: t("sidebar.mySpecializations"),
					path: "/mySpecializations",
					subIcon: <MedicalServicesIcon />,
				},
			],
		},
		{
			variant: "base",
			path: "/userClinicAffiliations",
			text: t("sidebar.clinicAffiliation"),
			icon: <MeetingRoomIcon />,
		},
		{
			variant: "submenu",
			text: t("sidebar.clinics"),
			icon: <LocalHospitalIcon />,
			sublinks: [
				{
					text: t("sidebar.addClinic"),
					path: "/addClinic",
					subIcon: <DomainAddIcon />,
				},
				{
					text: t("sidebar.clinics"),
					path: "/allClinics",
					subIcon: <CorporateFareIcon />,
				},
			],
		},
		{
			variant: "submenu",
			text: t("sidebar.settings"),
			icon: <SettingsIcon />,
			sublinks: [
				{
					text: t("sidebar.accountManagement"),
					path: "/accountManagement",
					subIcon: <PersonIcon />,
				},
			],
		},
	];
	return (
		<DashboardLayout
			sidebarLinks={role === "patient" ? sidebarPatientLinks : sidebarDoctorLinks}
			breadcrumbs={breadcrumbs}
			img={<Logo width={200} height={50} />}
			userInfo={{ name, surname, avatar: photo ? `${BASE_URL}${photo}` : undefined }}
			children={children}
		/>
	);
};

export default DashboardLayoutWrapper;
