import { fail } from '@sveltejs/kit';
import { supabase } from '../../../lib/supabaseClient';
import Papa from 'papaparse';

async function insertLawfirmAndGetIds(data) {
  if (data.length === 0) return [];

  const { data: insertedData, error } = await supabase
    .from('lawfirm')
    .upsert(data, { onConflict: ['lawfirmname'] })
    .select('id, lawfirmname');

  if (error) {
    console.error('Error inserting lawfirm:', error);
    throw new Error('Error inserting lawfirm');
  }

  return insertedData.reduce((acc, item) => {
    acc[item.lawfirmname] = item.id;
    return acc;
  }, {});
}

async function insertData(table, data, uniqueColumn, lawfirmMap) {
  if (data.length === 0) return;

  data = data.map(item => ({
    ...item,
    lawfirm_id: lawfirmMap[item.lawfirmname] || null
  }));

  const { error } = await supabase.from(table).upsert(data, { onConflict: [uniqueColumn] });
  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw new Error(`Error inserting into ${table}`);
  }
}

export const actions = {
  upload: async ({ request }) => {
    const formData = await request.formData();
    const data = formData.get('data');

    if (!data) return fail(400, { error: 'No data provided' });

    try {
      const parsedData = Papa.parse(data, { header: true });
      const formattedData = parsedData.data;

      // Insert lawfirm first and get their IDs
      const lawfirmMap = await insertLawfirmAndGetIds(formattedData.lawfirm);

      // Insert other tables using lawfirm IDs
      await insertData('lawyerscontactprofiles', formattedData.lawyerscontactprofiles, 'email', lawfirmMap);
      await insertData('products', formattedData.products, 'lawfirmname', lawfirmMap);
      await insertData('websites', formattedData.websites, 'url', lawfirmMap);

      return { success: true, message: 'CSV imported successfully' };
    } catch (error) {
      console.error('Error processing CSV:', error);
      return fail(500, { error: 'Error importing data' });
    }
  }
};