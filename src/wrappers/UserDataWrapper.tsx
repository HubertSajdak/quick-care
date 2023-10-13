import { useAppDispatch } from "app/hooks";
import { getUserData } from "features/user/userSlice";
import { useEffect } from "react";

const UserDataWrapper = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(getUserData());
	}, [dispatch]);
	return <>{children}</>;
};

export default UserDataWrapper;
