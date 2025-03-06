import { json, error } from '@sveltejs/kit';
import { supabase } from '../../../lib/supabaseClient';
import Papa from 'papaparse';

async function insertLawfirmAndGetIds(data) {
    if (data.length === 0) return {};

    const { data: insertedData, error: insertError } = await supabase
        .from('lawfirm')
        .upsert(data, { onConflict: ['lawfirmname'] })
        .select('id, lawfirmname');

    if (insertError) {
        console.error('Error inserting lawfirm:', insertError);
        throw error(500, { message: 'Error inserting lawfirm' });
    }

    return insertedData.reduce((acc, item) => {
        acc[item.lawfirmname] = item.id;
        return acc;
    }, {});
}

async function insertData(table, data, uniqueColumn, lawfirmMap) {
    if (data.length === 0) return;

    const modifiedData = data.map(item => ({
        ...item,
        lawfirm_id: lawfirmMap[item.lawfirmname] || null
    }));

    const { error: insertError } = await supabase.from(table).upsert(modifiedData, { onConflict: [uniqueColumn] });
    if (insertError) {
        console.error(`Error inserting into ${table}:`, insertError);
        throw error(500, { message: `Error inserting into ${table}` });
    }
}

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const data = formData.get('data');

        if (!data) {
            throw error(400, { message: 'No data provided' });
        }

        const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
        const formattedData = parsedData.data;

        const categorizedData = {
            lawfirm: [],
            lawyerscontactprofiles: [],
            products: [],
            websites: []
        };

        formattedData.forEach(row => {
            if (row.lawfirmname) categorizedData.lawfirm.push(row);
            if (row.email) categorizedData.lawyerscontactprofiles.push(row);
            if (row.websitedevelopment) categorizedData.products.push(row);
            if (row.url) categorizedData.websites.push(row);
        });

        const lawfirmMap = await insertLawfirmAndGetIds(categorizedData.lawfirm);

        await insertData('lawyerscontactprofiles', categorizedData.lawyerscontactprofiles, 'email', lawfirmMap);
        await insertData('products', categorizedData.products, 'lawfirmname', lawfirmMap);
        await insertData('websites', categorizedData.websites, 'url', lawfirmMap);

        return json({ success: true, message: 'CSV imported successfully' });
    } catch (err) {
        console.error('Error processing CSV:', err);
        return json({ success: false, error: err.message || 'Error importing data' }, { status: err.status || 500 });
    }
}