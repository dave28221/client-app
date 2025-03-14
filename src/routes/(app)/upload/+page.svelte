<script>
  import Papa from "papaparse";
  import { supabase } from "../../../lib/supabaseClient";

  const tableColumns = {
    lawfirm: [
      "lawfirmname",
      "clientstatus",
      "websiteurl",
      "address1",
      "address2",
      "city",
      "stateregion",
      "postalcode",
      "country",
      "phonenumber",
      "emailaddress",
      "description",
      "numberofemployees",
    ],
    lawyerscontactprofiles: [
      "firstname",
      "lastname",
      "email",
      "phone",
      "profilepicture",
      "position",
      "accountemail",
      "accountphone",
      "addressline1",
      "suburb",
      "postcode",
      "state",
      "country",
      "website",
      "lawfirmname",
    ],
    products: [
      "websitedevelopment",
      "websitehosting",
      "websitemanagement",
      "newsletters",
      "searchengineoptimisation",
      "socialmediamanagement",
      "websiteperformance",
      "advertising",
      "lawfirmname",
    ],
    websites: ["url", "dnsinfo", "theme", "email", "lawfirmname"],
  };

  let file,
    headers = [],
    data = [],
    columnMappings = [];

  $: headers = [...headers];
  $: data = [...data];
  $: columnMappings = [...columnMappings];

  async function handleFileChange(event) {
    try {
      file = event.target.files[0];
      if (!file) throw new Error("No file selected.");
      console.log("File selected:", file);
    } catch (err) {
      console.error("File selection error:", err.message);
      alert(err.message);
    }
  }

  async function handleFileUpload() {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          headers = results.meta.fields;
          data = results.data;
          columnMappings = headers.map((header) => ({
            header,
            table: "",
            column: "",
          }));
        },
        error: (err) => console.error("Error parsing CSV:", err),
      });
    };

    reader.readAsText(file);
  }

  async function handleDataInsert() {
    // Check if all headers have been mapped to a table and column
    const unmappedHeaders = columnMappings.filter(
      (mapping) => !mapping.table || !mapping.column
    );

    if (unmappedHeaders.length > 0) {
      alert("Please map all headers to a table and column before inserting data.");
      return;
    }

    const tables = {
      lawfirm: [],
      lawyerscontactprofiles: [],
      products: [],
      websites: [],
    };

    data.forEach((row) => {
      columnMappings.forEach(({ header, table, column }) => {
        if (table && column) {
          const tempRecord = {};
          tempRecord[column] = row[header] || "";
          if (Object.keys(tempRecord).length > 0) {
            tables[table].push(tempRecord);
          }
        }
      });
    });

    try {
      for (const table in tables) {
        if (tables[table].length > 0) {
          const { error } = await supabase.from(table).upsert(tables[table]);
          if (error) {
            console.error(`Error inserting into ${table}:`, error.message);
          } else {
            console.log(`Successfully inserted into ${table}`);
          }
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  }
</script>

<div class="homeBanner">
  <h1 class="leftAlign">Upload CSV File</h1>
  <div class="searchAndAdd">
    <input type="file" accept=".csv" on:change={handleFileChange} />
    <button on:click={handleFileUpload}>Import CSV</button>
  </div>
</div>

{#if headers.length}
  <div class="mappingSection">
    {#each columnMappings as mapping, index}
      <div class="mappingRow">
        <label for="table-{index}">{mapping.header}</label>
        <select id="table-{index}" bind:value={mapping.table}>
          <option value="">Select table</option>
          {#each Object.keys(tableColumns) as table}
            <option value={table}>{table}</option>
          {/each}
        </select>
        {#if mapping.table && tableColumns[mapping.table]}
          <select id="column-{index}" bind:value={mapping.column}>
            <option value="">Select column</option>
            {#each tableColumns[mapping.table] as column}
              <option value={column}>{column}</option>
            {/each}
          </select>
        {/if}
      </div>
    {/each}
    <button class="insertButton" on:click={handleDataInsert}>Insert Data</button>
  </div>
{/if}

<style>
  .searchAndAdd {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="file"] {
    display: inline-block;
  }

  input[type="file"] + label {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }

  button {
    background-color: #f2f2f2;
    color: rgb(0, 0, 0);
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 150px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 150px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #292828;
    color: #ffffff;
  }

  .homeBanner {
    display: flex;
    justify-content: space-between;
    background-color: #6161ff;
    color: white;
    padding: 30px;
  }

  .mappingSection {
    margin-top: 20px;
  }

  .mappingRow {
    margin-left: 5%;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    width: 45%;
    font-size: 16px;
    font-weight: 600;
  }

  .mappingRow label {
    width: 150px;
  }

  .mappingRow select {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .insertButton {
    background-color: #6161ff;
    color: #ffffff;
    margin-top: 20px;
    margin-left: 5%;
    margin-bottom: 50px;
  }
</style>