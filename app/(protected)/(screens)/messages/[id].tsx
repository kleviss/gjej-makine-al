import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import styled from '@emotion/native';
import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { useMessages, useSendMessage, markMessagesRead } from '@/services/supabase.api';
import { supabase } from '@/config/supabase';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const BubbleRow = styled.View<{ isOwn: boolean }>(({ isOwn }) => ({
  flexDirection: 'row',
  justifyContent: isOwn ? 'flex-end' : 'flex-start',
  paddingHorizontal: 12,
  marginVertical: 4,
}));

const Bubble = styled.View<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  maxWidth: '75%',
  padding: 10,
  borderRadius: 16,
  backgroundColor: isOwn ? theme.colors.primary : theme.colors.textSecondary + '33',
}));

const BubbleText = styled.Text<{ isOwn: boolean }>(({ theme, isOwn }) => ({
  fontSize: 15,
  color: isOwn ? theme.colors.textContrast : theme.colors.text,
}));

const InputRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  padding: 8,
  borderTopWidth: 1,
  borderTopColor: theme.colors.textSecondary + '33',
  alignItems: 'flex-end',
}));

const Input = styled.TextInput(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.textSecondary + '1A',
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 10,
  fontSize: 15,
  color: theme.colors.text,
  maxHeight: 100,
}));

const SendBtn = styled.Pressable(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 8,
}));

const SendText = styled.Text(({ theme }) => ({
  color: theme.colors.textContrast,
  fontSize: 18,
  fontWeight: '700',
}));

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const userId = session?.user?.id!;
  const queryClient = useQueryClient();
  const { data: messages } = useMessages(id);
  const { mutate: send } = useSendMessage();
  const [text, setText] = useState('');

  // Mark messages as read
  useEffect(() => {
    if (id && userId) markMessagesRead(id, userId);
  }, [id, userId, messages]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, queryClient]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    send({ conversationId: id, senderId: userId, content: trimmed });
  }, [text, id, userId, send]);

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isOwn = item.sender_id === userId;
            return (
              <BubbleRow isOwn={isOwn}>
                <Bubble isOwn={isOwn}>
                  <BubbleText isOwn={isOwn}>{item.content}</BubbleText>
                </Bubble>
              </BubbleRow>
            );
          }}
        />
        <InputRow>
          <Input
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <SendBtn onPress={handleSend}>
            <SendText>{'>'}</SendText>
          </SendBtn>
        </InputRow>
      </KeyboardAvoidingView>
    </Container>
  );
}
