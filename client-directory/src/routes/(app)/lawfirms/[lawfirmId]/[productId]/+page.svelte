<script>
    import { page } from "$app/stores";
    import { supabase } from "../../../../../lib/supabaseClient";
    import { Toggle } from "carbon-components-svelte";
    import { goto } from "$app/navigation";
    import { Circle } from "svelte-loading-spinners";

    export let data;

    // Get the lawfirmId from the URL
    const lawfirmId = $page.params.lawfirmId;
    let loading = false;
    let showProducts = true; // Show products by default
    let products = []; // Store products data here
    let editingProducts = false; // State for editing products

    function navigateToProducts() {
        loading = true;
        goto(`/lawfirms/${lawfirmId}/`);
    }

    // Fetch products from the database
    async function getProducts() {
        const { data: fetchedProducts, error } = await supabase
            .from("products")
            .select("*")
            .eq("lawfirm", lawfirmId); // Fetch products for the specific law firm

        if (error) {
            console.error("Error fetching products:", error.message);
        } else {
            products = fetchedProducts; // Store fetched products in the variable
        }
    }

    async function submitProductToDatabase(product) {
        try {
            const { data, error } = await supabase
                .from("products")
                .update({
                    websitedevelopment: product.websitedevelopment,
                    websitehosting: product.websitehosting,
                    websitemanagement: product.websitemanagement,
                    newsletters: product.newsletters,
                    searchengineoptimisation: product.searchengineoptimisation,
                    socialmediamanagement: product.socialmediamanagement,
                    websiteperformance: product.websiteperformance,
                    advertising: product.advertising,
                })
                .eq("productid", product.productid);

            if (error) {
                throw error;
            }
            console.log(data);
        } catch (error) {
            console.error("Error updating product:", error.message);
        }
    }

    // Toggle editing for products
    function editProducts() {
        if (editingProducts) {
            products.forEach((product) => submitProductToDatabase(product));
        }
        editingProducts = !editingProducts;
    }

    // Fetch data for products
    function fetchData() {
        getProducts();
    }

    fetchData();
</script>

<div class="lawFirmBanner">
    <h1>{decodeURIComponent(lawfirmId)}</h1>
    <div class="buttonThree">
        <button class="productButton" on:click={navigateToProducts}>
            Law Firm Information
        </button>
        <button class="productButton" on:click={() => (showProducts = true)}>
            Products
        </button>
    </div>
</div>

{#if loading}
    <div class="loading">
        <Circle size="60" color="#0073b1" unit="px" />
    </div>
{/if}

<div class:toggleOff={loading === true}>
    {#if showProducts}
        <div class="lawFirmInfo">
            <div class="lawFirmGrid">
                <div class="labelsColumn">
                    {#each products as product}
                        <div class="serviceLabel">Website Development</div>
                        <div class="serviceLabel">Website Hosting</div>
                        <div class="serviceLabel">Website Management</div>
                        <div class="serviceLabel">Newsletters</div>
                        <div class="serviceLabel">SEO</div>
                        <div class="serviceLabel">Social Media Management</div>
                        <div class="serviceLabel">Website Performance</div>
                        <div class="serviceLabel">Advertising</div>
                    {/each}
                </div>
                <div class="statusColumn">
                    {#each products as product}
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.websitedevelopment}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.websitedevelopment
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.websitehosting}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.websitehosting
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.websitemanagement}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.websitemanagement
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.newsletters}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.newsletters ? "Yes" : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.searchengineoptimisation}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.searchengineoptimisation
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.socialmediamanagement}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.socialmediamanagement
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.websiteperformance}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.websiteperformance
                                        ? "Yes"
                                        : "No"}</span
                                >
                            {/if}
                        </div>
                        <div class="serviceStatus">
                            {#if editingProducts}
                                <Toggle
                                    class="productToggle"
                                    labelText=""
                                    bind:toggled={product.advertising}
                                />
                            {:else}
                                <span class="productStatus"
                                    >{product.advertising ? "Yes" : "No"}</span
                                >
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="editButton">
                <button on:click={editProducts} class="editStyle">
                    {editingProducts ? "Save" : "Edit"}
                </button>
            </div>
        </div>
    {/if}
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
    .serviceLabel {
        font-weight: bold;
        border-left: 4px solid rgb(97, 97, 255);
        text-align: center; /* Center the label text */
    }

    .serviceStatus {
        text-align: center; /* Center the status text */
    }

    .lawFirmGrid {
        width: 90%;
        display: grid;
        grid-template-columns: 1fr 1fr; /* Two equal columns */
        gap: 5px; /* Space between columns */
    }

    .labelsColumn,
    .statusColumn {
        border-radius: 8px; /* Rounded corners */
    }

    .labelsColumn {
        display: flex;
        flex-direction: column; /* Stack labels vertically */
    }

    .statusColumn {
        display: flex;
        flex-direction: column; /* Stack statuses vertically */
    }

    .serviceLabel {
        margin-bottom: 5px; /* Space between labels */
        background-color: #f2f2f2;
        font-weight: bold; /* Make labels bold */
        padding: 12px;
        border-left: 4px solid rgb(97, 97, 255);
        font-size: 16px;
    }

    .serviceStatus {
        margin-bottom: 5px; /* Space between status options */
        background-color: #f2f2f2;
        display: flex; /* Flex for alignment */
        align-items: center; /* Center the toggle or text vertically */
        padding: 12px;
        font-size: 16px;
        height: 40px !important;
    }

    .productButton {
        margin-right: 10px; /* Spacing between buttons */
    }

    .editButton {
        margin-top: 15px; /* Spacing above edit button */
    }

    .productStatus {
        font-weight: bold; /* Highlight status text */
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    :global(.bx--toggle-input__label .bx--toggle__switch) {
        margin-top: 0rem !important;
        margin-left: 10px !important;
    }

    .buttonThree {
        display: flex;
        justify-content: flex-end;
        width: 95.5%;
    }

    .productStatus {
        margin-left: 10px;
        font-weight: normal;
    }

    .editButton {
        margin-top: 40px !important;
        display: flex;
        justify-content: flex-end;
        padding-right: 155px;
    }

    .lawFirmInfo {
        padding: 20px;
        margin: 40px;
        border-radius: 10px;
    }
    .lawFirmBanner {
        background-color: rgb(97, 97, 255);
        display: flex;
        padding: 30px;
        padding-left: 50px;
    }

    h1 {
        color: #ffffff;
        width: 100% !important;
    }

    .productButton {
        margin-right: -6px;
        background-color: rgb(255, 255, 255);
        color: #000000;
        margin-top: 3px;
        margin-left: 61px;
        width: 220px;
    }

    .productButton:hover {
        background-color: #161616;
        color: #ffffff;
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
    }
</style>
