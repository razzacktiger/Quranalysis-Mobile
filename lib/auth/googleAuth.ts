import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../supabase';

// Required for web browser auth session
WebBrowser.maybeCompleteAuthSession();

// Use custom scheme for development/production builds
const redirectUri = 'quranalysis://google-auth';


export async function signInWithGoogle(): Promise<void> {
  try {
    // Start OAuth flow with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('No OAuth URL returned');

    // Open browser for Google sign-in
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success') {
      throw new Error('Authentication cancelled');
    }

    // Extract tokens from callback URL
    const url = result.url;
    const params = extractHashParams(url);

    if (!params.access_token || !params.refresh_token) {
      throw new Error('Missing tokens in callback');
    }

    // Set the session in Supabase
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });

    if (sessionError) throw sessionError;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

function extractHashParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};

  // Check for hash fragment first (OAuth typically uses hash)
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hash = url.substring(hashIndex + 1);
    const searchParams = new URLSearchParams(hash);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  // Also check query params as fallback
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1 && hashIndex === -1) {
    const query = url.substring(queryIndex + 1);
    const searchParams = new URLSearchParams(query);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  return params;
}
