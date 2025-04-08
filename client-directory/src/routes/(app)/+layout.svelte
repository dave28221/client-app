<script>
    import companyLogo from "../../lib/assets/company-logo.svg";
    import { Circle } from "svelte-loading-spinners";
    import { invalidateAll } from "$app/navigation";
    import { supabase } from "$lib/supabaseClient.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import "carbon-components-svelte/css/white.css";

    let subscription;
    let isAuthenticated = false;
    let isLoading = true;

    async function googleSignOut() {
        await supabase.auth.signOut();
        goto("/signup");
    }

    onMount(() => {
        subscription = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state change detected");
            isAuthenticated = session !== null;
            invalidateAll();
            isLoading = false; // Update isLoading once authentication state is determined

            if (!isAuthenticated) {
                goto("/signup");
            }
        });

        return () => {
            if (
                subscription &&
                typeof subscription.unsubscribe === "function"
            ) {
                subscription.unsubscribe();
            }
        };
    });
</script>

{#if isLoading}
    <div class="loading">
        <h4 class="loadingText">Loading...</h4>
        <Circle size="60" color="#0073b1" unit="px" duration="1s" />
    </div>
{:else if isAuthenticated}
    <nav class="theNav">
        <div class="flexNav">
            <a href="/">
                <img class="llLogo" alt="lift Legal Logo" src={companyLogo} />
            </a>
            <button class="logOut" on:click={googleSignOut}>Sign Out</button>
        </div>
    </nav>
    <div class="container">
        <div class="sideMenu">
            <ul>
                <li>
                    <a href="/lawfirms">
                        <span class="iconWrapper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.4em"
                                height="1.4em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="black"
                                    d="M3 21v-9H1V9l11-7 11 7v3h-2v9h-4v-6h-2v6h-4v-6H9v6H3zm2-2h2v-4h4v4h2v-4h4v4h2v-7h2v-1.2L12 4 3 10.8V12h2v7z"
                                />
                            </svg>
                        </span>
                        <span>Law Firms</span>
                    </a>
                </li>
                <li>
                    <a href="/lawyers">
                        <span class="iconWrapper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.4em"
                                height="1.4em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="black"
                                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"
                                />
                            </svg>
                        </span>
                        <span>Lawyers</span>
                    </a>
                </li>
                <li>
                    <a href="/websites">
                        <span class="iconWrapper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.4em"
                                height="1.4em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="black"
                                    d="M3 4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H3zm0 2h18v2H3V6zm0 4h8v8H3v-8zm10 0h8v8h-8v-8z"
                                />
                            </svg>
                        </span>
                        <span>Websites</span>
                    </a>
                </li>
                <li>
                    <a href="/upload">
                        <span class="iconWrapper">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.4em"
                                height="1.4em"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="black"
                                    d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4v-6h3l-5-5z"
                                />
                            </svg>
                        </span>
                        <span>Upload CSV</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="content">
            <slot />
        </div>
    </div>
{:else}
    <nav class="theNav">
        <div class="flexNav">
            <a href="/">
                <img class="llLogo" alt="lift Legal Logo" src={companyLogo} />
            </a>
            <a href="/signup" class="logOut">Sign In</a>
        </div>
    </nav>
    <div class="message">
        <h4 class="logInText">
            Please <a class="logIn" href="/signup">Sign in</a> to access this page.
        </h4>
    </div>
{/if}

<style>
    @import "global.css";

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
    }

    .loadingText {
        margin-bottom: 20px;
    }

    .loading h4 {
        margin: 0;
        font-size: 18px;
    }

    .logIn {
        text-decoration: underline;
    }

    .message {
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(74, 74, 75, 0.2);
        margin-top: 80px !important;
        margin: 20px;
        width: 500px;
        margin: 0 auto;
        padding: 50px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
        text-align: center;
    }

    .flexNav {
        display: flex;
        justify-content: space-between;
        align-items: center; /* Align items vertically at the center */
        padding: 0 20px; /* Optional: Add some padding for better spacing */
    }

    .llLogo {
        margin: 0;
        margin-top: -15px;
        margin-bottom: -18px;
    }

    .logOut {
        margin: 0;
        margin-right: 20px;
        margin-top: -3px;
        padding: 12px;
        background-color: #292828;
        color: #ffffff;
        border-radius: 5px;
        border: none;
        font-size: 16px;
    }

    .container {
        display: flex;
    }

    .sideMenu {
        width: 250px;
        padding: 20px;
        border-radius: 0px 0px 10px 0px;
        height: 100vh;
        margin-top: -2px;
    }

    .sideMenu ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 16px;
    }

    .sideMenu ul li:hover {
        background-color: rgb(97, 97, 255);
        border-radius: 5px;
    }

    .sideMenu li {
        margin-bottom: 10px;
        padding: 5px;
    }

    .sideMenu li a {
        text-decoration: none;
        display: flex;
        align-items: center;
    }

    .sideMenu li a:hover {
        color: rgb(255, 255, 255);
    }

    .iconWrapper {
        margin-right: 15px;
    }

    .theNav {
        height: 75px;
        padding-top: 20px;
        border-bottom: 1px solid rgb(222, 218, 218);
    }

    .content {
        flex: 1;
        border-left: 1px solid rgb(222, 218, 218);
    }

    @media screen and (max-width: 865px) {
        .container {
            flex-direction: column;
        }

        .sideMenu {
            order: 1;
            width: 100%;
            border-radius: 0;
            height: auto;
            padding: 20px 0;
            margin-top: 0;
            border-bottom: 1px solid rgb(222, 218, 218);
        }

        .content {
            order: 2;
            border-left: none;
        }
    }
</style>
