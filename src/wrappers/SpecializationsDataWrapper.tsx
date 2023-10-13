import { useAppDispatch } from "app/hooks";
import { getAllSpecializations } from "features/specializations/specializationsSlice";
import { useEffect } from "react";

const SpecializationDataWrapper = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(getAllSpecializations());
	}, [dispatch]);
	return <>{children}</>;
};

export default SpecializationDataWrapper;
