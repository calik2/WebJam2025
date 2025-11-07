import type { NextApiRequest, NextApiResponse } from 'next'
import { redirect } from 'next/navigation'
import createClient from '@/utils/supabase/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }
  const supabase = createClient(req, res)

  const { data, error: auth_error } = await supabase.auth.getUser()
  if (auth_error || !data?.user) {
    redirect('/login')
  }
  console.log(data.user.id)

  
  const { min_date, max_date, top } = req.query;

  let query = supabase
      .from("entries")
      .select()
      .eq('uid', data.user.id);

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
  const { data: entries, error } = await query

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  
  res.status(200).json({body: entries})

  
}