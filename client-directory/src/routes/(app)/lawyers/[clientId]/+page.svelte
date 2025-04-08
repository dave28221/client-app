<script>
	import { page } from "$app/stores";
	import { supabase } from "../../../../lib/supabaseClient";
	import { onMount } from "svelte";

	export let data;
    let loading = false;
	const clientId = $page.params.clientId;
	let editing = false;

	async function submitToDatabase(client) {
        loading = true;
		try {
			const { data, error } = await supabase
				.from("lawyerscontactprofiles")
				.update({
					lastname: client.lastname,
					email: client.email,
					phone: client.phone,
					position: client.position,
					accountemail: client.accountemail,
					accountphone: client.accountphone,
					addressline1: client.addressline1,
					suburb: client.suburb,
					postcode: client.postcode,
					state: client.state,
					country: client.country,
					website: client.website,
					lawfirmname: client.lawfirmname,
				})
				.eq("firstname", clientId);

			if (error) {
				throw error;
			}
			console.log(data);
            loading = false;
		} catch (error) {
			console.error("Error updating row:", error.message);
            loading = false;
		}
	}

	function editTheClient(client) {
		editing = !editing;
		if (!editing) {
			submitToDatabase(client);
		}
	}
</script>

<div class="lawFirmBanner">
	<h1>{decodeURIComponent(clientId)}</h1>
</div>

{#if loading}
  <div class="spinner"></div>
{/if}
<!-- sort out display law firm error if it doesn't exist -->

{#each data.lawyers as client}
	{#if client.firstname === clientId}
		<div class="lawFirmInfo">
			<div class="lawFirmGrid">
				{#each [{ label: "Surname", key: "lastname" }, { label: "Email", key: "email" }, { label: "Phone", key: "phone" }, { label: "Position", key: "position" }, { label: "Account Email", key: "accountemail" }, { label: "Account Phone", key: "accountphone" }, { label: "Address Line 1", key: "addressline1" }, { label: "Suburb", key: "suburb" }, { label: "Postcode", key: "postcode" }, { label: "State", key: "state" }, { label: "Country", key: "country" }, { label: "Website", key: "website" }, { label: "Law Firm", key: "lawfirmname" }] as { label, key }}
					<div class="gridItem">
						<strong>{label}</strong>
					</div>
					<div class="gridItemTwo">
						{#if editing}
							<input type="text" bind:value={client[key]} />
						{:else}
							<span>{client[key]}</span>
						{/if}
					</div>
				{/each}
			</div>
			<div class="editButton">
				<button
					on:click={() => editTheClient(client)}
					class="editStyle"
				>
					{editing ? "Save" : "Edit"}
				</button>
			</div>
		</div>
	{/if}
{/each}

<style>
	.lawFirmInfo {
		background-color: #ffffff;
		padding: 20px !important;
		margin: 40px !important;
		font-size:16px;
	}

	.lawFirmGrid {
		display: grid;
		width:90%;
		grid-template-columns: 1fr 1fr; /* Two equal columns */
		gap: 10px; /* Space between grid items */
		padding: 20px;
	}

	.gridHeader {
		font-weight: bold;
		font-size: 20px;
		margin-bottom: 15px;
		padding: 5px;
	}

	.gridItem {
		padding: 10px;
		border-left: 4px solid rgb(97, 97, 255);
		background-color: #f2f2f2; /* Optional: background color for items */
	}

	.gridItemTwo {
		padding: 10px;
		background-color: #f2f2f2; /* Optional: background color for items */
	}

	input,
	span {
		font-size: 16px;
		padding: 3px;
		display: inline-block;
	}

	.editButton {
		display: flex;
		justify-content: flex-end;
		padding-right: 50px;
	}

	button {
		margin-top: 10px;
		background-color: rgb(97, 97, 255);
		color: rgb(255, 255, 255);
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		box-shadow: 0px 4px 8px rgba(74, 74, 75, 0.2);
	}

	button:hover {
		background-color: rgb(97, 97, 255);
	}

	p {
		margin-left: 10px;
	}

	.paraLeft {
		margin-top: 50px;
		margin-bottom: 10px;
	}

	strong {
		color: #000000;
		margin-right: 5px;
	}

	@media screen and (max-width: 700px) {
		.editButton {
			justify-content: center;
			margin-top: 30px;
			padding-right: 0px;
		}
	}
	input,
	span {
		font-size: 16px;
		padding: 3px;
		display: inline-block;
	}
	.editButton {
		display: flex;
		justify-content: flex-end;
		padding-right: 50px;
	}

	button {
		margin-top: 10px;
		background-color: rgb(97, 97, 255);
		color: rgb(255, 255, 255);
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		box-shadow: 0px 4px 8px rgba(74, 74, 75, 0.2);
	}
	button:hover {
		background-color: rgb(97, 97, 255);
	}

	p {
		margin-left: 10px;
	}

	.paraLeft {
		margin-top: 50px;
		margin-bottom: 10px;
	}
	strong {
		color: #000000;
		margin-right: 5px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	td {
		padding: 10px;
		border: 1px solid #ddd;
	}
	td strong {
		color: #000;
	}
	.lawFirmBanner {
		background-color: rgb(97, 97, 255);
		padding: 30px;
	}

	h1 {
		color: #ffffff;
	}

	@media screen and (max-width: 700px) {
		.editButton {
			justify-content: center;
			margin-top: 30px;
			padding-right: 0px;
		}
	}

	@media screen and (max-width: 512px) {
		/* Styles for smaller screens */
	}

    .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #6161ff;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>
