import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'sb_publishable_vYCKlU2lbPkXpUDj1sILow_DskJCRVS'
);

async function check() {
  console.log('=== blog_posts ===');
  const { data: blogs, error: e1 } = await supabase.from('blog_posts').select('*').limit(2);
  if (e1) console.error('ERROR:', e1.message);
  else console.log(JSON.stringify(blogs, null, 2));

  console.log('\n=== gallery_items ===');
  const { data: gallery, error: e2 } = await supabase.from('gallery_items').select('*').limit(2);
  if (e2) console.error('ERROR:', e2.message);
  else console.log(JSON.stringify(gallery, null, 2));

  console.log('\n=== board_posts ===');
  const { data: board, error: e3 } = await supabase.from('board_posts').select('*').limit(2);
  if (e3) console.error('ERROR:', e3.message);
  else console.log(JSON.stringify(board, null, 2));
}

check().catch(console.error);
