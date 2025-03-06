import { config } from 'dotenv';
config();

import mailchimp from '@mailchimp/mailchimp_marketing';

const apiKey = process.env.VITE_MAILCHIMP_API_KEY;

if (!apiKey) {
    console.error('VITE_MAILCHIMP_API_KEY is not defined in .env file');
    throw new Error('VITE_MAILCHIMP_API_KEY is not defined in .env file');
}

const apiKeyParts = apiKey.split('-');

if (apiKeyParts.length < 2) {
    console.error('VITE_MAILCHIMP_API_KEY is not in the correct format');
    throw new Error('VITE_MAILCHIMP_API_KEY is not in the correct format');
}

const serverPrefix = apiKeyParts[1]; // Extract the data center

mailchimp.setConfig({
    apiKey: apiKey,
    server: serverPrefix,
});

export async function load() {
    try {
        const response = await mailchimp.campaigns.list({ count: 1 });
        const responseTwo = await mailchimp.reports.getAllCampaignReports();
        return {
            response,
            responseTwo
        };
    } catch (error) {
        console.error('Error fetching Mailchimp data:', error);
        return {
            status: 500,
            body: {
                error: 'Failed to fetch Mailchimp data',
                details: error.message
            }
        };
    }
}