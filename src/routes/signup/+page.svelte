<script>
    import logo from "../../lib/assets/google.png";
    import companyLogo from "../../lib/assets/company-logo.svg";
    import { enhance } from "$app/forms";
    import { supabase } from "$lib/supabaseClient.js";

    const signInWithProvider = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        if (error) {
            console.error("Error signing in with OAuth:", error);
        } else {
            console.log("Successfully signed in with OAuth:", data);
    
        }
    };

    const submitSocialLogin = async ({ action, cancel }) => {
        switch (action.searchParams.get("provider")) {
            case "google":
                await signInWithProvider("google");
                break;
        }
        cancel();
    };

</script>

<img class="llLogo" alt="Lift Legal Logo" src={companyLogo} />
<div class="sign-in-wrapper">
    <div class="sign-in-content">
            <h1>Client Directory Dashboard</h1>
        <form
            class="auth-form"
            method="post"
            action="?/signup"
            use:enhance={submitSocialLogin}
        >
            <button
                class="btn-auth"
                type="submit"
                formaction="?/signup&provider=google"
            >
                <img
                    alt="Google Logo"
                    src={logo}
                    style="vertical-align: middle; margin-right: 10px; "
                /> Sign in with Google
            </button>
        </form>
    </div>
</div>

<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
    }

    a {
        text-decoration: none;
    }

    .llLogo {
        display: flex;
        margin: 0 auto;
        margin-bottom: 15px;
    }

    img {
        background-color: #fff;
        padding: 5px;
        margin-top: -3px;
        border-radius: 100px;
    }

    form {
        margin-top: 30px !important;
    }
    .sign-in-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: rgba(232, 233, 235, 0.6);
    }

    .sign-in-content {
        margin-bottom: 600px;
       background-color: rgb(255, 255, 255);
       padding:4em;
       border-radius: 5px;
       box-shadow: 0px 4px 8px rgba(74, 74, 75, 0.2);
       
    }

    h1 {
        font-weight:400;
        margin-top: -50px;
        color: #333;
        font-size: 26px;
        text-align: center;
        padding: 20px;
        padding-bottom:12px;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .btn-auth {
        width: 260px;
        padding:10px;
        border: none;
        border-radius: 5px;
        background-color: #0073b1;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        font-weight: 400;
    }

    .btn-auth:hover {
        background-color: #000000;
    }
</style>
