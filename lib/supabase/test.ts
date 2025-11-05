import { supabase, isSupabaseConfigured } from './client';

/**
 * Test Supabase connection
 * Returns true if connection is successful, false otherwise
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  error?: Error;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials not configured. Please check your .env file.',
    };
  }

  try {
    // Test the connection by attempting to fetch from a table
    // This will fail if tables don't exist, but will confirm connectivity
    const { error } = await supabase!.from('items').select('id').limit(1);

    if (error) {
      // If error is about table not existing, connection is still successful
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! Tables need to be created. See lib/supabase/README.md for SQL setup.',
        };
      }

      throw error;
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase and verified tables exist!',
    };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return {
      success: false,
      message: 'Failed to connect to Supabase',
      error: error as Error,
    };
  }
}
