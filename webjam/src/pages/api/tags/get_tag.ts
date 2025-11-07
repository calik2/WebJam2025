import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

export default async function get_all_tags(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }
  const supabase = createClient(req, res)
  
  const { tag_id } = req.query;

  let query = supabase
      .from("tags")
      .select()
      .eq('tag_id', tag_id)
      .single();

  // TODO: read cookies to get the uid
  const { data: entries, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  
  res.status(200).json({body: entries})
}