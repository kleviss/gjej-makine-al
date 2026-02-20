import { supabase } from '@/config/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Vehicle } from '@/types/vehicle';

export interface VehicleFilters {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  page?: number;
  limit?: number;
}

export async function getVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  const { page = 0, limit = 20, ...rest } = filters;
  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (rest.make) query = query.ilike('make', rest.make);
  if (rest.minPrice != null) query = query.gte('price', rest.minPrice);
  if (rest.maxPrice != null && rest.maxPrice !== Infinity) query = query.lte('price', rest.maxPrice);
  if (rest.minYear != null) query = query.gte('year', rest.minYear);
  if (rest.maxYear != null) query = query.lte('year', rest.maxYear);
  if (rest.transmission) query = query.ilike('transmission', rest.transmission);

  const { data, error } = await query;
  if (error) throw error;
  return data as Vehicle[];
}

export async function getVehicleById(id: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, user_profiles(display_name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export const useVehicles = (filters: VehicleFilters = {}) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => getVehicles(filters),
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
    enabled: !!id,
  });
};

// Saved Cars

export async function getSavedCars(userId: string) {
  const { data, error } = await supabase
    .from('saved_cars')
    .select('vehicle_id, created_at, vehicles(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleSavedCar(userId: string, vehicleId: string) {
  const { data: existing } = await supabase
    .from('saved_cars')
    .select('vehicle_id')
    .eq('user_id', userId)
    .eq('vehicle_id', vehicleId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('saved_cars')
      .delete()
      .eq('user_id', userId)
      .eq('vehicle_id', vehicleId);
    if (error) throw error;
    return { saved: false };
  } else {
    const { error } = await supabase
      .from('saved_cars')
      .insert({ user_id: userId, vehicle_id: vehicleId });
    if (error) throw error;
    return { saved: true };
  }
}

export const useSavedCars = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['saved_cars', userId],
    queryFn: () => getSavedCars(userId!),
    enabled: !!userId,
  });
};

export const useToggleSavedCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, vehicleId }: { userId: string; vehicleId: string }) =>
      toggleSavedCar(userId, vehicleId),
    onMutate: async ({ userId, vehicleId }) => {
      await queryClient.cancelQueries({ queryKey: ['saved_cars', userId] });
      const previous = queryClient.getQueryData(['saved_cars', userId]);
      queryClient.setQueryData(['saved_cars', userId], (old: any[] | undefined) => {
        if (!old) return old;
        const exists = old.some((item) => item.vehicle_id === vehicleId);
        if (exists) return old.filter((item) => item.vehicle_id !== vehicleId);
        return [...old, { vehicle_id: vehicleId, created_at: new Date().toISOString(), vehicles: null }];
      });
      return { previous };
    },
    onError: (_err, { userId }, context) => {
      if (context?.previous) queryClient.setQueryData(['saved_cars', userId], context.previous);
    },
    onSettled: (_data, _err, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['saved_cars', userId] });
    },
  });
};

// User Listings

export async function getUserVehicles(userId: string): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Vehicle[];
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('vehicles').insert(vehicle).select().single();
  if (error) throw error;
  return data;
}

export async function uploadVehicleImage(userId: string, uri: string) {
  const ext = uri.split('.').pop() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();
  const { error } = await supabase.storage
    .from('vehicle-images')
    .upload(path, blob, { contentType: `image/${ext}` });
  if (error) throw error;
  const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) throw error;
}

export async function updateVehicleStatus(id: string, status: string) {
  const { error } = await supabase.from('vehicles').update({ status }).eq('id', id);
  if (error) throw error;
}

export const useUserVehicles = (userId: string | undefined) =>
  useQuery({
    queryKey: ['user_vehicles', userId],
    queryFn: () => getUserVehicles(userId!),
    enabled: !!userId,
  });

export const useCreateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user_vehicles'] });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user_vehicles'] });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicleStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateVehicleStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user_vehicles'] });
      qc.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

// Messaging

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id, vehicle_id, buyer_id, seller_id, updated_at,
      vehicles(title),
      buyer:user_profiles!conversations_buyer_id_fkey(display_name),
      seller:user_profiles!conversations_seller_id_fkey(display_name),
      messages(id, content, sender_id, read, created_at)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' });
  if (error) throw error;
  return data;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();
  if (error) throw error;
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  return data;
}

export async function getOrCreateConversation(vehicleId: string, buyerId: string, sellerId: string) {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('vehicle_id', vehicleId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .single();
  if (existing) return existing.id as string;
  const { data, error } = await supabase
    .from('conversations')
    .insert({ vehicle_id: vehicleId, buyer_id: buyerId, seller_id: sellerId })
    .select('id')
    .single();
  if (error) throw error;
  return data!.id as string;
}

export async function markMessagesRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);
  if (error) throw error;
}

export const useConversations = (userId: string | undefined) =>
  useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => getConversations(userId!),
    enabled: !!userId,
  });

export const useMessages = (conversationId: string) =>
  useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, senderId, content }: { conversationId: string; senderId: string; content: string }) =>
      sendMessage(conversationId, senderId, content),
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
