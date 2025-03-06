<script>
  import { parse } from "csv-parse";
  let file,
    headers = [],
    data = [],
    columnMappings = [];
  const tableColumns = {
    lawfirm: ["lawfirmname", "clientstatus", "websiteurl"],
    lawyerscontactprofiles: ["firstname", "lastname", "email", "lawfirmname"],
    products: ["websitedevelopment", "lawfirmname"],
    websites: ["url", "lawfirmname"],
  };

  function handleFileChange(event) {
    file = event.target.files[0];
  }

  async function handleFileUpload() {
    if (!file) return alert("Select a file");
    const reader = new FileReader();
    reader.onload = (event) => {
      parse(
        event.target.result,
        { columns: true, skip_empty_lines: true },
        (err, output) => {
          if (err) return console.error("CSV Parsing Error:", err);
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
      let lawfirmname = row["lawfirmname"]?.trim();
      const entry = {};
      columnMappings.forEach(({ header, table, column }) => {
        if (table && column) entry[column] = row[header]?.trim() || "";
      });
      if (entry.lawfirmname) formattedData.lawfirm.push(entry);
      if (entry.email) formattedData.lawyerscontactprofiles.push(entry);
      if (entry.websitedevelopment) formattedData.products.push(entry);
      if (entry.url) formattedData.websites.push(entry);
    });

    const formData = new FormData();
    formData.append("data", JSON.stringify(formattedData));
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) console.log(result.message);
      else console.error(result.error);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  }
</script>

<div class="homeBanner">
  <h1 class="leftAlign">Upload CSV</h1>
  <div class="searchAndAdd">
    <div>
      <input type="file" accept=".csv" on:change={handleFileChange} />
      <button on:click={handleFileUpload}>Import CSV</button>
    </div>
    {#if headers.length}
      <button on:click={handleDataInsert}>Insert Data</button>
    {/if}
  </div>
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
