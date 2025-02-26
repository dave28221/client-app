import { json } from '@sveltejs/kit';
import { supabase } from '../../../lib/supabaseClient';

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

async function insertData(table, data, uniqueColumn) {
  if (data.length === 0) return;

  const { data: supabaseData, error } = await supabase
    .from(table)
    .upsert(data, { onConflict: uniqueColumn });

  if (error) {
    console.error(`Error inserting data into ${table}:`, error);
    throw new Error(`Database error: ${error.message}`);
  }

  return supabaseData;
}

export const actions = {
  upload: async ({ request }) => {
    try {
      const formData = await request.json(); // Ensure we're parsing JSON
      console.log("Received Data:", formData);

      if (!formData) {
        return json({ success: false, error: "No data provided" }, { status: 400 });
      }

      // Validate data format
      const { lawfirm, lawyerscontactprofiles, products, websites } = formData;
      if (
        !Array.isArray(lawfirm) ||
        !Array.isArray(lawyerscontactprofiles) ||
        !Array.isArray(products) ||
        !Array.isArray(websites)
      ) {
        return json({ success: false, error: "Invalid data format" }, { status: 400 });
      }

      // Remove duplicates
      formData.lawfirm = removeDuplicates(lawfirm, "lawfirmname");
      formData.lawyerscontactprofiles = removeDuplicates(lawyerscontactprofiles, "lawyerid");
      formData.products = removeDuplicates(products, "productid");
      formData.websites = removeDuplicates(websites, "websiteid");

      // Insert into Supabase
      await insertData("lawfirm", formData.lawfirm, "lawfirmname");
      await insertData("lawyerscontactprofiles", formData.lawyerscontactprofiles, "lawyerid");
      await insertData("products", formData.products, "productid");
      await insertData("websites", formData.websites, "websiteid");

      return json({ success: true, message: "CSV imported successfully" });
    } catch (error) {
      console.error("Error processing CSV:", error);
      return json({ success: false, error: "Error importing data" }, { status: 500 });
    }
  }
};
