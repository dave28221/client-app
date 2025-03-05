<script>
  import { parse } from "csv-parse";
  let file;
  let headers = [];
  let data = [];
  let columnMappings = [];

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

  function handleFileChange(event) {
    file = event.target.files[0];
  }

  async function handleFileUpload() {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;

      parse(
        csvData,
        {
          columns: true,
          skip_empty_lines: true,
        },
        (err, output) => {
          if (err) {
            console.error("Error parsing CSV:", err);
            return;
          }

          headers = Object.keys(output[0]);
          data = output;

          columnMappings = headers.map((header) => ({
            header,
            table: "",
            column: "",
          }));
        },
      );
    };

    reader.readAsText(file);
  }

  async function handleDataInsert() {
    const formattedData = {
      lawfirm: [],
      lawyerscontactprofiles: [],
      products: [],
      websites: [],
    };

    data.forEach((row) => {
      let lawfirmname = "";
      const rowData = {
        lawfirm: {},
        lawyerscontactprofiles: {},
        products: {},
        websites: {},
      };

      columnMappings.forEach(({ header, table, column }) => {
        if (table && column) {
          rowData[table][column] = row[header]?.trim() || "";
          if (column === "lawfirmname") {
            lawfirmname = row[header]?.trim() || "";
          }
        }
      });

      if (lawfirmname) {
        rowData.lawyerscontactprofiles.lawfirmname ||= lawfirmname;
        rowData.products.lawfirmname ||= lawfirmname;
        rowData.websites.lawfirmname ||= lawfirmname;
      }

      Object.keys(rowData).forEach((table) => {
        if (Object.keys(rowData[table]).length) {
          formattedData[table].push(rowData[table]);
        }
      });
    });

    console.log("Formatted Data Sent to Server:", formattedData);
  }
</script>

<div>
  <h1>Upload CSV</h1>
  <input type="file" accept=".csv" on:change={handleFileChange} />
  <button on:click={handleFileUpload}>Import CSV</button>

  {#if headers.length}
    <div>
      {#each columnMappings as mapping, index}
        <div>
          <label>{mapping.header}</label>
          <select bind:value={mapping.table}>
            <option value="">Select table</option>
            {#each Object.keys(tableColumns) as table}
              <option value={table}>{table}</option>
            {/each}
          </select>
          {#if mapping.table}
            <select bind:value={mapping.column}>
              <option value="">Select column</option>
              {#each tableColumns[mapping.table] as column}
                <option value={column}>{column}</option>
              {/each}
            </select>
          {/if}
        </div>
      {/each}
      <button on:click={handleDataInsert}>Insert Data</button>
    </div>
  {/if}
</div>


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