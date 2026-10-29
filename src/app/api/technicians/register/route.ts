import { NextResponse } from 'next/server';
import { createAdminServiceRoleClient, createPublicServerClient } from '@/lib/supabase/server';
import { validateTechnicianInput, generateSlug } from '@/lib/validation/technician';
import { normalizeLKPhone } from '@/lib/phone';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const normalizedPhone = normalizeLKPhone(body.phone || '');
    const normalizedWhatsapp = body.whatsapp_number
      ? normalizeLKPhone(body.whatsapp_number)
      : normalizedPhone;

    // Validate inputs
    const validation = validateTechnicianInput({
      name: body.name || '',
      phone: body.phone || '',
      whatsapp_number: body.whatsapp_number || body.phone || '',
      description_si: body.description_si || '',
      description_en: body.description_en || '',
      district_code: body.district_code || '',
      town: body.town || '',
      category_ids: Array.isArray(body.category_ids) ? body.category_ids : [],
      indicative_price_lkr: body.indicative_price_lkr ? Number(body.indicative_price_lkr) : undefined,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Determine Supabase client: prefer admin service role, fallback to public server client
    const supabase = createAdminServiceRoleClient() || createPublicServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const slug = generateSlug(body.name);

    // 1. Insert technician as UNPUBLISHED and UNVERIFIED (Pending review)
    const { data: tech, error: techError } = await supabase
      .from('technicians')
      .insert({
        name: body.name.trim(),
        slug,
        phone: normalizedPhone,
        whatsapp_number: normalizedWhatsapp,
        district_code: body.district_code,
        town: body.town.trim(),
        indicative_price_lkr: body.indicative_price_lkr ? Number(body.indicative_price_lkr) : null,
        description_en: body.description_en ? body.description_en.trim() : '',
        description_si: body.description_si ? body.description_si.trim() : '',
        profile_image_url: body.profile_image_url ? body.profile_image_url.trim() : null,
        published: false, // Requires admin approval!
        verified: false,
        is_demo: false,
      })
      .select('id, name, slug')
      .single();

    if (techError || !tech) {
      console.error('Registration insertion error:', techError);
      return NextResponse.json(
        { error: techError?.message || 'Failed to record technician profile.' },
        { status: 500 }
      );
    }

    // 2. Insert service category associations
    if (body.category_ids && body.category_ids.length > 0) {
      const junctionRows = body.category_ids.map((catId: string) => ({
        technician_id: tech.id,
        category_id: catId,
      }));

      const { error: serviceError } = await supabase
        .from('technician_services')
        .insert(junctionRows);

      if (serviceError) {
        console.error('Technician services junction error:', serviceError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your registration has been submitted successfully and is pending admin approval.',
        technician: {
          id: tech.id,
          name: tech.name,
          slug: tech.slug,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Unexpected error in technician registration API:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error processing registration.' },
      { status: 500 }
    );
  }
}
