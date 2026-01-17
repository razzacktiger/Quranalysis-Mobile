// Quran Surah Data - Based on standard Medina Mushaf

export interface Surah {
  number: number;
  name: string; // Arabic name
  transliteration: string;
  ayah_count: number;
  juz_start: number;
  page_start: number;
  page_end: number;
}

export const SURAHS: readonly Surah[] = [
  { number: 1, name: "الفاتحة", transliteration: "Al-Fatihah", ayah_count: 7, juz_start: 1, page_start: 1, page_end: 1 },
  { number: 2, name: "البقرة", transliteration: "Al-Baqarah", ayah_count: 286, juz_start: 1, page_start: 2, page_end: 49 },
  { number: 3, name: "آل عمران", transliteration: "Ali 'Imran", ayah_count: 200, juz_start: 3, page_start: 50, page_end: 76 },
  { number: 4, name: "النساء", transliteration: "An-Nisa", ayah_count: 176, juz_start: 4, page_start: 77, page_end: 106 },
  { number: 5, name: "المائدة", transliteration: "Al-Ma'idah", ayah_count: 120, juz_start: 6, page_start: 106, page_end: 127 },
  { number: 6, name: "الأنعام", transliteration: "Al-An'am", ayah_count: 165, juz_start: 7, page_start: 128, page_end: 150 },
  { number: 7, name: "الأعراف", transliteration: "Al-A'raf", ayah_count: 206, juz_start: 8, page_start: 151, page_end: 176 },
  { number: 8, name: "الأنفال", transliteration: "Al-Anfal", ayah_count: 75, juz_start: 9, page_start: 177, page_end: 186 },
  { number: 9, name: "التوبة", transliteration: "At-Tawbah", ayah_count: 129, juz_start: 10, page_start: 187, page_end: 207 },
  { number: 10, name: "يونس", transliteration: "Yunus", ayah_count: 109, juz_start: 11, page_start: 208, page_end: 221 },
  { number: 11, name: "هود", transliteration: "Hud", ayah_count: 123, juz_start: 11, page_start: 221, page_end: 235 },
  { number: 12, name: "يوسف", transliteration: "Yusuf", ayah_count: 111, juz_start: 12, page_start: 235, page_end: 248 },
  { number: 13, name: "الرعد", transliteration: "Ar-Ra'd", ayah_count: 43, juz_start: 13, page_start: 249, page_end: 255 },
  { number: 14, name: "إبراهيم", transliteration: "Ibrahim", ayah_count: 52, juz_start: 13, page_start: 255, page_end: 261 },
  { number: 15, name: "الحجر", transliteration: "Al-Hijr", ayah_count: 99, juz_start: 14, page_start: 262, page_end: 267 },
  { number: 16, name: "النحل", transliteration: "An-Nahl", ayah_count: 128, juz_start: 14, page_start: 267, page_end: 281 },
  { number: 17, name: "الإسراء", transliteration: "Al-Isra", ayah_count: 111, juz_start: 15, page_start: 282, page_end: 293 },
  { number: 18, name: "الكهف", transliteration: "Al-Kahf", ayah_count: 110, juz_start: 15, page_start: 293, page_end: 304 },
  { number: 19, name: "مريم", transliteration: "Maryam", ayah_count: 98, juz_start: 16, page_start: 305, page_end: 312 },
  { number: 20, name: "طه", transliteration: "Ta-Ha", ayah_count: 135, juz_start: 16, page_start: 312, page_end: 321 },
  { number: 21, name: "الأنبياء", transliteration: "Al-Anbiya", ayah_count: 112, juz_start: 17, page_start: 322, page_end: 331 },
  { number: 22, name: "الحج", transliteration: "Al-Hajj", ayah_count: 78, juz_start: 17, page_start: 332, page_end: 341 },
  { number: 23, name: "المؤمنون", transliteration: "Al-Mu'minun", ayah_count: 118, juz_start: 18, page_start: 342, page_end: 349 },
  { number: 24, name: "النور", transliteration: "An-Nur", ayah_count: 64, juz_start: 18, page_start: 350, page_end: 359 },
  { number: 25, name: "الفرقان", transliteration: "Al-Furqan", ayah_count: 77, juz_start: 18, page_start: 359, page_end: 366 },
  { number: 26, name: "الشعراء", transliteration: "Ash-Shu'ara", ayah_count: 227, juz_start: 19, page_start: 367, page_end: 376 },
  { number: 27, name: "النمل", transliteration: "An-Naml", ayah_count: 93, juz_start: 19, page_start: 377, page_end: 385 },
  { number: 28, name: "القصص", transliteration: "Al-Qasas", ayah_count: 88, juz_start: 20, page_start: 385, page_end: 396 },
  { number: 29, name: "العنكبوت", transliteration: "Al-Ankabut", ayah_count: 69, juz_start: 20, page_start: 396, page_end: 404 },
  { number: 30, name: "الروم", transliteration: "Ar-Rum", ayah_count: 60, juz_start: 21, page_start: 404, page_end: 410 },
  { number: 31, name: "لقمان", transliteration: "Luqman", ayah_count: 34, juz_start: 21, page_start: 411, page_end: 414 },
  { number: 32, name: "السجدة", transliteration: "As-Sajdah", ayah_count: 30, juz_start: 21, page_start: 415, page_end: 417 },
  { number: 33, name: "الأحزاب", transliteration: "Al-Ahzab", ayah_count: 73, juz_start: 21, page_start: 418, page_end: 427 },
  { number: 34, name: "سبإ", transliteration: "Saba", ayah_count: 54, juz_start: 22, page_start: 428, page_end: 434 },
  { number: 35, name: "فاطر", transliteration: "Fatir", ayah_count: 45, juz_start: 22, page_start: 434, page_end: 440 },
  { number: 36, name: "يس", transliteration: "Ya-Sin", ayah_count: 83, juz_start: 22, page_start: 440, page_end: 445 },
  { number: 37, name: "الصافات", transliteration: "As-Saffat", ayah_count: 182, juz_start: 23, page_start: 446, page_end: 452 },
  { number: 38, name: "ص", transliteration: "Sad", ayah_count: 88, juz_start: 23, page_start: 453, page_end: 458 },
  { number: 39, name: "الزمر", transliteration: "Az-Zumar", ayah_count: 75, juz_start: 23, page_start: 458, page_end: 467 },
  { number: 40, name: "غافر", transliteration: "Ghafir", ayah_count: 85, juz_start: 24, page_start: 467, page_end: 476 },
  { number: 41, name: "فصلت", transliteration: "Fussilat", ayah_count: 54, juz_start: 24, page_start: 477, page_end: 482 },
  { number: 42, name: "الشورى", transliteration: "Ash-Shura", ayah_count: 53, juz_start: 25, page_start: 483, page_end: 489 },
  { number: 43, name: "الزخرف", transliteration: "Az-Zukhruf", ayah_count: 89, juz_start: 25, page_start: 489, page_end: 495 },
  { number: 44, name: "الدخان", transliteration: "Ad-Dukhan", ayah_count: 59, juz_start: 25, page_start: 496, page_end: 498 },
  { number: 45, name: "الجاثية", transliteration: "Al-Jathiyah", ayah_count: 37, juz_start: 25, page_start: 499, page_end: 502 },
  { number: 46, name: "الأحقاف", transliteration: "Al-Ahqaf", ayah_count: 35, juz_start: 26, page_start: 502, page_end: 506 },
  { number: 47, name: "محمد", transliteration: "Muhammad", ayah_count: 38, juz_start: 26, page_start: 507, page_end: 510 },
  { number: 48, name: "الفتح", transliteration: "Al-Fath", ayah_count: 29, juz_start: 26, page_start: 511, page_end: 515 },
  { number: 49, name: "الحجرات", transliteration: "Al-Hujurat", ayah_count: 18, juz_start: 26, page_start: 515, page_end: 517 },
  { number: 50, name: "ق", transliteration: "Qaf", ayah_count: 45, juz_start: 26, page_start: 518, page_end: 520 },
  { number: 51, name: "الذاريات", transliteration: "Adh-Dhariyat", ayah_count: 60, juz_start: 26, page_start: 520, page_end: 523 },
  { number: 52, name: "الطور", transliteration: "At-Tur", ayah_count: 49, juz_start: 27, page_start: 523, page_end: 525 },
  { number: 53, name: "النجم", transliteration: "An-Najm", ayah_count: 62, juz_start: 27, page_start: 526, page_end: 528 },
  { number: 54, name: "القمر", transliteration: "Al-Qamar", ayah_count: 55, juz_start: 27, page_start: 528, page_end: 531 },
  { number: 55, name: "الرحمن", transliteration: "Ar-Rahman", ayah_count: 78, juz_start: 27, page_start: 531, page_end: 534 },
  { number: 56, name: "الواقعة", transliteration: "Al-Waqi'ah", ayah_count: 96, juz_start: 27, page_start: 534, page_end: 537 },
  { number: 57, name: "الحديد", transliteration: "Al-Hadid", ayah_count: 29, juz_start: 27, page_start: 537, page_end: 541 },
  { number: 58, name: "المجادلة", transliteration: "Al-Mujadilah", ayah_count: 22, juz_start: 28, page_start: 542, page_end: 545 },
  { number: 59, name: "الحشر", transliteration: "Al-Hashr", ayah_count: 24, juz_start: 28, page_start: 545, page_end: 548 },
  { number: 60, name: "الممتحنة", transliteration: "Al-Mumtahanah", ayah_count: 13, juz_start: 28, page_start: 549, page_end: 551 },
  { number: 61, name: "الصف", transliteration: "As-Saff", ayah_count: 14, juz_start: 28, page_start: 551, page_end: 552 },
  { number: 62, name: "الجمعة", transliteration: "Al-Jumu'ah", ayah_count: 11, juz_start: 28, page_start: 553, page_end: 554 },
  { number: 63, name: "المنافقون", transliteration: "Al-Munafiqun", ayah_count: 11, juz_start: 28, page_start: 554, page_end: 555 },
  { number: 64, name: "التغابن", transliteration: "At-Taghabun", ayah_count: 18, juz_start: 28, page_start: 556, page_end: 557 },
  { number: 65, name: "الطلاق", transliteration: "At-Talaq", ayah_count: 12, juz_start: 28, page_start: 558, page_end: 559 },
  { number: 66, name: "التحريم", transliteration: "At-Tahrim", ayah_count: 12, juz_start: 28, page_start: 560, page_end: 561 },
  { number: 67, name: "الملك", transliteration: "Al-Mulk", ayah_count: 30, juz_start: 29, page_start: 562, page_end: 564 },
  { number: 68, name: "القلم", transliteration: "Al-Qalam", ayah_count: 52, juz_start: 29, page_start: 564, page_end: 566 },
  { number: 69, name: "الحاقة", transliteration: "Al-Haqqah", ayah_count: 52, juz_start: 29, page_start: 566, page_end: 568 },
  { number: 70, name: "المعارج", transliteration: "Al-Ma'arij", ayah_count: 44, juz_start: 29, page_start: 568, page_end: 570 },
  { number: 71, name: "نوح", transliteration: "Nuh", ayah_count: 28, juz_start: 29, page_start: 570, page_end: 571 },
  { number: 72, name: "الجن", transliteration: "Al-Jinn", ayah_count: 28, juz_start: 29, page_start: 572, page_end: 573 },
  { number: 73, name: "المزمل", transliteration: "Al-Muzzammil", ayah_count: 20, juz_start: 29, page_start: 574, page_end: 575 },
  { number: 74, name: "المدثر", transliteration: "Al-Muddaththir", ayah_count: 56, juz_start: 29, page_start: 575, page_end: 577 },
  { number: 75, name: "القيامة", transliteration: "Al-Qiyamah", ayah_count: 40, juz_start: 29, page_start: 577, page_end: 578 },
  { number: 76, name: "الإنسان", transliteration: "Al-Insan", ayah_count: 31, juz_start: 29, page_start: 578, page_end: 580 },
  { number: 77, name: "المرسلات", transliteration: "Al-Mursalat", ayah_count: 50, juz_start: 29, page_start: 580, page_end: 581 },
  { number: 78, name: "النبإ", transliteration: "An-Naba", ayah_count: 40, juz_start: 30, page_start: 582, page_end: 583 },
  { number: 79, name: "النازعات", transliteration: "An-Nazi'at", ayah_count: 46, juz_start: 30, page_start: 583, page_end: 584 },
  { number: 80, name: "عبس", transliteration: "Abasa", ayah_count: 42, juz_start: 30, page_start: 585, page_end: 586 },
  { number: 81, name: "التكوير", transliteration: "At-Takwir", ayah_count: 29, juz_start: 30, page_start: 586, page_end: 586 },
  { number: 82, name: "الانفطار", transliteration: "Al-Infitar", ayah_count: 19, juz_start: 30, page_start: 587, page_end: 587 },
  { number: 83, name: "المطففين", transliteration: "Al-Mutaffifin", ayah_count: 36, juz_start: 30, page_start: 587, page_end: 589 },
  { number: 84, name: "الانشقاق", transliteration: "Al-Inshiqaq", ayah_count: 25, juz_start: 30, page_start: 589, page_end: 589 },
  { number: 85, name: "البروج", transliteration: "Al-Buruj", ayah_count: 22, juz_start: 30, page_start: 590, page_end: 590 },
  { number: 86, name: "الطارق", transliteration: "At-Tariq", ayah_count: 17, juz_start: 30, page_start: 591, page_end: 591 },
  { number: 87, name: "الأعلى", transliteration: "Al-A'la", ayah_count: 19, juz_start: 30, page_start: 591, page_end: 592 },
  { number: 88, name: "الغاشية", transliteration: "Al-Ghashiyah", ayah_count: 26, juz_start: 30, page_start: 592, page_end: 592 },
  { number: 89, name: "الفجر", transliteration: "Al-Fajr", ayah_count: 30, juz_start: 30, page_start: 593, page_end: 594 },
  { number: 90, name: "البلد", transliteration: "Al-Balad", ayah_count: 20, juz_start: 30, page_start: 594, page_end: 594 },
  { number: 91, name: "الشمس", transliteration: "Ash-Shams", ayah_count: 15, juz_start: 30, page_start: 595, page_end: 595 },
  { number: 92, name: "الليل", transliteration: "Al-Layl", ayah_count: 21, juz_start: 30, page_start: 595, page_end: 596 },
  { number: 93, name: "الضحى", transliteration: "Ad-Duha", ayah_count: 11, juz_start: 30, page_start: 596, page_end: 596 },
  { number: 94, name: "الشرح", transliteration: "Ash-Sharh", ayah_count: 8, juz_start: 30, page_start: 596, page_end: 596 },
  { number: 95, name: "التين", transliteration: "At-Tin", ayah_count: 8, juz_start: 30, page_start: 597, page_end: 597 },
  { number: 96, name: "العلق", transliteration: "Al-Alaq", ayah_count: 19, juz_start: 30, page_start: 597, page_end: 597 },
  { number: 97, name: "القدر", transliteration: "Al-Qadr", ayah_count: 5, juz_start: 30, page_start: 598, page_end: 598 },
  { number: 98, name: "البينة", transliteration: "Al-Bayyinah", ayah_count: 8, juz_start: 30, page_start: 598, page_end: 599 },
  { number: 99, name: "الزلزلة", transliteration: "Az-Zalzalah", ayah_count: 8, juz_start: 30, page_start: 599, page_end: 599 },
  { number: 100, name: "العاديات", transliteration: "Al-Adiyat", ayah_count: 11, juz_start: 30, page_start: 599, page_end: 600 },
  { number: 101, name: "القارعة", transliteration: "Al-Qari'ah", ayah_count: 11, juz_start: 30, page_start: 600, page_end: 600 },
  { number: 102, name: "التكاثر", transliteration: "At-Takathur", ayah_count: 8, juz_start: 30, page_start: 600, page_end: 600 },
  { number: 103, name: "العصر", transliteration: "Al-Asr", ayah_count: 3, juz_start: 30, page_start: 601, page_end: 601 },
  { number: 104, name: "الهمزة", transliteration: "Al-Humazah", ayah_count: 9, juz_start: 30, page_start: 601, page_end: 601 },
  { number: 105, name: "الفيل", transliteration: "Al-Fil", ayah_count: 5, juz_start: 30, page_start: 601, page_end: 601 },
  { number: 106, name: "قريش", transliteration: "Quraysh", ayah_count: 4, juz_start: 30, page_start: 602, page_end: 602 },
  { number: 107, name: "الماعون", transliteration: "Al-Ma'un", ayah_count: 7, juz_start: 30, page_start: 602, page_end: 602 },
  { number: 108, name: "الكوثر", transliteration: "Al-Kawthar", ayah_count: 3, juz_start: 30, page_start: 602, page_end: 602 },
  { number: 109, name: "الكافرون", transliteration: "Al-Kafirun", ayah_count: 6, juz_start: 30, page_start: 603, page_end: 603 },
  { number: 110, name: "النصر", transliteration: "An-Nasr", ayah_count: 3, juz_start: 30, page_start: 603, page_end: 603 },
  { number: 111, name: "المسد", transliteration: "Al-Masad", ayah_count: 5, juz_start: 30, page_start: 603, page_end: 603 },
  { number: 112, name: "الإخلاص", transliteration: "Al-Ikhlas", ayah_count: 4, juz_start: 30, page_start: 604, page_end: 604 },
  { number: 113, name: "الفلق", transliteration: "Al-Falaq", ayah_count: 5, juz_start: 30, page_start: 604, page_end: 604 },
  { number: 114, name: "الناس", transliteration: "An-Nas", ayah_count: 6, juz_start: 30, page_start: 604, page_end: 604 },
] as const;

// Juz boundary data (ayah where each juz starts)
const JUZ_BOUNDARIES: { surah: number; ayah: number }[] = [
  { surah: 1, ayah: 1 },    // Juz 1
  { surah: 2, ayah: 142 },  // Juz 2
  { surah: 2, ayah: 253 },  // Juz 3
  { surah: 3, ayah: 93 },   // Juz 4
  { surah: 4, ayah: 24 },   // Juz 5
  { surah: 4, ayah: 148 },  // Juz 6
  { surah: 5, ayah: 83 },   // Juz 7
  { surah: 6, ayah: 111 },  // Juz 8
  { surah: 7, ayah: 88 },   // Juz 9
  { surah: 8, ayah: 41 },   // Juz 10
  { surah: 9, ayah: 93 },   // Juz 11
  { surah: 11, ayah: 6 },   // Juz 12
  { surah: 12, ayah: 53 },  // Juz 13
  { surah: 15, ayah: 1 },   // Juz 14
  { surah: 17, ayah: 1 },   // Juz 15
  { surah: 18, ayah: 75 },  // Juz 16
  { surah: 21, ayah: 1 },   // Juz 17
  { surah: 23, ayah: 1 },   // Juz 18
  { surah: 25, ayah: 21 },  // Juz 19
  { surah: 27, ayah: 56 },  // Juz 20
  { surah: 29, ayah: 46 },  // Juz 21
  { surah: 33, ayah: 31 },  // Juz 22
  { surah: 36, ayah: 28 },  // Juz 23
  { surah: 39, ayah: 32 },  // Juz 24
  { surah: 41, ayah: 47 },  // Juz 25
  { surah: 46, ayah: 1 },   // Juz 26
  { surah: 51, ayah: 31 },  // Juz 27
  { surah: 58, ayah: 1 },   // Juz 28
  { surah: 67, ayah: 1 },   // Juz 29
  { surah: 78, ayah: 1 },   // Juz 30
];

/**
 * Get a surah by its transliterated name (case-insensitive, partial match)
 */
export function getSurahByName(name: string): Surah | undefined {
  const searchName = name.toLowerCase().trim();
  return SURAHS.find(
    (s) =>
      s.transliteration.toLowerCase().includes(searchName) ||
      s.name.includes(name)
  );
}

/**
 * Get a surah by its number (1-114)
 */
export function getSurahByNumber(number: number): Surah | undefined {
  if (number < 1 || number > 114) return undefined;
  return SURAHS[number - 1];
}

/**
 * Get the juz number for a specific surah and ayah
 */
export function getJuzForAyah(surahNumber: number, ayahNumber: number): number {
  // Find the highest juz boundary that is <= the given position
  for (let i = JUZ_BOUNDARIES.length - 1; i >= 0; i--) {
    const boundary = JUZ_BOUNDARIES[i];
    if (
      surahNumber > boundary.surah ||
      (surahNumber === boundary.surah && ayahNumber >= boundary.ayah)
    ) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate pages read for a portion of a surah
 * Returns an estimate based on proportion of ayahs read
 */
export function calculatePagesRead(
  surahNumber: number,
  ayahStart: number,
  ayahEnd: number
): number {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return 0;

  // Validate ayah range
  if (ayahStart < 1 || ayahEnd > surah.ayah_count || ayahStart > ayahEnd) {
    return 0;
  }

  const totalPages = surah.page_end - surah.page_start + 1;
  const ayahsRead = ayahEnd - ayahStart + 1;
  const proportion = ayahsRead / surah.ayah_count;

  // Return pages read, minimum 0.1 for any valid reading
  return Math.max(0.1, Math.round(totalPages * proportion * 10) / 10);
}

/**
 * Search surahs by name or transliteration
 */
export function searchSurahs(query: string): Surah[] {
  if (!query.trim()) return [...SURAHS];

  const searchQuery = query.toLowerCase().trim();
  return SURAHS.filter(
    (s) =>
      s.transliteration.toLowerCase().includes(searchQuery) ||
      s.name.includes(query) ||
      s.number.toString() === searchQuery
  );
}
