import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }
  const supabase = createClient(req, res)
  
  const { min_date, max_date, top } = req.query;

  let query = supabase
      .from("entries")
      .select()
      .eq('uid', 'ff47c2bd-3de5-4daa-a782-655a8e1a09a8');

  if (min_date !== undefined)
  {
    query = query.gte('date', min_date)
  }
  if (max_date !== undefined){
    query = query.lte('date', max_date)
  }
    if ((top ?? "") != ""){
    query = query.limit(parseInt(top as string))
  }

  // TODO: read cookies to get the uid
  const { data: entries } = await query
  res.status(200).json({body: entries})
}