import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function add_entry_tag(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).appendHeader('Allow', 'POST').end()
        return
    }

    const supabase = createClient(req, res)
    const { tag_id, entry_id } = req.body

    const { data, error } = await supabase
        .from('entry_tags')
        .insert([{ tag_id, entry_id }])
        .select('*')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({ user: data[0] })
}