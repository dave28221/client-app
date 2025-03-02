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
      "numberofemployeees",
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
    console.log("File selected:", file);
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

          console.log("Headers:", headers);
          console.log("Data:", data);
          console.log("Column Mappings:", columnMappings);
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

      const lawfirmObj = {};
      const lawyerscontactprofilesObj = {};
      const productsObj = {};
      const websitesObj = {};

      columnMappings.forEach(({ header, table, column }) => {
        const value = row[header] ? row[header].trim() : "";
        if (table && column) {
          if (table === "lawfirm") {
            lawfirmObj[column] = value;
            if (column === "lawfirmname") {
              lawfirmname = value;
            }
          } else if (table === "lawyerscontactprofiles") {
            lawyerscontactprofilesObj[column] = value;
          } else if (table === "products") {
            productsObj[column] = value;
          } else if (table === "websites") {
            websitesObj[column] = value;
          }
        }
      });

      if (lawfirmname) {
        lawyerscontactprofilesObj.lawfirmname ||= lawfirmname;
        productsObj.lawfirmname ||= lawfirmname;
        websitesObj.lawfirmname ||= lawfirmname;
      }

      if (Object.keys(lawfirmObj).length)
        formattedData.lawfirm.push(lawfirmObj);
      if (Object.keys(lawyerscontactprofilesObj).length)
        formattedData.lawyerscontactprofiles.push(lawyerscontactprofilesObj);
      if (Object.keys(productsObj).length)
        formattedData.products.push(productsObj);
      if (Object.keys(websitesObj).length)
        formattedData.websites.push(websitesObj);
    });

    console.log("Formatted Data:", formattedData);

    formattedData.lawfirm = removeDuplicates(
      formattedData.lawfirm,
      "lawfirmname",
    );
    formattedData.lawyerscontactprofiles = removeDuplicates(
      formattedData.lawyerscontactprofiles,
      "email",
    );
    formattedData.products = removeDuplicates(
      formattedData.products,
      "lawfirmname",
    );
    formattedData.websites = removeDuplicates(formattedData.websites, "url");

    const formData = new FormData();
    formData.append("data", JSON.stringify(formattedData));

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "HTTP error! status:",
          response.status,
          "Response text:",
          errorText,
        );
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Error: Non-JSON response:", errorText);
        return;
      }

      const result = await response.json();
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }

  function removeDuplicates(data, uniqueColumn) {
    const seen = new Set();
    return data.filter((item) => {
      const value = item[uniqueColumn];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
</script>

<div class="homeBanner">
  <h1 class="leftAlign">Upload CSV</h1>
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
        {#if mapping.table}
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
