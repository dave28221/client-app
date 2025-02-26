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
    throw new Error(`Error inserting data into ${table}`);
  } else {
    console.log(`Data inserted successfully into ${table}:`, supabaseData);
  }
}

export const actions = {};
