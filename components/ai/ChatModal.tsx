import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAIChat, type Message } from '@/lib/hooks/useAIChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { QuickActionChips } from './QuickActionChips';
import { ExtractionSummary } from './ExtractionSummary';
import { GreetingMessage } from './GreetingMessage';

export interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  testID?: string;
  /** Optional voice input button component */
  voiceButton?: React.ReactNode;
}

/**
 * Full-screen chat modal for AI-powered session logging
 *
 * Features:
 * - PageSheet presentation style
 * - Keyboard avoiding behavior for iOS/Android
 * - Auto-scrolling message list
 * - Quick action chips for common tasks
 * - Collapsible extraction summary
 * - Initial greeting with usage examples
 */
export function ChatModal({
  visible,
  onClose,
  onConfirm,
  testID,
  voiceButton,
}: ChatModalProps) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Message>>(null);

  // Use the AI chat hook for state management
  const {
    messages,
    isLoading,
    isReadyToSave,
    extractedSession,
    extractedPortions,
    extractedMistakes,
    sendMessage,
    clearChat,
  } = useAIChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure the new message is rendered
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, isLoading]);

  // Handle close - clear chat and close modal
  const handleClose = useCallback(() => {
    // Don't clear chat on close - allow resuming conversation
    onClose();
  }, [onClose]);

  // Handle confirm - trigger confirmation flow
  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  // Handle quick action selection
  const handleQuickAction = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  // Render individual message item
  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item, index }) => (
      <ChatMessage
        message={item}
        showExtraction={true}
        testID={`${testID}-message-${index}`}
      />
    ),
    [testID]
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: Message) => item.id, []);

  // Show greeting when no messages
  const showGreeting = messages.length === 0;

  return (
    <Modal
      testID={testID}
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }}>
          <ChatHeader
            onClose={handleClose}
            onConfirm={handleConfirm}
            isReadyToSave={isReadyToSave}
            testID={`${testID}-header`}
          />
        </View>

        {/* Extraction Summary - shows accumulated data */}
        <ExtractionSummary
          session={extractedSession}
          portions={extractedPortions}
          mistakes={extractedMistakes}
          testID={`${testID}-summary`}
        />

        {/* Message list */}
        <FlatList
          ref={flatListRef}
          testID={`${testID}-messages`}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 8,
            flexGrow: 1,
          }}
          ListHeaderComponent={showGreeting ? <GreetingMessage /> : null}
          ListFooterComponent={
            isLoading ? (
              <LoadingMessage testID={`${testID}-loading`} />
            ) : null
          }
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {/* Quick action chips */}
        <QuickActionChips
          onSelectAction={handleQuickAction}
          disabled={isLoading}
          testID={`${testID}-chips`}
        />

        {/* Input area */}
        <View style={{ paddingBottom: insets.bottom }}>
          <ChatInput
            onSend={sendMessage}
            disabled={isLoading}
            testID={`${testID}-input`}
            voiceButton={voiceButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
