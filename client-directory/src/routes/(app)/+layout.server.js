import { supabase } from "../../lib/supabaseClient";

export const load = async () => {
    const { data: lawfirmData } = await supabase.from("lawfirm").select();
    const { data: lawyersData } = await supabase.from("lawyerscontactprofiles").select();

    return {
        lawfirm: lawfirmData ?? [],
        lawyers: lawyersData ?? []
    };

};

