import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function delete_tag(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.status(405).appendHeader('Allow', 'DELETE').end()
        return
    }

    const supabase = createClient(req, res)
    const { uid, tag_id } = req.body

    const { data, error } = await supabase
        .from('tags')
        .delete()
        .eq('uid', uid)
        .eq('tag_id', tag_id)
        .select('*')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({ user: data[0] })
}