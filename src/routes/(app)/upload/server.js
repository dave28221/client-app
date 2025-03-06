import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';  // Make sure to import your Supabase client

// Function to insert lawfirm data into Supabase and return a mapping of lawfirm names to IDs
async function insertLawfirmAndGetIds(data) {
  try {
    if (data.length === 0) return {};

    console.log("Lawfirm data being sent to Supabase:", data);

    const { data: insertedData, error: insertError } = await supabase
      .from('lawfirm')
      .upsert(data, { onConflict: ['lawfirmname'] })
      .select('id, lawfirmname');

    if (insertError) {
      console.error('Error inserting lawfirm:', insertError);
      throw error(500, { message: 'Error inserting lawfirm: ' + insertError.message });
    }

    console.log("Lawfirm data inserted successfully:", insertedData);

    return insertedData.reduce((acc, item) => {
      acc[item.lawfirmname] = item.id;
      return acc;
    }, {});
  } catch (errorReturned) {
    console.error("Error in insertLawfirmAndGetIds:", errorReturned);
    throw error(500, { message: errorReturned.message });
  }
}

// Function to insert other data (lawyerscontactprofiles, products, websites) into Supabase
async function insertData(table, data, uniqueColumn, lawfirmMap) {
  try {
    if (data.length === 0) return;

    const modifiedData = data.map(item => ({
      ...item,
      lawfirm_id: lawfirmMap[item.lawfirmname] || null,
    }));

    console.log(`Data being sent to ${table}:`, modifiedData);

    const { error: insertError } = await supabase.from(table).upsert(modifiedData, { onConflict: [uniqueColumn] });
    if (insertError) {
      console.error(`Error inserting into ${table}:`, insertError);
      throw error(500, { message: `Error inserting into ${table}: ` + insertError.message });
    }
    console.log(`${table} data inserted successfully`);
  } catch (errorReturned) {
    console.error("Error in insertData:", errorReturned);
    throw error(500, { message: errorReturned.message });
  }
}

export async function POST({ request }) {
  try {
    const { data } = await request.json();
    console.log("Formatted data received from client:", JSON.stringify(data, null, 2));

    // Insert lawfirm data and get a map of lawfirm names to IDs
    const lawfirmMap = await insertLawfirmAndGetIds(data.lawfirm);

    // Insert data for each table (lawyerscontactprofiles, products, websites)
    await insertData('lawyerscontactprofiles', data.lawyerscontactprofiles, 'email', lawfirmMap);
    await insertData('products', data.products, 'lawfirmname', lawfirmMap);
    await insertData('websites', data.websites, 'url', lawfirmMap);

    return json({ success: true, message: 'CSV imported successfully' });
  } catch (err) {
    console.error('Error processing CSV:', err);
    throw error(err.status || 500, { message: err.message || 'Error importing data' });
  }
}