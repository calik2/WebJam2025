import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

export default async function get_all_tags(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }
  const supabase = createClient(req, res)
  
  const { } = req.query;

  let query = supabase
      .from("tags")
      .select()
      .eq('uid', 'ff47c2bd-3de5-4daa-a782-655a8e1a09a8');

  // TODO: read cookies to get the uid
  const { data: entries, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  
  res.status(200).json({body: entries})
}