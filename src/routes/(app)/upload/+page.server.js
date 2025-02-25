import { fail } from '@sveltejs/kit';
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
    .upsert(data, { onConflict: [uniqueColumn] });

  if (error) {
    console.error(`Error inserting data into ${table}:`, error);
  } else {
    console.log(`Data inserted successfully into ${table}:`, supabaseData);
  }
}

export const actions = {
  upload: async ({ request }) => {
    const formData = await request.formData();
    const data = formData.get('data');

    if (!data) {
      return fail(400, { error: 'No data provided' });
    }

    try {
      const formattedData = JSON.parse(data);

      // Validate data
      if (
        !Array.isArray(formattedData?.lawfirm) ||
        !Array.isArray(formattedData?.lawyerscontactprofiles) ||
        !Array.isArray(formattedData?.products) ||
        !Array.isArray(formattedData?.websites)
      ) {
        return fail(400, { error: 'Invalid data format' });
      }

      // Remove duplicates
      formattedData.lawfirm = removeDuplicates(
        formattedData.lawfirm,
        "lawfirmname",
      );
      formattedData.lawyerscontactprofiles = removeDuplicates(
        formattedData.lawyerscontactprofiles,
        "lawyerid",
      );
      formattedData.products = removeDuplicates(
        formattedData.products,
        "productid",
      );
      formattedData.websites = removeDuplicates(
        formattedData.websites,
        "websiteid",
      );

      await insertData("lawfirm", formattedData.lawfirm, "lawfirmname"); // Replace 'lawfirmname' with the actual unique column name
      await insertData(
        "lawyerscontactprofiles",
        formattedData.lawyerscontactprofiles,
        "lawyerid",
      ); // Replace 'lawyerid' with the actual unique column name
      await insertData("products", formattedData.products, "productid"); // Replace 'productid' with the actual unique column name
      await insertData("websites", formattedData.websites, "websiteid"); // Replace 'websiteid' with the actual unique column name

      return { success: true, message: 'CSV imported successfully' };
    } catch (error) {
      console.error('Error processing CSV:', error);
      return fail(500, { error: 'Error importing data' });
    }
  }
};
