import { supabase } from '../lib/supabase';

export interface Letter {
  id: string;
  title: string;
  recipient_username: string; // Changed from recipient
  content: string;
  created_at: string;
  scheduled_date?: string;
  user_id: string;
  sender_id?: string;
  sender_name?: string;
  is_draft?: boolean;
  read?: boolean;
  type: 'sent' | 'received';
  delivery_frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  delivery_end_date?: string;
  tags?: string[];
}

export interface ReceivedLetter {
  id: string;
  original_letter_id: string;
  recipient_id: string;
  sender_id: string;
  received_at: string;
  read: boolean;
  delivery_sequence: number;
  letter?: Letter;
  sender_username?: string;
  sender_display_name?: string; // Added for profiles
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Get user profile by username
export const getProfileByUsername = async (username: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
};

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

// Save a letter as draft
export const saveDraft = async (letterData: Partial<Letter>): Promise<Letter> => {
  const { data, error } = await supabase
    .from('letters')
    .insert([{ ...letterData, is_draft: true }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Send a letter immediately
export const sendLetter = async (letterId: string, recipientUsername: string): Promise<Letter> => {
  // First verify the recipient exists
  try {
    await getProfileByUsername(recipientUsername);
  } catch (error) {
    throw new Error('Recipient username does not exist');
  }

  const { data, error } = await supabase
    .from('letters')
    .update({ 
      is_draft: false,
      recipient_username: recipientUsername,
      scheduled_date: new Date().toISOString()
    })
    .eq('id', letterId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Schedule a letter for future delivery
export const scheduleLetter = async (
  letterId: string, 
  deliveryDate: string, 
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' = 'once', 
  endDate: string | null = null
): Promise<Letter> => {
  const { data, error } = await supabase
    .from('letters')
    .update({ 
      is_draft: false,
      scheduled_date: deliveryDate,
      delivery_frequency: frequency,
      delivery_end_date: endDate
    })
    .eq('id', letterId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get received letters with sorting/filtering
export const getReceivedLetters = async (
  sortBy: string = 'received_at',
  sortDir: string = 'desc',
  filterRead: string = 'all',
  searchQuery: string = ''
): Promise<ReceivedLetter[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Since we can't use RPC directly with the new structure, we'll query the view
  let query = supabase
    .from('received_letters_view')
    .select('*')
    .eq('recipient_id', user.id);

  // Apply filters
  if (filterRead !== 'all') {
    query = query.eq('read', filterRead === 'read');
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,sender_display_name.ilike.%${searchQuery}%`);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortDir === 'asc' });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

// Get drafts
export const getDrafts = async (): Promise<Letter[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_draft', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Get sent letters
export const getSentLetters = async (): Promise<Letter[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_draft', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Mark a letter as read
export const markAsRead = async (letterId: string): Promise<void> => {
  const { error } = await supabase
    .from('received_letters')
    .update({ read: true })
    .eq('id', letterId);

  if (error) throw error;
};

// Get all letters for the current user (both sent and received)
export const getAllLetters = async (): Promise<Letter[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch sent letters
  const { data: sentLetters, error: sentError } = await supabase
    .from('letters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (sentError) throw sentError;

  // Fetch received letters using the view
  const { data: receivedLetters, error: receivedError } = await supabase
    .from('received_letters_view')
    .select('*')
    .eq('recipient_id', user.id)
    .order('received_at', { ascending: false });

  if (receivedError) throw receivedError;

  // Transform and combine letters
  const transformedSentLetters = (sentLetters || []).map(letter => ({
    ...letter,
    type: 'sent' as const
  }));

  const transformedReceivedLetters = (receivedLetters || []).map(item => ({
    ...item,
    id: item.id, // Use the received_letter id
    read: item.read,
    created_at: item.received_at,
    sender_name: item.sender_display_name || item.sender_username || 'Unknown',
    recipient_username: item.letter?.recipient_username || '',
    type: 'received' as const
  }));

  return [...transformedSentLetters, ...transformedReceivedLetters];
};

// Create a new letter
// Create a new letter
export const createLetter = async (letterData: {
  title: string;
  content: string;
  recipient_username: string;
  scheduled_date?: string;
  delivery_frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  delivery_end_date?: string;
  tags?: string[];
  is_draft?: boolean;
}): Promise<Letter> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // If not a draft, verify recipient exists
  if (!letterData.is_draft && letterData.recipient_username) {
    try {
      await getProfileByUsername(letterData.recipient_username);
    } catch (error) {
      throw new Error('Recipient username does not exist');
    }
  }

  // Create data object with both old and new column names for compatibility
  const insertData: any = {
    ...letterData, 
    user_id: user.id,
    recipient_username: letterData.recipient_username,
    recipient: letterData.recipient_username // Add this for backward compatibility
  };

  const { data, error } = await supabase
    .from('letters')
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing letter
export const updateLetter = async (
  letterId: string, 
  updates: Partial<Letter>
): Promise<Letter> => {
  // If updating recipient and not a draft, verify recipient exists
  if (updates.recipient_username && !updates.is_draft) {
    try {
      await getProfileByUsername(updates.recipient_username);
    } catch (error) {
      throw new Error('Recipient username does not exist');
    }
  }

  const { data, error } = await supabase
    .from('letters')
    .update(updates)
    .eq('id', letterId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a letter
export const deleteLetter = async (letterId: string): Promise<void> => {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', letterId);

  if (error) throw error;
};

// Search for users by username
export const searchUsers = async (query: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data || [];
};