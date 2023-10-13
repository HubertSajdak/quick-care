import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
const Wrapper = styled.div`
	a {
		color: ${({ theme }) => theme.palette.grey[700]};
	}
`;
export interface BreadcrumbsProps {
	label: string;
	to?: string;
	noTranslation?: boolean;
}
const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: BreadcrumbsProps[] }) => {
	const { t } = useTranslation();
	return (
		<Wrapper role="presentation" style={{ padding: "1rem" }}>
			<MuiBreadcrumbs aria-label="breadcrumb">
				{breadcrumbs.map((item, index) => {
					if (item.to) {
						return (
							<Link key={index} to={`/${item.to}`}>
								{t(`sidebar.${item.label}`)}
							</Link>
						);
					} else {
						return (
							<Typography key={index} color="primary.light" fontWeight={500} sx={{ cursor: "default" }}>
								{!item.noTranslation ? t(`sidebar.${item.label}`) : item.label}
							</Typography>
						);
					}
				})}
			</MuiBreadcrumbs>
		</Wrapper>
	);
};

export default Breadcrumbs;
