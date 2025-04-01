<script>
	import { supabase } from "../../../lib/supabaseClient";
	import { invalidateAll } from "$app/navigation";
	import * as yup from "yup";

	const schema = yup.object().shape({
		lawfirmname: yup.string().required("Name is required"),
		websiteurl: yup
			.string()
			.url("Invalid URL format")
			.required("URL is required"),
		clientstatus: yup
			.string()
			.oneOf(["Yes", "No"], "Please select Yes or No")
			.required("Client status is required"),
		phonenumber: yup.string().required("Phone number is required"),
		emailaddress: yup
			.string()
			.email("Invalid email format")
			.required("Email is required"),
		numberofemployees: yup
			.number()
			.integer("Number of employees must be an integer")
			.positive("Number of employees must be positive")
			.nullable(),
		city: yup.string().required("City is required"),
		stateregion: yup.string().required("State/Region is required"),
		country: yup.string().required("Country is required"),
		postalcode: yup.string().required("Postal code is required"),
		address1: yup.string().required("Address 1 is required"),
		address2: yup.string(),
		description: yup.string().required("Description is required"),
		websitedevelopment: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		websitehosting: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		websitemanagement: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		newsletters: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		searchengineoptimisation: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		socialmediamanagement: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		websiteperformance: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
		advertising: yup
			.string()
			.oneOf(["Yes", "No"])
			.required("Selection is required"),
	});

	let errors = {};
	let hideFormMessage = true;

	async function submitForm(event) {
		event.preventDefault();

		const formData = new FormData(event.target);

		const lawfirmData = {
			lawfirmname: formData.get("name") || "",
			clientstatus: formData.get("client") || "",
			websiteurl: formData.get("url") || "",
			address1: formData.get("address1") || "",
			address2: formData.get("address2") || "",
			city: formData.get("city") || "",
			stateregion: formData.get("state") || "",
			postalcode: formData.get("postalCode") || "",
			country: formData.get("country") || "",
			phonenumber: formData.get("phone") || "",
			emailaddress: formData.get("email") || "",
			description: formData.get("description") || "",
			numberofemployees: formData.get("employees")
				? parseInt(formData.get("employees"), 10)
				: null,
		};

		const productsData = {
			websitedevelopment: formData.get("websitedevelopment") || "",
			websitehosting: formData.get("websitehosting") || "",
			websitemanagement: formData.get("websitemanagement") || "",
			newsletters: formData.get("newsletters") || "",
			searchengineoptimisation:
				formData.get("searchengineoptimisation") || "",
			socialmediamanagement: formData.get("socialmediamanagement") || "",
			websiteperformance: formData.get("websiteperformance") || "",
			advertising: formData.get("advertising") || "",
		};

		try {
			await schema.validate(
				{ ...lawfirmData, ...productsData },
				{ abortEarly: false },
			);
			errors = {};

			// Insert law firm data
			const { data: lawfirmInsertedData, error: lawfirmError } =
				await supabase
					.from("lawfirm")
					.insert([lawfirmData])
					.select()
					.single();

			if (lawfirmError) throw new Error(lawfirmError.message);

			// Use the correct column name that exists in `products`
			const lawfirmId = lawfirmInsertedData.lawfirmname;

			const productsDataWithLawfirm = {
				...productsData,
				lawfirmname: lawfirmId, // Changed from "lawfirm" to "lawfirmname"
			};

			// Insert product data
			const { error: productsError } = await supabase
				.from("products")
				.insert([productsDataWithLawfirm]);

			if (productsError) throw new Error(productsError.message);

			event.target.reset();
			invalidateAll("/lawfirms");
			hideFormMessage = false;
		} catch (err) {
			console.error("Form submission error:", err);
			errors = getErrors(err);
		}
	}

	function getErrors(err) {
		if (err.inner && Array.isArray(err.inner)) {
			return err.inner.reduce((acc, error) => {
				if (error.path) {
					acc[error.path] = error.message;
				}
				return acc;
			}, {});
		}
		return { general: "An unknown error occurred. Please try again." };
	}
</script>

<div class="flexLawSearch">
	<h1 class="leftAlign">New Law Firm Details</h1>
	<div class="searchAndAdd"></div>
</div>

{#if hideFormMessage}
	<form on:submit={submitForm} method="POST">
		<label>
			Law Firm Name
			<input name="name" type="text" placeholder="Enter law firm name" />
			{#if errors.lawfirmname}
				<span class="error">{errors.lawfirmname}</span>
			{/if}
		</label>

		<div class="address-fields">
			<label>
				URL
				<input
					name="url"
					type="url"
					placeholder="https://example.com"
				/>
				{#if errors.websiteurl}
					<span class="error">{errors.websiteurl}</span>
				{/if}
			</label>

			<label>
				Phone
				<input name="phone" type="tel" placeholder="(123) 456-7890" />
				{#if errors.phonenumber}
					<span class="error">{errors.phonenumber}</span>
				{/if}
			</label>
		</div>

		<label>
			Client:
			<div class="radio-group">
				<label>
					<input type="radio" name="client" value="Yes" /> Yes
				</label>
				<label>
					<input type="radio" name="client" value="No" /> No
				</label>
			</div>
			{#if errors.clientstatus}
				<span class="error">{errors.clientstatus}</span>
			{/if}
		</label>

		<div class="address-fields">
			<label>
				Email
				<input
					name="email"
					type="email"
					placeholder="email@example.com"
				/>
				{#if errors.emailaddress}
					<span class="error">{errors.emailaddress}</span>
				{/if}
			</label>

			<label>
				Number of Employees
				<input name="employees" type="number" placeholder="e.g., 50" />
				{#if errors.numberofemployees}
					<span class="error">{errors.numberofemployees}</span>
				{/if}
			</label>
		</div>

		<div class="address-fields">
			<label>
				Address 1
				<input
					name="address1"
					type="text"
					placeholder="Street address"
				/>
				{#if errors.address1}
					<span class="error">{errors.address1}</span>
				{/if}
			</label>

			<label>
				Address 2
				<input
					name="address2"
					type="text"
					placeholder="Apartment, suite, etc."
				/>
				{#if errors.address2}
					<span class="error">{errors.address2}</span>
				{/if}
			</label>

			<label>
				City
				<input name="city" type="text" placeholder="City name" />
				{#if errors.city}
					<span class="error">{errors.city}</span>
				{/if}
			</label>

			<label>
				State/Region
				<input name="state" type="text" placeholder="State or region" />
				{#if errors.stateregion}
					<span class="error">{errors.stateregion}</span>
				{/if}
			</label>

			<label>
				Country
				<input
					name="country"
					type="text"
					placeholder="Australia, UK, US"
				/>
				{#if errors.country}
					<span class="error">{errors.country}</span>
				{/if}
			</label>

			<label>
				Postal Code
				<input
					name="postalCode"
					type="text"
					placeholder="e.g., 12345"
				/>
				{#if errors.postalcode}
					<span class="error">{errors.postalcode}</span>
				{/if}
			</label>
		</div>

		<label>
			<span>Description</span>
			<textarea
				id="description"
				name="description"
				placeholder="Enter a brief description"
			></textarea>
			{#if errors.description}
				<span class="error">{errors.description}</span>
			{/if}
		</label>

		<fieldset>
			<legend>Additional Services</legend>
			<div class="address-fields">
				<label>
					Website Development:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="websitedevelopment"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="websitedevelopment"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.websitedevelopment}
						<span class="error">{errors.websitedevelopment}</span>
					{/if}
				</label>

				<label>
					Website Hosting:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="websitehosting"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="websitehosting"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.websitehosting}
						<span class="error">{errors.websitehosting}</span>
					{/if}
				</label>

				<label>
					Website Management:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="websitemanagement"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="websitemanagement"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.websitemanagement}
						<span class="error">{errors.websitemanagement}</span>
					{/if}
				</label>

				<label>
					Newsletters:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="newsletters"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input type="radio" name="newsletters" value="No" />
							No
						</label>
					</div>
					{#if errors.newsletters}
						<span class="error">{errors.newsletters}</span>
					{/if}
				</label>

				<label>
					Search Engine Optimization:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="searchengineoptimisation"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="searchengineoptimisation"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.searchengineoptimisation}
						<span class="error"
							>{errors.searchengineoptimisation}</span
						>
					{/if}
				</label>

				<label>
					Social Media Management:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="socialmediamanagement"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="socialmediamanagement"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.socialmediamanagement}
						<span class="error">{errors.socialmediamanagement}</span
						>
					{/if}
				</label>

				<label>
					Website Performance:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="websiteperformance"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input
								type="radio"
								name="websiteperformance"
								value="No"
							/> No
						</label>
					</div>
					{#if errors.websiteperformance}
						<span class="error">{errors.websiteperformance}</span>
					{/if}
				</label>

				<label>
					Advertising:
					<div class="radio-group">
						<label>
							<input
								type="radio"
								name="advertising"
								value="Yes"
							/> Yes
						</label>
						<label>
							<input type="radio" name="advertising" value="No" />
							No
						</label>
					</div>
					{#if errors.advertising}
						<span class="error">{errors.advertising}</span>
					{/if}
				</label>
			</div>
		</fieldset>

		<button type="submit">Submit</button>
	</form>
{:else}
	<div id="successMessage" class="success-message">
		<p>Form has been successfully submitted</p>
	</div>
{/if}

<style>
	.flexLawSearch {
		padding: 30px;
		display: flex;
		justify-content: space-between;
		background-color: rgb(97, 97, 255);
		color: white;
	}

	.formTitle {
		text-align: center;
		font-size: 32px;
		margin-bottom: 1rem;
		color: #4a90e2;
	}

	label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 10px;
		margin-top: 5px;
		border: 1px solid #ddd;
		border-radius: 5px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
		border-color: #4a90e2;
		outline: none;
	}

	textarea {
		resize: vertical;
		min-height: 120px;
	}

	button[type="submit"] {
		background: #4a90e2;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s;
	}

	button[type="submit"]:hover {
		background: #357abd;
	}

	.error {
		color: red;
		font-size: 0.875rem;
		margin-top: 5px;
	}

	fieldset {
		border: 1px solid #ddd;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 5px;
	}

	legend {
		font-weight: bold;
		color: #4a90e2;
		padding: 0 10px;
	}
	.address-fields {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem; /* Space below each label */
	}

	input {
		margin-top: 0.25rem;
		width: 100% !important; /* Full width for inputs */
		padding: 10px;
		border: 1px solid #ccc;
		background: #f2f2f2;
		border-radius: 5px;
		font-size: 16px;
	}

	input[type="radio"] {
		margin-right: 10px;
	}

	.error {
		color: red;
		font-size: 0.875rem;
		margin-top: 0.25rem; /* Space above the error message */
	}

	.success-message {
		background-color: #ffffff;
		margin: 0 auto;
		padding: 40px;
		width: 50%;
		text-align: center;
		font-size: 18px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.formTitle {
		text-align: center;
		margin-bottom: 20px;
		background-color: rgb(97, 97, 255);
		color: #ffffff;
		padding: 20px;
		border-radius: 5px;
	}

	textarea {
		resize: none;
		height: 130px;
		margin-bottom: 20px;
	}

	.radio-group {
		display: flex;
		gap: 1rem; /* Space between radio buttons */
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
	.formTitle {
		text-align: center;
		margin-bottom: 20px;
		background-color: rgb(97, 97, 255);
		color: #ffffff;
		padding: 20px;
		border-radius: 5px;
	}

	textarea {
		resize: none;
		width: 100%;
		height: 130px;
		margin-bottom: 20px;
		border: 1px solid #ccc;
		background: #f2f2f2;
		border-radius: 5px;
		margin-top: 3px;
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

	form input[type="radio"] {
		display: block !important;
		margin-bottom: 15px;
	}

	input[type="radio"] {
		margin-right: 10px;
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
	}

	button[type="submit"]:hover,
	.defaultBlue:hover {
		background-color: #292828;
	}

	.error {
		color: red;
		font-size: 12px;

		margin-bottom: 13px;
		display: block;
	}
</style>
