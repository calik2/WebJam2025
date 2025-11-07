import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

export default async function get_entry_tag(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).appendHeader('Allow', 'GET').end()
        return
    }
    const supabase = createClient(req, res)

    const { entry_id } = req.query;
    
    const { data: entry, error } = await supabase
        .from("entry_tags")
        .select()
        .eq('entry_id', entry_id); 
    
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({body: entry})
}