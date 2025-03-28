<script>
	import { onMount } from "svelte";
	import { paginate, LightPaginationNav } from "svelte-paginate";
	import { buttonPressed, changeTheLayout } from "../store.js";
	import { fade } from "svelte/transition";
	import { Circle } from "svelte-loading-spinners";

	export let data;


	// FIX SEARHCH //

	let loading = false;
	let search = "";
	let visibleLawFirms = [];
	let currentPage = 1;
	let pageSize = 12;

	$: paginatedItems = paginate({
		items: visibleLawFirms,
		pageSize,
		currentPage,
	});


	// component mounts to DOM before search is performed //
	onMount(() => {
		updateVisibleLawFirms();
	});

	let buttonPressedValue;
	buttonPressed.subscribe((value) => {
		buttonPressedValue = value;
	});

	function navigateToProducts() {
		loading = true;
		goto(`/lawfirms/${lawfirmId}`);
	}

	// Fetch Law FIrm Data from Supabase //

	function updateVisibleLawFirms() {
		loading = true;
		if (search) {
			visibleLawFirms = data.lawfirm.filter((lawF) =>
				lawF.lawfirmname.toLowerCase().includes(search)
			);
		} else {
			visibleLawFirms = data.lawfirm;
		}
		loading = false;
	}

	function updateSearch(e) {
		search = e.target.value.toLowerCase();
		updateVisibleLawFirms();
	}

	function handlePageChange(e) {
		currentPage = e.detail.page;
	}
</script>

<div class="flexLawSearch">
	<h1 class="leftAlign">Law Firms</h1>
	<div class="searchAndAdd">
		<button on:click={changeTheLayout} class="switchLayout">
			{buttonPressedValue ? "Card View" : "List View"}
		</button>
		<input
			class="searchBox"
			type="text"
			placeholder="Search Law Firms..."
			bind:value={search}
			on:input={updateSearch}
		/>
		<a href="addfirm"><button class="defaultBlue">+ New Firm</button></a>
	</div>
</div>

{#if loading}
	<div class="loading">
		<Circle size="60" color="#0073b1" unit="px" />
	</div>
{/if}

<div class:toggleOff={loading === true}>
	{#if !buttonPressedValue}
		<ul class="flexCards" in:fade>
			{#each paginatedItems as lawFirm}
				<a
					href="/lawfirms/{encodeURIComponent(lawFirm.lawfirmname)}"
					on:click={navigateToProducts}
				>
					<li class="cardShape">
						<div class="listTitle">{lawFirm.lawfirmname}</div>
						<div>{lawFirm.websiteurl}</div>
					</li>
				</a>
			{/each}
		</ul>
	{:else}
		<div class="table-container" in:fade>
			<div class="lawFirm-grid">
				<div class="lawFirm-header">
					<div class="tableHeader">Law Firm Name</div>
					<div class="tableHeader">Website</div>
					<div class="tableHeader">Email</div>
					<div class="tableHeader">Contact</div>
				</div>
				{#each paginatedItems as lawFirm}
					<div class="lawFirm-row">
						<div class="lawFirm-cellOne">
							<a
								on:click={navigateToProducts}
								class="lawFirmSiteName"
								href="/lawfirms/{encodeURIComponent(
									lawFirm.lawfirmname,
								)}"
							>
								{lawFirm.lawfirmname}
							</a>
						</div>
						<div class="lawFirm-cellTwo">
							<a
								on:click={navigateToProducts}
								class="website"
								href="/lawfirms/{encodeURIComponent(
									lawFirm.lawfirmname,
								)}"
							>
								{lawFirm.websiteurl ?? " "}
							</a>
						</div>
						<div class="lawFirm-cellThree">
							<a
								on:click={navigateToProducts}
								class="email"
								href="/lawfirms/{encodeURIComponent(
									lawFirm.lawfirmname,
								)}"
							>
								{lawFirm.emailaddress}
							</a>
						</div>
						<div class="lawFirm-cellFour">
							<a
								on:click={navigateToProducts}
								class="contact"
								href="/lawfirms/{encodeURIComponent(
									lawFirm.lawfirmname,
								)}"
							>
								{lawFirm.phonenumber}
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="paginationSearch">
		<LightPaginationNav
			totalItems={visibleLawFirms.length}
			{pageSize}
			{currentPage}
			limit={1}
			showStepOptions={true}
			on:setPage={handlePageChange}
		/>
	</div>
</div>

<style>

	.toggleOff {
		display: none !important;
	}
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50vh;
	}
	a {
		font-size: 16px;
	}

	.defaultBlue {
		width: 150px !important;
	}

	.tableHeader {
		font-size: 20px;
		margin-bottom: 15px;
	}
	.lawFirm-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 90%;
		gap: 5px;
		padding: 55px;
		padding-top: 30px;
		background-color: #ffffff;
	}

	.lawFirm-header {
		display: contents; /* Use contents to make header items part of the grid */
		font-weight: bold;
		background-color: #f2f2f2; /* Optional header background */
	}

	.lawFirm-row {
		display: contents; /* Keep the structure flat for proper alignment */
	}

	.lawFirm-cellOne {
		padding: 12px;
		background-color: #f2f2f2;
		text-align: left;
		border-left: 4px solid rgb(97, 97, 255);
	}

	.lawFirm-cellOne a {
		color: #000000;
	}

	.lawFirm-cellTwo {
		padding: 12px;
		text-align: left;
		background-color: #f2f2f2;
		color: #ffffff;
	}

	.lawFirm-cellThree {
		padding: 12px;
		text-align: left;
		background-color: #f2f2f2;
		color: #ffffff;
	}

	.lawFirm-cellFour {
		padding: 12px;
		text-align: left;
		background-color: #f2f2f2;
		color: #ffffff;
	}

	.lawFirm-cellFour a {
		color: #000000;
	}

	.lawFirm-cellThree a {
		color: #000000;
	}

	.lawFirm-cellTwo a {
		color: #000000;
	}

	.table-container {
		overflow-x: auto;
	}

	.switchLayout {
		margin-right: 50px;
		width: 150px;
	}

	.paginationSearch {
		margin-top: 5px;
		border-top: 1px solid #f2f2f2;
	}

	.listTitle {
		font-size: 20px;
		font-weight: bolder;
		margin-bottom: 15px;
		color: #000000;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	ul li {
		text-decoration: none;
		text-align: center;
	}

	.flexLawSearch {
		padding: 30px;
		display: flex;
		justify-content: space-between;
		background-color: rgb(97, 97, 255);
		color: white;
	}

	.searchAndAdd {
		display: flex;
	}

	.searchBox {
		width: 250px;
		padding: 8px;
		font-size: 16px;
		border-radius: 6px;
		border: none;
		background-color: #ffffff;
		font-weight: 600;
		margin-right: 50px;
		display: block;
	}

	.flexCards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		list-style-type: none;
		margin-top: 20px;
	}

	.cardShape {
		padding-top: 20px;
		margin: 20px;
		height: 205px;
		background-color: rgb(255, 255, 255);
		border-radius: 10px;
	}

	.cardShape:hover {
		background-color: rgb(97, 97, 255);
		color: #ffffff;
	}

	.cardShape:hover .listTitle {
		background-color: rgb(97, 97, 255);
		color: #ffffff; /* Change the color to white */
	}

	button {
		background-color: #f2f2f2;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
	}

	button:hover {
		background-color: #292828;
		color: white;
	}

	/* Media queries for responsiveness */
	@media screen and (max-width: 1100px) {
		.lawFirm-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media screen and (max-width: 800px) {
		.lawFirm-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media screen and (max-width: 600px) {
		.lawFirm-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
