import test from 'node:test';
import assert from 'node:assert/strict';

// Test phone number normalization
import { normalizeLKPhone, telLink, whatsappLink, formatPhoneDisplay } from '../src/lib/phone.ts';
import { validateTechnicianInput, generateSlug } from '../src/lib/validation/technician.ts';
import { districts, getDistrict, getDistrictName } from '../src/lib/districts.ts';
import { serviceCategories, getCategoryName, getCategoryBySlug } from '../src/lib/categories.ts';

test('Phone normalization handles standard 10-digit Sri Lankan mobile numbers', () => {
  const result = normalizeLKPhone('0771234567');
  assert.equal(result, '+94771234567');
});

test('Phone normalization handles +94 prefixed numbers', () => {
  const result = normalizeLKPhone('+94771234567');
  assert.equal(result, '+94771234567');
});

test('Phone normalization handles numbers with spaces and hyphens', () => {
  const result = normalizeLKPhone('077-123 4567');
  assert.equal(result, '+94771234567');
});

test('Phone normalization rejects invalid short strings', () => {
  const result = normalizeLKPhone('12345');
  assert.equal(result, '');
});

test('telLink produces correct tel: URI scheme', () => {
  const link = telLink('0771234567');
  assert.equal(link, 'tel:+94771234567');
});

test('whatsappLink produces correct https://wa.me/ URL without plus symbol', () => {
  const link = whatsappLink('0771234567');
  assert.equal(link, 'https://wa.me/94771234567');
});

test('formatPhoneDisplay formats cleanly for human display', () => {
  const formatted = formatPhoneDisplay('0771234567');
  assert.equal(formatted, '+94 77 123 4567');
});

test('Districts database contains exactly 25 Sri Lankan administrative districts', () => {
  assert.equal(districts.length, 25);
  const colombo = getDistrict('CMB');
  assert.ok(colombo);
  assert.equal(colombo.name_en, 'Colombo');
  assert.equal(colombo.name_si, 'කොළඹ');
});

test('District name translation retrieves correct locale strings', () => {
  assert.equal(getDistrictName('GLL', 'en'), 'Galle');
  assert.equal(getDistrictName('GLL', 'si'), 'ගාල්ල');
});

test('Initial service categories contain the 8 required categories', () => {
  assert.equal(serviceCategories.length, 8);
  const ac = getCategoryBySlug('ac');
  assert.ok(ac);
  assert.equal(getCategoryName(ac, 'en'), 'Air Conditioning');
  assert.equal(getCategoryName(ac, 'si'), 'වායු සමීකරණ සේවා');
});

test('Validation rejects technician with missing name or town', () => {
  const res = validateTechnicianInput({
    name: '',
    phone: '0771234567',
    whatsapp_number: '',
    description_si: '',
    description_en: '',
    district_code: 'CMB',
    town: '',
    category_ids: ['a0000000-0000-0000-0000-000000000001'],
  });

  assert.equal(res.valid, false);
  assert.ok(res.errors.name);
  assert.ok(res.errors.town);
});

test('Validation rejects technician with invalid phone format', () => {
  const res = validateTechnicianInput({
    name: 'Saman Silva',
    phone: 'invalid-phone-123',
    whatsapp_number: '',
    description_si: '',
    description_en: '',
    district_code: 'CMB',
    town: 'Nugegoda',
    category_ids: ['a0000000-0000-0000-0000-000000000001'],
  });

  assert.equal(res.valid, false);
  assert.ok(res.errors.phone);
});

test('Validation rejects technician with no categories selected', () => {
  const res = validateTechnicianInput({
    name: 'Saman Silva',
    phone: '0771234567',
    whatsapp_number: '0771234567',
    description_si: '',
    description_en: '',
    district_code: 'CMB',
    town: 'Nugegoda',
    category_ids: [],
  });

  assert.equal(res.valid, false);
  assert.ok(res.errors.category_ids);
});

test('Validation accepts valid technician submission', () => {
  const res = validateTechnicianInput({
    name: 'Kasun Wickramasinghe',
    phone: '0712345678',
    whatsapp_number: '0712345678',
    description_si: 'නළ කාර්මික සේවා',
    description_en: 'Plumbing services',
    district_code: 'CMB',
    town: 'Maharagama',
    category_ids: ['a0000000-0000-0000-0000-000000000001'],
    indicative_price_lkr: 2000,
  });

  assert.equal(res.valid, true);
  assert.equal(Object.keys(res.errors).length, 0);
});

test('generateSlug generates clean URL-safe identifier', () => {
  const slug = generateSlug('Sunil Perera & Sons');
  assert.ok(slug.startsWith('sunil-perera-sons-'));
});
