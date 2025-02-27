async function handleDataInsert() {
  const formattedData = {
    lawfirm: [],
    lawyerscontactprofiles: [],
    products: [],
    websites: [],
  };

  data.forEach((row) => {
    let lawfirmname = ""; // Store lawfirmname globally within the loop

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
            lawfirmname = value; // Capture the lawfirmname for other tables
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

    // Ensure lawfirmname is propagated correctly
    if (!lawfirmname) {
      console.warn("Lawfirm name missing for row:", row);
    }

    if (lawfirmname) {
      if (!lawyerscontactprofilesObj.lawfirmname) {
        lawyerscontactprofilesObj.lawfirmname = lawfirmname;
      }
      if (!productsObj.lawfirmname) {
        productsObj.lawfirmname = lawfirmname;
      }
      if (!websitesObj.lawfirmname) {
        websitesObj.lawfirmname = lawfirmname;
      }
    }

    if (Object.keys(lawfirmObj).length) formattedData.lawfirm.push(lawfirmObj);
    if (Object.keys(lawyerscontactprofilesObj).length)
      formattedData.lawyerscontactprofiles.push(lawyerscontactprofilesObj);
    if (Object.keys(productsObj).length) formattedData.products.push(productsObj);
    if (Object.keys(websitesObj).length) formattedData.websites.push(websitesObj);
  });

  console.log("Formatted Data:", formattedData);

  // Remove duplicates based on unique identifiers
  formattedData.lawfirm = removeDuplicates(formattedData.lawfirm, "lawfirmname");
  formattedData.lawyerscontactprofiles = removeDuplicates(formattedData.lawyerscontactprofiles, "email");
  formattedData.products = removeDuplicates(formattedData.products, "lawfirmname");
  formattedData.websites = removeDuplicates(formattedData.websites, "url");

  // Ensure column mappings are valid
  for (const table in formattedData) {
    if (formattedData.hasOwnProperty(table)) {
      const dataArray = formattedData[table];
      if (dataArray.length > 0) {
        const firstItem = dataArray[0];
        for (const key in firstItem) {
          if (firstItem.hasOwnProperty(key)) {
            if (!tableColumns[table].includes(key)) {
              console.error(`Invalid column mapping: Table ${table} has column ${key} which is not in tableColumns`);
              return;
            }
          }
        }
      }
    }
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(formattedData));

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP error! status:", response.status, "Response text:", errorText);
      return;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Error: Non-JSON response:", errorText);
      return;
    }

    try {
      const result = await response.json();

      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.error);
      }
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
    }
  } catch (error) {
    console.error("Error uploading data:", error);
  }
}

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