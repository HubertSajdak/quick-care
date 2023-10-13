import { Wrapper } from "./DashboardLayout.styled";

import { useState } from "react";
import { MobileSidebarWrapper, DesktopSidebarWrapper } from "./components/Sidebar/Sidebar.styled";
import { SidebarLinksProps } from "./components/SidebarItem/SidebarItem";
import { Box } from "@mui/material";
import Breadcrumbs, { BreadcrumbsProps } from "./components/Breadcrumbs/Breadcrumbs";
import Navbar, { NavbarProps } from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

export interface DashboardLayoutProps {
	sidebarLinks: SidebarLinksProps[];
	breadcrumbs: BreadcrumbsProps[];
	img: React.ReactNode;
	userInfo: NavbarProps["userInfo"];
	children: React.ReactNode;
}
const DashboardLayout = ({ sidebarLinks, breadcrumbs, img, userInfo, children }: DashboardLayoutProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<Wrapper>
			<main className="dashboard">
				<DesktopSidebarWrapper>
					<Sidebar links={sidebarLinks} isSidebarOpen={isSidebarOpen} img={img} />
				</DesktopSidebarWrapper>
				<MobileSidebarWrapper open={isSidebarOpen} onClose={toggleSidebar} variant="temporary">
					<Sidebar links={sidebarLinks} isSidebarOpen={isSidebarOpen} img={img} />
				</MobileSidebarWrapper>
				<div>
					<Navbar isSidebarOpen={isSidebarOpen} openSidebarHandler={toggleSidebar} userInfo={userInfo} />
					<Breadcrumbs breadcrumbs={breadcrumbs} />
					<Box sx={{ width: "100%", margin: "0 auto", padding: "2rem 1rem" }}>{children}</Box>
				</div>
			</main>
		</Wrapper>
	);
};

export default DashboardLayout;
