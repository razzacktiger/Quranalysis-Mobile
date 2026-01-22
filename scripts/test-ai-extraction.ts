/**
 * Quick test script for AI extraction (session, mistakes, combined)
 * Run with: npx tsx scripts/test-ai-extraction.ts
 */

import 'dotenv/config';

// Check env vars are loaded
console.log('Environment check:');
console.log('- FIREBASE_API_KEY:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('- FIREBASE_PROJECT_ID:', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('');

async function main() {
  const {
    extractSessionFromMessage,
    extractMistakesFromMessage,
    extractFromMessage,
  } = await import('../lib/api/prompts');

  // ============================================
  // SESSION EXTRACTION TESTS
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('SESSION EXTRACTION TESTS');
  console.log('='.repeat(60));

  const sessionTests = [
    'I practiced Al-Fatiha for 20 minutes',
    'Memorized surah yaseen ayah 1-10 today, went well',
    'Quick review of juz 30',
  ];

  for (const input of sessionTests) {
    console.log(`\nInput: "${input}"`);
    console.log('-'.repeat(60));
    try {
      const result = await extractSessionFromMessage(input);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    }
  }

  // ============================================
  // MISTAKE EXTRACTION TESTS
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('MISTAKE EXTRACTION TESTS');
  console.log('='.repeat(60));

  const mistakeTests = [
    { input: 'I made a tajweed mistake on ayah 5, forgot the ghunna', surah: 'Al-Fatiha' },
    { input: 'Kept hesitating on verse 10-12, and mixed up verse 15 with something similar', surah: 'Al-Baqarah' },
    { input: 'Made a small slip with the madd', surah: undefined },
  ];

  for (const { input, surah } of mistakeTests) {
    console.log(`\nInput: "${input}"`);
    console.log(`Context surah: ${surah || 'None'}`);
    console.log('-'.repeat(60));
    try {
      const result = await extractMistakesFromMessage(input, surah);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    }
  }

  // ============================================
  // COMBINED EXTRACTION TEST
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('COMBINED EXTRACTION TEST');
  console.log('='.repeat(60));

  const combinedInput = 'I practiced Al-Mulk for 30 minutes, went okay but I kept hesitating on verse 15 and made a ghunna mistake on verse 20';
  console.log(`\nInput: "${combinedInput}"`);
  console.log('-'.repeat(60));
  try {
    const result = await extractFromMessage(combinedInput);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('ALL TESTS COMPLETE');
  console.log('='.repeat(60));
}

main().catch(console.error);
