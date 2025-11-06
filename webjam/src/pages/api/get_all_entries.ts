import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function get_all_entries(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).appendHeader('Allow', 'GET').end()
        return
    }

    const supabase = createClient(req, res)
    const { uid } = req.query

    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('uid', uid)
        
    if (error) {
        res.status(500).json({ error: error.message })
        return
    }
    
    res.status(200).json({ entries: data })
}