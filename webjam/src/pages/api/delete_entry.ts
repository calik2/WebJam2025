import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function delete_entry(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.status(405).appendHeader('Allow', 'DELETE').end()
        return
    }

    const supabase = createClient(req, res)
    const { uid, date } = req.body

    const { data, error } = await supabase
        .from('entries')
        .delete()
        .eq('uid', uid)
        .eq('date', date)
        .select('*')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({ user: data[0] })
}