import type {NextApiRequest, NextApiResponse} from 'next'
import createClient from '@/utils/supabase/api'

export default async function update_entry(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.status(405).appendHeader('Allow', 'PUT').end()
        return
    }

    const supabase = createClient(req, res)
    const { uid, date, title, description } = req.body

    const { data, error } = await supabase
        .from('entries')
        .update([{ title, description }])
        .eq('uid', uid)
        .eq('date', date)
        .select('*')

    if (error) {
        res.status(500).json({ error: error.message })
        return
    }

    res.status(200).json({ user: data[0] })
}