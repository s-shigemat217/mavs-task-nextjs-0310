"use client";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useEffect,
	useState,
} from "react";
import { LoginResponse } from "../types/Login/LoginResponse";

const LOGIN_DATA_STORAGE_KEY = "login-data";

export const LoginContext = createContext<{
	loginData: LoginResponse | undefined;
	setLoginData: Dispatch<SetStateAction<LoginResponse | undefined>>;
	isLoginDataLoaded: boolean;
}>({
	loginData: undefined,
	setLoginData: () => {},
	isLoginDataLoaded: false,
});

export const LoginProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [loginData, setLoginDataState] = useState<LoginResponse | undefined>(
		undefined,
	);
	const [isLoginDataLoaded, setIsLoginDataLoaded] = useState(false);

	useEffect(() => {
		const storedLoginData = localStorage.getItem(LOGIN_DATA_STORAGE_KEY);
		if (!storedLoginData) {
			setIsLoginDataLoaded(true);
			return;
		}

		try {
			setLoginDataState(JSON.parse(storedLoginData) as LoginResponse);
		} catch {
			localStorage.removeItem(LOGIN_DATA_STORAGE_KEY);
		} finally {
			setIsLoginDataLoaded(true);
		}
	}, []);

	const setLoginData: Dispatch<SetStateAction<LoginResponse | undefined>> = (
		value,
	) => {
		setLoginDataState((previousValue) => {
			const nextValue =
				typeof value === "function"
					? (
							value as (
								previous: LoginResponse | undefined,
							) => LoginResponse | undefined
						)(previousValue)
					: value;

			if (nextValue) {
				localStorage.setItem(LOGIN_DATA_STORAGE_KEY, JSON.stringify(nextValue));
			} else {
				localStorage.removeItem(LOGIN_DATA_STORAGE_KEY);
			}

			return nextValue;
		});
	};

	return (
		<LoginContext.Provider
			value={{ loginData, setLoginData, isLoginDataLoaded }}
		>
			{children}
		</LoginContext.Provider>
	);
};
