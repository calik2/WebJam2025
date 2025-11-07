  import type { NextApiRequest, NextApiResponse } from 'next'
  import createClient from '@/utils/supabase/api'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
      res.status(405).appendHeader('Allow', 'GET').end()
      return
    }
    const supabase = createClient(req, res)
    const { data: { user } } = await supabase.auth.getUser();

    const { date } = req.query;
    
    // TODO: read cookies to get the uid
    const { data: entry, error } = await supabase
      .from("entries")
      .select()
      .eq('uid', user?.id)
      .eq('date', date)
      .maybeSingle();
    
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({body: entry})
    
  }