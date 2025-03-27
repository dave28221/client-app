<script>
    import { onMount } from "svelte";
    import { paginate, LightPaginationNav } from "svelte-paginate";
    import { buttonPressed, changeTheLayout } from "../store.js";
    import { supabase } from "../../../lib/supabaseClient";
    import { fade } from "svelte/transition";
    import { Circle } from "svelte-loading-spinners";

    let websites = [];
    let loading = false;
    let search = "";
    let visibleWebsites = [];
    let currentPage = 1;
    let pageSize = 12;

    // component mounts to DOM before search is performed //
    onMount(() => {
        updateVisibleWebsites();
    });

    $: paginatedItems = paginate({
        items: visibleWebsites,
        pageSize,
        currentPage,
    });

    $: fetchData();
    async function fetchData() {
        loading = true;
        try {
            await getWebsites();
        } finally {
            loading = false;
        }
    }

    let buttonPressedValue;
    buttonPressed.subscribe((value) => {
        buttonPressedValue = value;
    });

    // Fetch Website Data from Supabase //

    async function getWebsites() {
        const { data: fetchedWebsites, error } = await supabase
            .from("websites")
            .select("*");

        if (error) {
            console.error("Error fetching websites:", error.message);
        } else {
            websites = fetchedWebsites;
            updateVisibleWebsites(); // Update visible websites after fetching //
        }
    }

    function updateVisibleWebsites() {
        if (search) {
            visibleWebsites = websites.filter((website) =>
                website.url.toLowerCase().includes(search),
            );
        } else {
            visibleWebsites = websites;
        }
    }

    function updateSearch(e) {
        search = e.target.value.toLowerCase();
        updateVisibleWebsites();
    }

    function handlePageChange(e) {
        currentPage = e.detail.page;
    }
</script>

<div class="flexLawSearch">
    <h1 class="leftAlign">Websites</h1>
    <div class="searchAndAdd">
        <button on:click={changeTheLayout} class="switchLayout">
            {buttonPressedValue ? "Card View" : "List View"}
        </button>
        <input
            class="searchBox"
            type="text"
            placeholder="Search Websites..."
            bind:value={search}
            on:input={updateSearch}
        />
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
            {#each paginatedItems as webSite}
                <a href="/lawfirms/{encodeURIComponent(webSite.lawfirm)}">
                    <li class="cardShape">
                        <div class="listTitle">{webSite.url}</div>
                        <div class="">{webSite.lawfirmname}</div>
                    </li>
                </a>
            {/each}
        </ul>
    {:else}
        <div class="table-container" in:fade>
            <div class="lawFirm-grid">
                <div class="lawFirm-header">
                    <div class="tableHeader">URL</div>
                    <div class="tableHeader">DNS</div>
                    <div class="tableHeader">Theme</div>
                    <div class="tableHeader">Email</div>
                    <div class="tableHeader">Law Firm</div>
                </div>
                {#each paginatedItems as webSite}
                    <div class="lawFirm-row">
                        <div class="lawFirm-cellOne">
                            <a
                                class="lawFirmSiteName"
                                href="/lawfirms/{encodeURIComponent(
                                    webSite.lawfirmname,
                                )}"
                            >
                                {webSite.url}
                            </a>
                        </div>
                        <div class="lawFirm-cellTwo">
                            <a
                                class="website"
                                href="/lawfirms/{encodeURIComponent(
                                    webSite.lawfirmname,
                                )}"
                            >
                                {webSite.dnsinfol}
                            </a>
                        </div>
                        <div class="lawFirm-cellThree">
                            <a
                                class="email"
                                href="/lawfirms/{encodeURIComponent(
                                    webSite.lawfirmname,
                                )}"
                            >
                                {webSite.theme}
                            </a>
                        </div>
                        <div class="lawFirm-cellFour">
                            <a
                                class="contact"
                                href="/lawfirms/{encodeURIComponent(
                                    webSite.lawfirmname,
                                )}"
                            >
                                {webSite.email}
                            </a>
                        </div>
                        <div class="lawFirm-cellFive">
                            <a
                                class="contact"
                                href="/lawfirms/{encodeURIComponent(
                                    webSite.lawfirmname,
                                )}"
                            >
                                {webSite.lawfirmname}
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <div class="paginationSearch">
        <LightPaginationNav
            totalItems={visibleWebsites.length}
            {pageSize}
            {currentPage}
            limit={1}
            showStepOptions={true}
            on:setPage={handlePageChange}
        />
    </div>
</div>

<style>
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh;
    }

    a {
        font-size: 16px;
    }

    .tableHeader {
        font-size: 20px;
        margin-bottom: 15px;
    }
    .lawFirm-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        width: 90%;
        /*margin: auto;*/
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

    .lawFirm-cellFive {
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
