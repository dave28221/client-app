<script>
	import { onMount } from "svelte";
	import { paginate, LightPaginationNav } from "svelte-paginate";
	import { buttonPressed, changeTheLayout } from "../store.js";
	import { fade } from "svelte/transition";

	export let data;

	let loading = false;
	let search = "";
	let visibleLawyers = [];
	let currentPage = 1;
	let pageSize = 12;

	$: paginatedItems = paginate({
		items: visibleLawyers,
		pageSize,
		currentPage,
	});

	onMount(() => {
		updateVisibleLawyers();
	});

	let buttonPressedValue;
	buttonPressed.subscribe((value) => {
		buttonPressedValue = value;
	});

	function updateVisibleLawyers() {
		loading = true;
		$: if (loading) {} // Ensure reactivity

		setTimeout(() => {
			visibleLawyers = data.lawyers.filter((lawyer) => {
				const name = lawyer.firstname?.toLowerCase() || ""; // Handle null values
				return name.includes(search);
			});

			loading = false;
		}, 300); // Simulate a slight delay for smooth UI update
	}

	function updateSearch(e) {
		search = e.target.value.toLowerCase();
		updateVisibleLawyers();
	}

	function handlePageChange(e) {
		currentPage = e.detail.page;
	}
</script>

<div class="flexLawSearch">
	<h1 class="leftAlign">Lawyers</h1>
	<div class="searchAndAdd">
		<button on:click={changeTheLayout} class="switchLayout">
			{buttonPressedValue ? "Card View" : "List View"}
		</button>
		<input
			class="searchBox"
			type="text"
			placeholder="Search Lawyers..."
			bind:value={search}
			on:input={updateSearch}
		/>
		<a href="addclient"><button class="defaultBlue">+ New Lawyer</button></a>
	</div>
</div>

{#if loading}
  <div class="spinner"></div>
{/if}

{#if !buttonPressedValue}
	<!-- Card View -->
	<ul class="flexCards" in:fade>
		{#each paginatedItems as lawyer}
			<a href="/lawyers/{encodeURIComponent(lawyer.firstname ?? " ")}">
				<li class="cardShape">
					<div class="listTitle">{lawyer.firstname ?? " "}</div>
					<div>{lawyer.email ?? " "}</div>
				</li>
			</a>
		{/each}
	</ul>
{:else}
	<div class="table-container" in:fade>
		<div class="lawFirm-grid">
			<div class="lawyer-header">
				<div class="tableHeader">Lawyer Name</div>
				<div class="tableHeader">Email</div>
				<div class="tableHeader">Position</div>
				<div class="tableHeader">Website</div>
			</div>
			{#each paginatedItems as lawyer}
				<div class="lawFirm-row">
					<div class="lawFirm-cellOne">
						<a
							class="lawyerLink"
							href="/lawyers/{encodeURIComponent(
								lawyer.firstname,
							)}"
						>
							{lawyer.firstname ?? " "}
						</a>
					</div>
					<div class="lawFirm-cellTwo">
						<a
							class="lawyerLink"
							href="/lawyers/{encodeURIComponent(
								lawyer.firstname,
							)}">{lawyer.email ?? " "}</a>
					</div>
					<div class="lawFirm-cellThree">
						<a
							class="lawyerLink"
							href="/lawyers/{encodeURIComponent(
								lawyer.firstname,
							)}">{lawyer.position ?? " "}</a>
					</div>
					<div class="lawFirm-cellFour">
						<a
							class="lawyerLink"
							href="/lawyers/{encodeURIComponent(
								lawyer.firstname,
							)}">{lawyer.lawfirmname ?? " "}</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<div class="paginationSearch">
	<LightPaginationNav
		totalItems={visibleLawyers.length}
		{pageSize}
		{currentPage}
		limit={1}
		showStepOptions={true}
		on:setPage={handlePageChange}
	/>
</div>

<style>
	.flexCards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		list-style-type: none;
		margin-top: 20px;
	}

	ul {
		list-style: none;
	}

	ul li {
		text-decoration: none;
		text-align: center;
	}

	.defaultBlue{
		width:150px !important;
	}

	.listTitle {
		color: #000000;
	}

	a {
		font-size: 17px;
	}

	.cardShape:hover {
		background-color: rgb(97, 97, 255);
	}

	.cardShape:hover .listTitle {
		background-color: rgb(97, 97, 255);
		color: #ffffff;
	}

	.switchLayout {
		margin-right: 50px;
		width: 150px;
	}

	.flexLawSearch {
		display: flex;
		justify-content: space-between;
		padding: 30px;
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
		margin-right: 50px;
		display: block;
		font-weight:bold;
	}

	.table-container {
		overflow-x: auto;
	}

	.tableHeader {
		margin-bottom: 15px;
		text-align: left !important;
	}

	.lawyer-header {
		display: contents; 
		font-weight: bold;
		background-color: #f2f2f2; 
		font-size: 20px;
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

	.cardShape .listTitle {
		font-weight: bold;
		font-size: 18px;
		color: #000000;
	}

	/* Grid View Styling */
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
		display: contents;
		font-weight: bold;
		background-color: #f2f2f2;
		margin-bottom: 20px;
	}

	.lawFirm-row {
		display: contents;
	}

	.lawFirm-cellOne {
		border-left: 4px solid rgb(97, 97, 255);
	}

	.lawFirm-cellOne,
	.lawFirm-cellTwo,
	.lawFirm-cellThree,
	.lawFirm-cellFour {
		padding: 12px;
		background-color: #f2f2f2;
		text-align: left;
	}

	.lawFirm-cellOne a,
	.lawFirm-cellTwo a,
	.lawFirm-cellThree a,
	.lawFirm-cellFour a {
		color: #000000;
		text-decoration: none;
	}

	.lawFirm-cellOne a:hover,
	.lawFirm-cellTwo a:hover,
	.lawFirm-cellThree a:hover,
	.lawFirm-cellFour a:hover {
		color: rgb(97, 97, 255); /* Hover effect */
	}

	/* Pagination */
	.paginationSearch {
		margin-top: 20px;
		text-align: center;
	}

	.tableHeader {
		text-align: center;
	}

	.paginationSearch {
		margin-top: 10px;
		border-top: 1px solid #f2f2f2;
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

	@media screen and (max-width: 1100px) {
		.lawyer-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media screen and (max-width: 800px) {
		.lawyer-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media screen and (max-width: 600px) {
		.lawyer-grid {
			grid-template-columns: 1fr;
		}
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
