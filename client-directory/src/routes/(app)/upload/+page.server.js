import { fail } from '@sveltejs/kit';
import { supabase } from '../../../lib/supabaseClient';

function removeDuplicates(data, uniqueColumn) {
  if (!data || !Array.isArray(data)) return [];
  const seen = new Set();
  return data.filter((item) => {
    if (!item || !item[uniqueColumn]) return false; // Skip if uniqueColumn is missing
    const value = item[uniqueColumn];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

async function insertData(table, data, uniqueColumn) {
  if (data.length === 0) {
    console.warn(`No data to insert into ${table}`);
    return;
  }

  // Validate data types
  const validatedData = data.map(item => {
    const newItem = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        if (key === 'created_at' || key === 'updated_at') {
          // Ensure the value is a valid date string or timestamp
          newItem[key] = item[key] ? new Date(item[key]).toISOString() : null;
        } else if (key === 'metadata' || key === 'settings') {
          // Ensure the value is a valid JSON object
          try {
            newItem[key] = item[key] ? JSON.parse(item[key]) : null;
          } catch {
            newItem[key] = null;
          }
        } else {
          // Default to string or null
          newItem[key] = item[key] ? item[key].toString() : null;
        }
      }
    }
    return newItem;
  });

  const { data: supabaseData, error } = await supabase
    .from(table)
    .upsert(validatedData, { onConflict: [uniqueColumn] });

  if (error) {
    console.error(`Error inserting data into ${table}:`, error);
    console.error('Failed data:', validatedData); // Log the data that failed
    throw new Error(`Error inserting data into ${table}: ${error.message}`);
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
        !Array.isArray(formattedData?.websites) ||
        !Array.isArray(formattedData?.areasoflaw)
      ) {
        return fail(400, { error: 'Invalid data format' });
      }

      // Ensure lawfirmname is propagated to related tables
      formattedData.lawyerscontactprofiles = formattedData.lawyerscontactprofiles.map(profile => ({
        ...profile,
        lawfirmname: profile.lawfirmname || formattedData.lawfirm[0]?.lawfirmname || null,
      }));

      formattedData.products = formattedData.products.map(product => ({
        ...product,
        lawfirmname: product.lawfirmname || formattedData.lawfirm[0]?.lawfirmname || null,
      }));

      formattedData.websites = formattedData.websites.map(website => ({
        ...website,
        lawfirmname: website.lawfirmname || formattedData.lawfirm[0]?.lawfirmname || null,
      }));

      // Remove duplicates
      formattedData.lawfirm = removeDuplicates(formattedData.lawfirm, "lawfirmname");
      formattedData.lawyerscontactprofiles = removeDuplicates(formattedData.lawyerscontactprofiles, "email");
      formattedData.products = removeDuplicates(formattedData.products, "lawfirmname");
      formattedData.websites = removeDuplicates(formattedData.websites, "url");
      formattedData.areasoflaw = removeDuplicates(formattedData.areasoflaw, "areaoflawid");

      // Insert data into Supabase
      await insertData("lawfirm", formattedData.lawfirm, "lawfirmname");
      await insertData("lawyerscontactprofiles", formattedData.lawyerscontactprofiles, "email");
      await insertData("products", formattedData.products, "lawfirmname");
      await insertData("websites", formattedData.websites, "url");
      await insertData("areasoflaw", formattedData.areasoflaw, "areaoflawid");

      return { success: true, message: 'CSV imported successfully' };
    } catch (error) {
      console.error('Error processing CSV:', error);
      return fail(500, { error: 'Error importing data' });
    }
  }
};