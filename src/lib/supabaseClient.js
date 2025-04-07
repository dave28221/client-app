
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://clients.liftlegal.com',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2a3RrcXF2aGxheHB2bmFqam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYxNDczMzIsImV4cCI6MjAyMTcyMzMzMn0.RYwBuv406zJo29A2J76iDzIMGfZauL3EbSTRcJQ3F5o'
);
