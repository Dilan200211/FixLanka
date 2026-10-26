-- FixLanka Seed Data
-- 1. Districts of Sri Lanka (25 Administrative Districts)

insert into public.districts (code, name_si, name_en) values
  ('CMB', 'කොළඹ', 'Colombo'),
  ('GMP', 'ගම්පහ', 'Gampaha'),
  ('KLT', 'කළුතර', 'Kalutara'),
  ('KDY', 'මහනුවර', 'Kandy'),
  ('MTL', 'මාතලේ', 'Matale'),
  ('NWE', 'නුවරඑළිය', 'Nuwara Eliya'),
  ('GLL', 'ගාල්ල', 'Galle'),
  ('MTR', 'මාතර', 'Matara'),
  ('HBT', 'හම්බන්තොට', 'Hambantota'),
  ('JFN', 'යාපනය', 'Jaffna'),
  ('KLN', 'කිලිනොච්චි', 'Kilinochchi'),
  ('MNR', 'මන්නාරම', 'Mannar'),
  ('MUL', 'මුලතිව්', 'Mullaitivu'),
  ('VAV', 'වව්නියාව', 'Vavuniya'),
  ('TRC', 'ත්‍රිකුණාමලය', 'Trincomalee'),
  ('BTT', 'මඩකලපුව', 'Batticaloa'),
  ('AMP', 'අම්පාර', 'Ampara'),
  ('PUT', 'පුත්තලම', 'Puttalam'),
  ('KUR', 'කුරුණෑගල', 'Kurunegala'),
  ('ANU', 'අනුරාධපුරය', 'Anuradhapura'),
  ('POL', 'පොළොන්නරුව', 'Polonnaruwa'),
  ('BAD', 'බදුල්ල', 'Badulla'),
  ('MON', 'මොණරාගල', 'Monaragala'),
  ('KEG', 'කෑගල්ල', 'Kegalle'),
  ('RAT', 'රත්නපුර', 'Ratnapura')
on conflict (code) do update set
  name_si = excluded.name_si,
  name_en = excluded.name_en;

-- 2. Service Categories
insert into public.service_categories (id, slug, name_si, name_en, icon, active) values
  ('a0000000-0000-0000-0000-000000000001', 'plumbing', 'නළ කාර්මික සේවා', 'Plumbing', 'Wrench', true),
  ('a0000000-0000-0000-0000-000000000002', 'electrical', 'විදුලි අලුත්වැඩියා', 'Electrical Repairs', 'Zap', true),
  ('a0000000-0000-0000-0000-000000000003', 'ac', 'වායු සමීකරණ සේවා', 'Air Conditioning', 'Snowflake', true),
  ('a0000000-0000-0000-0000-000000000004', 'appliances', 'ගෘහ උපකරණ අලුත්වැඩියා', 'Appliance Repairs', 'WashingMachine', true),
  ('a0000000-0000-0000-0000-000000000005', 'home-repairs', 'නිවාස අලුත්වැඩියා', 'Home Repairs', 'Hammer', true),
  ('a0000000-0000-0000-0000-000000000006', 'painting', 'තීන්ත ආලේපන සහ ලී වැඩ', 'Painting & Carpentry', 'PaintBucket', true),
  ('a0000000-0000-0000-0000-000000000007', 'electronics', 'දුරකථන සහ පරිගණක අලුත්වැඩියා', 'Phone & Computer Repairs', 'Smartphone', true),
  ('a0000000-0000-0000-0000-000000000008', 'cleaning', 'පිරිසිදු කිරීමේ සේවා', 'Cleaning Services', 'SprayCan', true)
on conflict (slug) do update set
  name_si = excluded.name_si,
  name_en = excluded.name_en,
  icon = excluded.icon,
  active = excluded.active;

-- 3. Demo Technicians (Clearly marked as demo data with is_demo = true)
-- To purge all demo records before production deployment, run:
-- DELETE FROM public.technicians WHERE is_demo = true;

insert into public.technicians (
  id, name, slug, phone, whatsapp_number, description_si, description_en,
  district_code, town, indicative_price_lkr, published, verified, is_demo
) values
  (
    'b0000000-0000-0000-0000-000000000001',
    'Kamal Perera',
    'kamal-perera',
    '',
    '',
    'නළ කාර්මික සේවා සපයන අත්දැකීම් බහුල වෘත්තිකයෙකු. නිවාස සහ වාණිජ ගොඩනැගිලි සඳහා සේවා සපයයි.',
    'Experienced plumber providing residential and commercial plumbing services.',
    'CMB',
    'Nugegoda',
    2500,
    true,
    false,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Nimal Silva',
    'nimal-silva',
    '',
    '',
    'විදුලි රැහැන් කිරීම, විදුලි පුවරු සවි කිරීම, සහ නඩත්තු කිරීමේ සේවා.',
    'Electrical wiring, panel installations, and maintenance services.',
    'GMP',
    'Kadawatha',
    3000,
    true,
    false,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'Ruwan Jayasinghe',
    'ruwan-jayasinghe',
    '',
    '',
    'සියලු වර්ගයේ වායු සමීකරණ යන්ත්‍ර සවි කිරීම, අලුත්වැඩියා කිරීම සහ ගෑස් පිරවීම.',
    'AC installation, repair, and gas refilling for all brands.',
    'CMB',
    'Dehiwala',
    4000,
    true,
    false,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'Saman Kumara',
    'saman-kumara',
    '',
    '',
    'රෙදි සෝදන යන්ත්‍ර සහ ශීතකරණ අලුත්වැඩියා. සියලු ප්‍රමුඛ සන්නාම.',
    'Washing machine and refrigerator repairs. All major brands.',
    'KDY',
    'Peradeniya',
    3500,
    true,
    false,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'Priya Mendis',
    'priya-mendis',
    '',
    '',
    'තීන්ත ආලේපනය, ලී වැඩ, සහ සාමාන්‍ය නිවාස අලුත්වැඩියා සේවා.',
    'Painting, woodwork, and general home repair services.',
    'GLL',
    'Galle Fort',
    2000,
    true,
    false,
    true
  ),
  (
    'b0000000-0000-0000-0000-000000000006',
    'Dinesh Fernando',
    'dinesh-fernando',
    '',
    '',
    'දුරකථන හා පරිගණක අලුත්වැඩියා — තිර මාරු කිරීම, මෘදුකාංග ස්ථාපනය.',
    'Phone and computer repairs — screen replacements, software installation.',
    'CMB',
    'Bambalapitiya',
    1500,
    true,
    false,
    true
  )
on conflict (slug) do nothing;

-- 4. Connect Demo Technicians to Services
insert into public.technician_services (technician_id, category_id) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'), -- Kamal -> Plumbing
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'), -- Nimal -> Electrical
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003'), -- Ruwan -> AC
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004'), -- Saman -> Appliances
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005'), -- Priya -> Home Repairs
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006'), -- Priya -> Painting
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000007')  -- Dinesh -> Electronics
on conflict do nothing;
