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

  let file = null;
  let headers = [],
    data = [],
    columnMappings = [];

  async function handleFileChange(event) {
    file = event.target.files[0];
    if (!file) return alert("No file selected.");
    console.log("File selected:", file);
  }

  async function handleFileUpload() {
    if (!file) return alert("Please select a file to upload.");

    const csvData = await file.text();
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data: parsedData, meta }) => {
        headers = meta.fields;
        data = parsedData;
        columnMappings = headers.map((header) => ({
          header,
          table: "",
          column: "",
        }));
      },
      error: (err) => console.error("Error parsing CSV:", err),
    });
  }

  async function handleDataInsert() {
    const tables = {
      lawfirm: [],
      lawyerscontactprofiles: [],
      products: [],
      websites: [],
    };
    const seenLawfirms = new Set();

    data.forEach((row) => {
      const lawfirmname = row["lawfirmname"]?.trim() || "";
      columnMappings.forEach(({ header, table, column }) => {
        if (table && column) {
          const value = row[header]?.trim() || "";
          const record = { [column]: value };
          if (column === "lawfirmname") record["lawfirmname"] = lawfirmname;
          if (
            table === "lawfirm" &&
            column === "lawfirmname" &&
            !seenLawfirms.has(lawfirmname)
          ) {
            seenLawfirms.add(lawfirmname);
            tables.lawfirm.push(record);
          } else if (Object.keys(record).length) {
            tables[table].push(record);
          }
        }
      });
    });

    try {
      for (const [table, records] of Object.entries(tables)) {
        if (records.length) {
          const { error } = await supabase.from(table).upsert(records, {
            onConflict: table === "lawfirm" ? ["lawfirmname"] : undefined,
          });
          if (error)
            console.error(`Error inserting into ${table}:`, error.message);
          else console.log(`Successfully inserted into ${table}`);
        }
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  }
</script>

<div class="homeBanner">
  <h1 class="leftAlign">Upload CSV Final Test</h1>
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
    <button class="insertButton" on:click={handleDataInsert}>Insert Data</button
    >
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
