/**
 * Quick test script for AI session extraction
 * Run with: npx tsx scripts/test-ai-extraction.ts
 */

import 'dotenv/config';

// Check env vars are loaded
console.log('Environment check:');
console.log('- FIREBASE_API_KEY:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('- FIREBASE_PROJECT_ID:', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('');

// Dynamic import to ensure env is loaded first
async function main() {
  const { extractSessionFromMessage } = await import('../lib/api/prompts');

  const testCases = [
    'I practiced Al-Fatiha for 20 minutes',
    'Memorized surah yaseen ayah 1-10 today, went well',
    'Quick review of juz 30',
  ];

  console.log('Testing AI Session Extraction\n');
  console.log('='.repeat(60));

  for (const input of testCases) {
    console.log(`\nInput: "${input}"`);
    console.log('-'.repeat(60));

    try {
      const result = await extractSessionFromMessage(input);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
    }

    console.log('='.repeat(60));
  }
}

main().catch(console.error);
