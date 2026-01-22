import React, { useState, useCallback } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, type Href } from 'expo-router';
import { Pressable, View, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FloatingChatButton, ChatModal, SessionConfirmation } from '@/components/ai';
import { useAIChat } from '@/lib/hooks/useAIChat';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Chat and confirmation state
  const [chatVisible, setChatVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Lift AI chat state to layout level for sharing between modals
  const chatState = useAIChat();

  const handleOpenChat = useCallback(() => {
    setChatVisible(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setChatVisible(false);
  }, []);

  const handleConfirmChat = useCallback(() => {
    // Switch from chat to confirmation screen
    setChatVisible(false);
    setConfirmationVisible(true);
  }, []);

  const handleAddMoreFromConfirmation = useCallback(() => {
    // Go back to chat to add more data
    setConfirmationVisible(false);
    setChatVisible(true);
  }, []);

  const handleCancelConfirmation = useCallback(() => {
    // Cancel confirmation - go back to chat
    setConfirmationVisible(false);
    setChatVisible(true);
  }, []);

  const handleSuccessConfirmation = useCallback(() => {
    // Session saved successfully - close everything and clear chat
    setConfirmationVisible(false);
    chatState.clearChat();
  }, [chatState]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />,
          headerRight: () => (
            <Link href={"/modal" as Href} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Session',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>

      {/* Floating AI Chat Button */}
      <FloatingChatButton
        onPress={handleOpenChat}
        testID="floating-chat-button"
      />

      {/* AI Chat Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={handleCloseChat}
        onConfirm={handleConfirmChat}
        chatState={chatState}
        testID="chat-modal"
      />

      {/* Session Confirmation Modal */}
      <Modal
        visible={confirmationVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelConfirmation}
        testID="confirmation-modal"
      >
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <SessionConfirmation
            extraction={chatState.getCurrentExtraction()}
            onAddMore={handleAddMoreFromConfirmation}
            onCancel={handleCancelConfirmation}
            onSuccess={handleSuccessConfirmation}
            testID="session-confirmation"
          />
        </View>
      </Modal>
    </View>
  );
}
