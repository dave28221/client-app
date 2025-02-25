<script>
    import { supabase } from "../../../lib/supabaseClient";
    import { invalidateAll } from "$app/navigation";
    import * as yup from "yup";

    let errors = {};
    let hideFormMessage = true;

    const schema = yup.object().shape({
        firstname: yup.string().required("First Name is required"),
        lastname: yup.string().required("Last Name is required"),
        email: yup
            .string()
            .email("Invalid email format")
            .required("Email is required"),
        phone: yup.string().required("Phone number is required"),
        position: yup.string().required("Position is required"),
        accountemail: yup
            .string()
            .email("Invalid email format")
            .required("Email is required"),
        accountphone: yup.string().required("Phone number is required"),
        addressline1: yup.string().required("Address is required"),
        suburb: yup.string().required("Suburb is required"),
        state: yup.string().required("State/Region is required"), // Updated field name to stateregion
        country: yup.string().required("Country is required"),
        website: yup
            .string()
            .url("Invalid URL format")
            .required("URL is required"),
    });

    async function submitForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const formValues = {};
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }

        try {
            await schema.validate(formValues, { abortEarly: false });
            errors = {};

            const { data, error } = await supabase
                .from("lawyerscontactprofiles")
                .insert([formValues]);

            if (error) {
                if (error.code === "23505" && error.message.includes("email")) {
                    errors.email = "Email already exists";
                } else {
                    console.error("Error inserting data:", error.message);
                }
            } else {
                event.target.reset();
                invalidateAll("/lawyers");
                hideFormMessage = false;
            }
        } catch (err) {
            console.error("Validation Error:", err);
            errors = getErrors(err);
        }
    }

    function getErrors(err) {
        return err.inner.reduce((acc, err) => {
            return { ...acc, [err.path]: err.message };
        }, {});
    }
</script>

<div class="flexLawSearch">
    <h1 class="leftAlign">New Lawyer Details</h1>
    <div class="searchAndAdd"></div>
</div>

{#if hideFormMessage}
    <form on:submit={submitForm} method="POST">
        <div class="form-grid">
            <div class="form-group">
                <label>
                    First Name
                    <input
                        name="firstname"
                        type="text"
                        placeholder="Enter first name"
                    />
                    {#if errors.firstname}<span class="error"
                            >{errors.firstname}</span
                        >{/if}
                </label>
                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                    />
                    {#if errors.email}<span class="error">{errors.email}</span
                        >{/if}
                </label>
                <label>
                    Position
                    <input
                        name="position"
                        type="text"
                        placeholder="Job title"
                    />
                    {#if errors.position}<span class="error"
                            >{errors.position}</span
                        >{/if}
                </label>
                <label>
                    Account Email
                    <input
                        name="accountemail"
                        type="email"
                        placeholder="email@example.com"
                    />
                    {#if errors.accountemail}<span class="error"
                            >{errors.accountemail}</span
                        >{/if}
                </label>
                <label>
                    Address
                    <input
                        name="addressline1"
                        type="text"
                        placeholder="Firm address"
                    />
                    {#if errors.addressline1}<span class="error"
                            >{errors.addressline1}</span
                        >{/if}
                </label>
                <label>
                    State/Region
                    <input
                        name="state"
                        type="text"
                        placeholder="NSW, WA etc.."
                    />
                    {#if errors.state}<span class="error">{errors.state}</span
                        >{/if}
                </label>
            </div>
            <div class="form-group">
                <label>
                    Last Name
                    <input
                        name="lastname"
                        type="text"
                        placeholder="Enter last name"
                    />
                    {#if errors.lastname}<span class="error"
                            >{errors.lastname}</span
                        >{/if}
                </label>
                <label>
                    Website URL
                    <input
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                    />
                    {#if errors.website}<span class="error"
                            >{errors.website}</span
                        >{/if}
                </label>
                <label>
                    Phone
                    <input
                        name="phone"
                        type="tel"
                        placeholder="Enter phone number"
                    />
                    {#if errors.phone}<span class="error">{errors.phone}</span
                        >{/if}
                </label>
                <label>
                    Account Phone
                    <input
                        name="accountphone"
                        type="tel"
                        placeholder="Enter account phone number"
                    />
                    {#if errors.accountphone}<span class="error"
                            >{errors.accountphone}</span
                        >{/if}
                </label>
                <label>
                    Suburb
                    <input
                        name="suburb"
                        type="text"
                        placeholder="Enter suburb"
                    />
                    {#if errors.suburb}<span class="error">{errors.suburb}</span
                        >{/if}
                </label>
                <label>
                    Country
                    <input
                        name="country"
                        type="text"
                        placeholder="Australia, UK, US"
                    />
                    {#if errors.country}<span class="error"
                            >{errors.country}</span
                        >{/if}
                </label>
            </div>
        </div>
        <button class="defaultBlue" type="submit">Submit</button>
    </form>
{:else}
    <div id="successMessage" class="success-message">
        <p>Form has been successfully submitted</p>
    </div>
{/if}

<style>
    label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .flexLawSearch {
        padding: 30px;
        display: flex;
        justify-content: space-between;
        background-color: rgb(97, 97, 255);
        color: white;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px; /* Adjust spacing between columns */
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
    }

    button[type="submit"],
    .defaultBlue {
        display: grid;
        margin: 0 auto !important;
        width: 150px;
        background-color: rgb(97, 97, 255);
        color: #ffffff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        grid-column: span 2; /* Make the button span both columns */
    }

    button[type="submit"]:hover,
    .defaultBlue:hover {
        background-color: #292828;
    }

    .success-message {
        background-color: #ffffff;
        margin: 0 auto;
        margin-top: 50px !important;
        padding: 40px;
        width: 50%;
        text-align: center;
        font-size: 18px;
        margin-top: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    form {
        max-width: 45%;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    form input[type="text"],
    input[type="url"],
    input[type="tel"],
    input[type="email"] {
        margin-top: 3px;
        width: 100%;
        padding: 10px;
        margin-bottom: 25px;
        border: 1px solid #ccc;
        background: #f2f2f2;
        border-radius: 5px;
        font-size: 16px;
    }

    button[type="submit"],
    .defaultBlue {
        background-color: rgb(97, 97, 255);
        color: #ffffff;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    button[type="submit"]:hover,
    .defaultBlue:hover {
        background-color: #292828;
    }
    .error {
        color: red;
        font-size: 12px;
        margin-top: -20px !important;
        margin-bottom: 13px;
        display: block;
    }
</style>
