// Utility functions for age calculation from South African ID components
// SA ID format: YYMMDDSSSSCAZ — the first 6 digits (YYMMDD) encode date of birth.
// Century inference rule:
//   - If YY <= currentYearTwoDigits => 2000 + YY
//   - Else => 1900 + YY

export function computeAgeFromYYMMDD(yyMMdd, now = new Date()) {
  if (!yyMMdd || typeof yyMMdd !== 'string') {
    throw new Error('yyMMdd must be a 6-character string');
  }
  const clean = yyMMdd.replace(/[^0-9]/g, '');
  if (clean.length !== 6) {
    throw new Error('yyMMdd must contain exactly 6 digits (YYMMDD)');
  }

  const yy = parseInt(clean.slice(0, 2), 10);
  const mm = parseInt(clean.slice(2, 4), 10);
  const dd = parseInt(clean.slice(4, 6), 10);

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    throw new Error('Invalid month or day in YYMMDD');
  }

  const currentTwoDigitYear = now.getFullYear() % 100;
  const century = yy <= currentTwoDigitYear ? 2000 : 1900;
  const fullYear = century + yy;

  const birthDate = new Date(fullYear, mm - 1, dd);
  if (Number.isNaN(birthDate.getTime())) {
    throw new Error('Invalid date constructed from YYMMDD');
  }

  let age = now.getFullYear() - fullYear;
  const hasHadBirthdayThisYear =
    now.getMonth() > (mm - 1) || (now.getMonth() === (mm - 1) && now.getDate() >= dd);
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function computeAgeFromSAId(saId, now = new Date()) {
  if (!saId) throw new Error('SA ID is required');
  const clean = String(saId).replace(/[^0-9]/g, '');
  if (clean.length < 6) throw new Error('SA ID must contain at least the first 6 digits (YYMMDD)');
  return computeAgeFromYYMMDD(clean.slice(0, 6), now);
}

export function getAgeCategory(age) {
  if (age < 0) return 'Unknown';
  if (age <= 2) return 'Toddler';
  if (age <= 12) return 'Child';
  if (age <= 17) return 'Teen';
  if (age <= 64) return 'Adult';
  return 'Senior';
}

// Example helper to stringify a quick summary
export function summarizeAgeFromYYMMDD(yyMMdd, now = new Date()) {
  const age = computeAgeFromYYMMDD(yyMMdd, now);
  const category = getAgeCategory(age);
  return { age, category };
}
