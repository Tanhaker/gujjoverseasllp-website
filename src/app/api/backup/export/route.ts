import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // 1. Verify User is Superadmin
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden. Superadmin access required.' }, { status: 403 });
  }

  try {
    // 2. Fetch all necessary tables
    const [
      { data: products },
      { data: categories },
      { data: users },
      { data: inquiries },
      { data: audit_logs },
      { data: site_settings }
    ] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('inquiries').select('*'),
      supabase.from('audit_logs').select('*'),
      supabase.from('site_settings').select('*')
    ]);

    // 3. Construct JSON Payload
    const backupPayload = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      tables: {
        products: products || [],
        categories: categories || [],
        profiles: users || [],
        inquiries: inquiries || [],
        audit_logs: audit_logs || [],
        site_settings: site_settings || []
      }
    };

    // 4. Return as downloadable file
    const fileName = `gujjoverseas_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    return new NextResponse(JSON.stringify(backupPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });

  } catch (error) {
    console.error('Backup generation failed:', error);
    return NextResponse.json({ error: 'Internal Server Error during backup generation.' }, { status: 500 });
  }
}
