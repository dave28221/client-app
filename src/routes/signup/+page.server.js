import { AuthApiError } from "@supabase/supabase-js";
import { fail, redirect } from "@sveltejs/kit";

const OAUTH_PROVIDERS = ["google"];

export const actions = {
    login: async ({ request, locals, url }) => {
        const provider = url.searchParams.get("provider");

        if (provider) {
            if (!OAUTH_PROVIDERS.includes(provider)) {
                return fail(400, {
                    error: "Provider not supported."
                });
            }
            const { data, error: err } = await locals.sb.auth.signInWithOAuth({
                provider: provider
            });

            if (err) {
                console.log(err);
                return fail(400, {
                    message: "Something went wrong."
                });
            }

            throw redirect(303, data.url);
        }

        const body = Object.fromEntries(await request.formData());

        const { data, error: err } = await locals.sb.auth.signInWithPassword({
            email: body.email,
            password: body.password
        });

        if (err) {
            if (err instanceof AuthApiError && err.status === 400) {
                return fail(400, {
                    error: "Invalid credentials"
                });
            }
            return fail(500, {
                message: "Server error. Try again later."
            });
        }

        throw redirect(303, "/");
    }
};
