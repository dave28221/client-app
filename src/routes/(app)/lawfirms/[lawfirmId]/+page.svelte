<script>
    import { page } from "$app/stores";
    import { supabase } from "../../../../lib/supabaseClient";
    import { Toggle } from "carbon-components-svelte";
    import { goto } from "$app/navigation";

    export let data;

    const lawfirmId = $page.params.lawfirmId;

    let loading = false;
    let showProducts = false;
    let showWebsites = false;
    let products = [];
    let websites = [];
    let editingProducts = false;
    let editingWebsites = false;
    let editing = false;

    // URL redirect //

    function navigateToProducts() {
        goto(`/lawfirms/${lawfirmId}/products`);
    }

    // Fetch Product Data from Supabase //

    async function getProducts() {
        const { data: fetchedProducts, error } = await supabase
            .from("products")
            .select("*")
            .eq("lawfirm", lawfirmId);

        if (error) {
            console.error("Error fetching products:", error.message);
        } else {
            products = fetchedProducts;
        }
    }

    // Fetch Website Data from Supabase //

    async function getWebsites() {
        const { data: fetchedWebsites, error } = await supabase
            .from("websites")
            .select("*")
            .eq("lawfirm", lawfirmId);

        if (error) {
            console.error("Error fetching websites:", error.message);
        } else {
            websites = fetchedWebsites;
        }
    }

    // Website Data - Into Supabase table //

    async function submitWebsiteToDatabase(website) {
        try {
            const { data, error } = await supabase
                .from("websites")
                .update({
                    url: website.url,
                    dnsinfo: website.dnsinfo,
                    theme: website.theme,
                    email: website.email,
                })
                .eq("websiteid", website.websiteid);

            if (error) throw error;
            console.log(data);
        } catch (error) {
            console.error("Error updating website:", error.message);
        }
    }

    // Product Data - Into Supabase table //

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

            if (error) throw error;
            console.log(data);
        } catch (error) {
            console.error("Error updating product:", error.message);
        }
    }

    // Lawfirm Data - Into Supabase table //

    async function submitToDatabase(firm) {
        try {
            const { data, error } = await supabase
                .from("lawfirm")
                .update({
                    clientstatus: firm.clientstatus,
                    websiteurl: firm.websiteurl,
                    address1: firm.address1,
                    address2: firm.address2,
                    city: firm.city,
                    stateregion: firm.stateregion,
                    postalcode: firm.postalcode,
                    country: firm.country,
                    phonenumber: firm.phonenumber,
                    emailaddress: firm.emailaddress,
                    numberofemployees: firm.numberofemployees,
                    description: firm.description,
                })
                .eq("lawfirmname", lawfirmId);

            if (error) throw error;
            console.log(data);
        } catch (error) {
            console.error("Error updating row:", error.message);
        }
    }

    function editProducts() {
        if (editingProducts) {
            products.forEach(submitProductToDatabase);
        }
        editingProducts = !editingProducts;
    }

    function editWebsites() {
        if (editingWebsites) {
            websites.forEach(submitWebsiteToDatabase);
        }
        editingWebsites = !editingWebsites;
    }

    function editTheFirm(firm) {
        if (editing) {
            submitToDatabase(firm);
        }
        editing = !editing;
    }

    $: fetchData();
    async function fetchData() {
        await getProducts();
        await getWebsites();
    }
</script>

<div class="lawFirmBanner">
    <h1>{decodeURIComponent(lawfirmId)}</h1>
    <div class="buttonThree">
        <button
            class="productButton"
            on:click={() => {
                showProducts = false;
                showWebsites = false;
            }}
        >
            Law Firm Information
        </button>
        <button class="productButton" on:click={navigateToProducts}>
            Products
        </button>
    </div>
</div>

<div>
    {#if showProducts}
        <div>
            {#each products as product}
                <table class="lawFirmTable">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [{ label: "Website Development", key: "websitedevelopment" }, { label: "Website Hosting", key: "websitehosting" }, { label: "Website Management", key: "websitemanagement" }, { label: "Newsletters", key: "newsletters" }, { label: "SEO", key: "searchengineoptimisation" }, { label: "Social Media Management", key: "socialmediamanagement" }, { label: "Website Performance", key: "websiteperformance" }, { label: "Advertising", key: "advertising" }] as { label, key }}
                            <tr>
                                <td><strong>{label}</strong></td>
                                <td>
                                    {#if editingProducts}
                                        <Toggle
                                            class="productToggle"
                                            labelText=""
                                            bind:toggled={product[key]}
                                        />
                                    {:else}
                                        <span class="productStatus"
                                            >{product[key] ? "Yes" : "No"}</span
                                        >
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="editButton">
                    <button on:click={editProducts} class="editStyle">
                        {editingProducts ? "Save" : "Edit"}
                    </button>
                </div>
            {/each}
        </div>
    {:else if showWebsites}
        <div class="lawFirmInfo">
            {#each websites as website}
                <table class="lawFirmTable">
                    <thead>
                        <tr>
                            <th>Detail</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each [{ label: "URL", key: "url" }, { label: "DNS Info", key: "dnsinfo" }, { label: "Theme", key: "theme" }, { label: "Email", key: "email" }] as { label, key }}
                            <tr>
                                <td><strong>{label}</strong></td>
                                <td>
                                    {#if editingWebsites}
                                        <input
                                            type="text"
                                            bind:value={website[key]}
                                        />
                                    {:else}
                                        <span>{website[key]}</span>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="editButton">
                    <button on:click={editWebsites} class="editStyle">
                        {editingWebsites ? "Save" : "Edit"}
                    </button>
                </div>
            {/each}
        </div>
    {:else}
        {#each data.lawfirm as firm}
            {#if firm.lawfirmname === lawfirmId}
                <div class="lawFirmInfo">
                    <div class="lawFirmGrid">
                        <div class="gridHeader">Detail</div>
                        <div class="gridHeader">Value</div>
                        {#each [{ label: "Client Status", key: "clientstatus" }, { label: "Website URL", key: "websiteurl" }, { label: "Address 1", key: "address1" }, { label: "Address 2", key: "address2" }, { label: "City", key: "city" }, { label: "State/Region", key: "stateregion" }, { label: "Postal Code", key: "postalcode" }, { label: "Country", key: "country" }, { label: "Phone Number", key: "phonenumber" }, { label: "Email Address", key: "emailaddress" }, { label: "Number of Employees", key: "numberofemployees" }, { label: "Description", key: "description" }] as { label, key }}
                            <div class="gridItem">
                                <strong>{label}</strong>
                            </div>
                            <div class="gridItemTwo">
                                {#if editing}
                                    <input type="text" bind:value={firm[key]} />
                                {:else}
                                    <span>{firm[key]}</span>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    <div class="editButton">
                        <button
                            on:click={() => editTheFirm(firm)}
                            class="editStyle"
                        >
                            {editing ? "Save" : "Edit"}
                        </button>
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
</div>

<div class="campaigns">
    <h2 class="newsCampaign">Newsletter Campaigns</h2>

    {#if data && data.response.campaigns && data.response.campaigns.length > 0}
        <div class="campaignsGrid">
            <div class="serviceLabelAC">Campaign Name</div>
            <div class="serviceLabelAC">Opens</div>
            <div class="serviceLabelAC">Clicks</div>
            <div class="serviceLabelAC">Status</div>

            {#each data.response.campaigns as campaign}
                <div class="serviceStatusAC">{campaign.id}</div>
                <div class="serviceStatusAC">
                    {campaign.report_summary.opens}
                </div>
                <div class="serviceStatusAC">
                    {campaign.report_summary.clicks}
                </div>
                <div class="serviceStatusAC">{campaign.status}</div>
            {/each}
        </div>
    {:else}
        <p>No data available.</p>
    {/if}
</div>

<style>
    .newsCampaign {
        margin-bottom: 20px;
    }
    .campaignsGrid {
        width: 90%;
        display: grid;
        grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
        gap: 5px; /* Space between columns */
    }

    .serviceLabel,
    .serviceStatus {
        background-color: #f2f2f2;
        padding: 1px;
        font-size: 16px;
        display: flex;
    }

    .serviceLabelAC {
        background-color: rgb(97, 97, 255) !important;
        padding: 12px;
        padding: 12px;
        font-size: 16px;
        text-align: center;
        font-weight: bold;
    }

    .serviceLabel {
        font-weight: bold;
        border-left: 4px solid rgb(97, 97, 255);
        text-align: center; /* Center the label text */
    }

    .serviceStatus {
        text-align: center; /* Center the status text */
    }

    .serviceStatusAC {
        text-align: center; /* Center the status text */
        background-color: #f2f2f2;
        padding: 12px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center; /* Center content horizontally */
    }

    .newsCampaign {
        margin-bottom: 20px;
    }
    .campaignsGrid {
        width: 90%;
        display: grid;
        grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
        gap: 5px; /* Space between columns */
    }

    .campaigns {
        padding: 40px;
    }

    .loadingText {
        margin-bottom: 20px;
    }
    .lawFirmGrid {
        display: grid;
        width: 90%;
        grid-template-columns: 1fr 1fr; /* Two equal columns */
        gap: 5px; /* Space between grid items */
        margin-top: -30px; /* Optional: spacing above the grid */
        padding: 55px;
        padding-bottom: 0px;
    }

    .gridHeader {
        font-weight: bold;
        font-size: 20px;
        /* Header background color */
        margin-bottom: 15px;
        padding: 5px;
    }
    strong {
        font-size: 16px;
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
    .lawFirmTable th,
    .lawFirmTable td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    .lawFirmTable th {
        background-color: #f2f2f2;
    }

    :global(.bx--toggle-input__label .bx--toggle__switch) {
        margin-top: 0rem !important;
        margin-left: 10px !important;
    }
    .productDetails {
        display: flex;
        align-items: center;
    }

    .buttonThree {
        display: flex;
        justify-content: flex-end;
        width: 85%;
    }

    .productStatus {
        margin-left: 10px;
        font-weight: normal;
    }

    .editButton {
        margin-top: 40px !important;
    }

    .lawFirmColumns strong {
        margin-right: 10px;
        flex: 1;
    }

    .productInfo {
        margin-bottom: 20px;
    }
    .productButton {
        background-color: rgb(255, 255, 255);
        color: #000000;
        margin-top: 3px;
        margin-left: 40px;
        width: 220px;
    }

    .productButton:hover {
        background-color: #161616;
        color: #ffffff;
    }
    textarea {
        width: 100%;
        font-size: 16px;
        resize: none !important;
        height: 80px;
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
        padding-right: 220px;
    }

    button {
        background-color: rgb(97, 97, 255);
        color: rgb(255, 255, 255);
        font-weight: bold;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    button:hover {
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

    .lawFirmBanner {
        background-color: rgb(97, 97, 255);
        padding: 30px;
        padding-left: 50px;
        display: flex;
        justify-content: space-between;
    }

    h1 {
        color: #ffffff;
        width: 100% !important;
    }

    @media screen and (max-width: 700px) {
        .editButton {
            justify-content: center;
            margin-top: 30px;
            padding-right: 0px;
        }
    }
</style>
