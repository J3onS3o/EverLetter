import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Get current user's profile
export const getCurrentUserProfile = async (): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

// Get profile by user ID
export const getProfileById = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Get profile by username
export const getProfileByUsername = async (username: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('User not found');
    }
    throw error;
  }
  return data;
};

// Update user profile
export const updateProfile = async (updates: Partial<Profile>): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if username is already taken (if changing username)
  if (updates.username && updates.username !== user.id) {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', updates.username)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      throw new Error('Username is already taken');
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(updates.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    if (updates.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (updates.username.length > 20) {
      throw new Error('Username cannot be longer than 20 characters');
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Search for users by username
export const searchUsers = async (query: string): Promise<Profile[]> => {
  if (query.length < 2) {
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data || [];
};

// Check if username is available
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username || username.length < 3) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  // If no record found, username is available
  if (error?.code === 'PGRST116') {
    return true;
  }

  if (error) throw error;
  return false;
};

// Get multiple profiles by IDs
export const getProfilesByIds = async (userIds: string[]): Promise<Profile[]> => {
  if (userIds.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (error) throw error;
  return data || [];
};

// Get multiple profiles by usernames
export const getProfilesByUsernames = async (usernames: string[]): Promise<Profile[]> => {
  if (usernames.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('username', usernames);

  if (error) throw error;
  return data || [];
};

// Upload avatar image
export const uploadAvatar = async (file: File): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Delete avatar image
export const deleteAvatar = async (avatarUrl: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Extract file path from URL
  const urlParts = avatarUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) throw error;
};

// Get user stats (letter counts, etc.)
export const getUserStats = async (userId: string): Promise<{
  sent_letters: number;
  received_letters: number;
  drafts: number;
}> => {
  const [{ count: sentCount }, { count: receivedCount }, { count: draftsCount }] = await Promise.all([
    supabase
      .from('letters')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_draft', false),
    supabase
      .from('received_letters')
      .select('id', { count: 'exact' })
      .eq('recipient_id', userId),
    supabase
      .from('letters')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_draft', true)
  ]);

  return {
    sent_letters: sentCount || 0,
    received_letters: receivedCount || 0,
    drafts: draftsCount || 0
  };
};

// Check if user needs profile setup
export const needsProfileSetup = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const profile = await getCurrentUserProfile();
    
    return !profile.username || 
           profile.username === user.id || 
           profile.username === user.email ||
           profile.username.includes('@');
  } catch (error) {
    console.error('Error checking profile setup status:', error);
    return true;
  }
};