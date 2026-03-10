import { LoginContext } from "@/contexts/login";
import { useContext } from "react";

export const useLoginData = () => {
	return useContext(LoginContext);
};
