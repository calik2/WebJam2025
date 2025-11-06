import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }
  const supabase = createClient(req, res)

  const { date } = req.query;
  
  // TODO: read cookies to get the uid
  const { data: entry } = await supabase
    .from("entries")
    .select()
    .eq('uid', 'ff47c2bd-3de5-4daa-a782-655a8e1a09a8')
    .eq('date', date);  
  res.status(200).json({body: entry})
  
}