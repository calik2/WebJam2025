import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function delete_entry_tag(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.status(405).appendHeader('Allow', 'DELETE').end()
        return
    }

    const supabase = createClient(req, res)
    const { tag_id, entry_id } = req.body

    const { data, error } = await supabase
        .from('entry_tags')
        .delete()
        .eq('tag_id', tag_id)
        .eq('entry_id', entry_id)
        .select('*')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({ user: data[0] })
}