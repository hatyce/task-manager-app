import { LoginFormData } from "@/app/validationSchema";
import { useAuthStore } from "@/lib/use-auth-store";
import { useRouter } from "next/navigation";

interface UseAuthLogin {
	isLoading: boolean;
	login: (data: LoginFormData) => Promise<string | null>;
}

type MockResponse = {
	ok: boolean;
	status: number;
	json: () => Promise<{ data?: { user: { id: string; email: string } }; error?: string }>;
};

const MOCK_USERS = [
	{ email: "demo@example.com", password: "Pas123??", id: "user-1" }
];

export function useAuthLogin(): UseAuthLogin {
	const { setUser, setLoading, isLoading } = useAuthStore();
	const router = useRouter();

	const mockLogin = async (data: LoginFormData): Promise<MockResponse> => {
		const match = MOCK_USERS.find(
			(user) => user.email === data.email && user.password === data.password
		);

		if (!match) {
			return {
				ok: false,
				status: 401,
				json: async () => ({ error: "Invalid credentials" })
			};
		}

		return {
			ok: true,
			status: 200,
			json: async () => ({
				data: {
					user: {
						id: match.id,
						email: match.email
					}
				}
			})
		};
	};

	const login = async (data: LoginFormData): Promise<string | null> => {
		try {
			setLoading(true);

			const response =
				process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true"
					? await mockLogin(data)
					: await fetch("/api/auth/login", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data)
						});

			const payload = await response.json();

			if (!response.ok) {
				return payload?.error ?? "Failed to login";
			}

			if (!payload?.data?.user) {
				return "Login response missing user payload";
			}

			setUser(payload.data.user);
			router.push("/");
			return null;
		} catch (error) {
			return error instanceof Error ? error.message : "Failed to login";
		} finally {
			setLoading(false);
		}
	};

	return { isLoading, login };
}

