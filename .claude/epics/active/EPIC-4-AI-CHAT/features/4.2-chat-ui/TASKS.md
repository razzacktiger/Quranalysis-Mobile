# Feature 4.2: Chat UI Tasks

**Deps:** Feature 4.1 (useAIChat), Feature 4.3 (VoiceInputButton)

---

## Task 4.2.1: Chat Message Component

**Size:** S | **Files:** `components/ai/ChatMessage.tsx`, `components/ai/ExtractionPreview.tsx`, `components/ai/LoadingMessage.tsx`

### Components to Create

**ChatMessage:**
- Props: `message: Message`, `showExtraction?: boolean`
- Render bubble based on `message.role`
- Show ExtractionPreview if message has extraction data

**ExtractionPreview:**
- Props: `extraction: CombinedExtraction`
- Shows summary of what was understood inline
- Icons: 📖 for portions, ⏱ for duration, ⚠️ for mistakes

**LoadingMessage:**
- Shows while waiting for AI response
- ActivityIndicator + "Thinking..." text

### Styling Specs

| Role | Alignment | Background | Text Color | Border Radius |
|------|-----------|------------|------------|---------------|
| user | right (flex-end) | #3b82f6 (blue) | white | 16px, bottom-right: 4px |
| assistant | left (flex-start) | #f3f4f6 (gray) | #1f2937 (dark) | 16px, bottom-left: 4px |

### Timestamp Format
Use `date-fns` `formatDistanceToNow` for relative time ("2 min ago")

### Acceptance
- [ ] User bubbles right-aligned, blue
- [ ] AI bubbles left-aligned, gray
- [ ] ExtractionPreview shows data summary
- [ ] LoadingMessage with spinner
- [ ] Timestamps in relative format

---

## Task 4.2.2: Chat Modal

**Size:** L | **Files:** `components/ai/ChatModal.tsx`, `components/ai/ChatInput.tsx`, `components/ai/QuickActionChips.tsx`, `components/ai/ChatHeader.tsx`, `components/ai/ExtractionSummary.tsx`

### Components to Create

**ChatModal:**
- Full-screen modal with `presentationStyle="pageSheet"`
- Contains: Header, ExtractionSummary, MessageList, QuickActionChips, ChatInput
- Uses `useAIChat` hook for state

**ChatHeader:**
- Close button (X icon)
- Title: "AI Assistant"
- Confirm button (visible when `isReadyToSave`)

**ChatInput:**
- TextInput with multiline, placeholder "Describe your session..."
- VoiceInputButton (from 4.3.3)
- Send button with Ionicons "send" icon
- Disabled state when loading

**QuickActionChips:**
- Horizontal ScrollView with chip buttons
- Chips: "📖 Log session", "⚠️ Add mistake", "📝 Review today"
- Each chip sends predefined prompt to `sendMessage`

**ExtractionSummary:**
- Shows running tally of extracted data
- "2 portions, 1 mistake extracted"
- Collapsed by default, expandable

### Initial Greeting Message
```
Hi! I can help you log your practice sessions and mistakes.

Try saying or typing:
• "I practiced Al-Fatiha for 20 minutes"
• "I made a tajweed mistake on ayah 5"
• "Review of Surah Yaseen, made 3 hesitation errors"

What would you like to log?
```

### Keyboard Handling
- Use `KeyboardAvoidingView` with `behavior="padding"` on iOS
- `behavior="height"` on Android
- FlatList for messages with ref for `scrollToEnd`

### Message Flow
1. User types/speaks message
2. Add user message to list immediately
3. Show LoadingMessage
4. Call AI, get response
5. Add AI message with extraction
6. Update ExtractionSummary

### Acceptance
- [ ] Modal opens with slide animation
- [ ] Initial greeting displayed
- [ ] Messages auto-scroll to bottom
- [ ] Quick action chips work
- [ ] Keyboard stays above input
- [ ] ExtractionSummary updates on new extractions

---

## Task 4.2.3: Confirmation Screen

**Size:** L | **Files:** `components/ai/SessionConfirmation.tsx`, `components/ai/PortionCard.tsx`, `components/ai/MistakeCard.tsx`, `components/ai/EditableField.tsx`

### Layout Structure

```
┌─────────────────────────────────┐
│ Session Details                 │
├─────────────────────────────────┤
│ Date:        [Today]     [edit] │
│ Duration:    [20 min]    [edit] │
│ Type:        [Practice]  [edit] │
│ Performance: [7/10]      [edit] │
├─────────────────────────────────┤
│ Portions (2)                    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Al-Fatiha (1-7)    [✏️] [🗑] │ │
│ │ Reviewing                   │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Al-Baqarah (1-20)  [✏️] [🗑] │ │
│ │ New                         │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Mistakes (1)                    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Al-Fatiha - Tajweed         │ │
│ │ Ghunna, Ayah 3, Sev: 3      │ │
│ │                    [✏️] [🗑] │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [+ Add More via Chat]           │
│                                 │
│ [Cancel]        [Save Session]  │
└─────────────────────────────────┘
```

### Components to Create

**SessionConfirmation:**
- Props: `extraction`, `onAddMore`, `onCancel`, `onSuccess`
- Local state for editable session, portions, mistakes
- Save button calls `useCreateSession` mutation

**EditableField:**
- Props: `label`, `value`, `onEdit`, `options?`
- Tap to edit (inline or modal picker)
- For dropdowns (type, recency): show picker with options

**PortionCard:**
- Shows surah name, ayah range, recency badge
- Edit button opens edit modal
- Remove button with confirmation

**MistakeCard:**
- Shows surah, category/subcategory, ayah, severity
- SeverityBadge component (colored 1-5)
- Edit/remove buttons

### Edit Behavior
- Tap edit → show modal/inline editor
- Changes update local state (not saved until "Save Session")
- Remove items from array

### Save Flow
1. User taps "Save Session"
2. Validate required fields (at least one portion with surah)
3. Call `createSession` mutation with all data
4. Show loading state
5. On success: call `onSuccess`, close modal
6. On error: show error message

### Acceptance
- [ ] All extracted data displayed
- [ ] Fields editable with appropriate input type
- [ ] Portions and mistakes can be removed
- [ ] "Add More" returns to chat
- [ ] Save creates session with all data
- [ ] Loading/error states handled

---

## Task 4.2.4: Floating Chat Button

**Size:** S | **Files:** `components/ai/FloatingChatButton.tsx`, `app/(tabs)/_layout.tsx`

### Button Specs
- Size: 60x60 circular
- Background: #3b82f6 (blue)
- Icon: Ionicons `chatbubble-ellipses`, white, size 28
- Position: bottom-right, 20px from edge
- Offset: above tab bar using `useSafeAreaInsets().bottom + 80`

### Shadow
```
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.3
shadowRadius: 8
elevation: 8 (Android)
```

### Animation
- Bounce on press using `react-native-reanimated`
- `withSequence(withSpring(0.9), withSpring(1))`

### Optional Badge
- Small red circle top-right
- Shows count of extracted items (portions + mistakes)
- Hidden when count is 0

### Integration in _layout.tsx
- Add state: `chatVisible`, `confirmationVisible`, `pendingExtraction`
- Render FloatingChatButton outside Tabs
- Render ChatModal with visible state
- Handle flow: Chat → Confirmation → Success

### Acceptance
- [ ] Button visible on all tab screens
- [ ] Positioned above tab bar
- [ ] Opens ChatModal on tap
- [ ] Shadow and bounce animation work

---

## Task 4.2.5: E2E Tests

**Size:** M | **Files:** `tests/e2e/ai/chat-modal.yaml`, `tests/e2e/ai/session-extraction.yaml`

### Test: chat-modal.yaml
```yaml
# Tests:
1. Floating button visible on launch
2. Tap button opens modal
3. Initial greeting visible
4. Quick action chips visible
5. Voice button visible
6. Close button closes modal
```

### Test: session-extraction.yaml
```yaml
# Tests:
1. Open chat modal
2. Type session description
3. Send message
4. Wait for AI response (15s timeout)
5. Verify extraction preview shows
6. Tap "Review & Save"
7. Verify confirmation screen
8. Verify data displayed
9. Tap "Save Session"
10. Verify modal closes
```

### Key Patterns
- Use `waitForAnimationToEnd` after modal transitions
- Use `extendedWaitUntil` with 15s timeout for AI responses
- Use testIDs for reliable element selection

### Acceptance
- [ ] chat-modal.yaml passes
- [ ] session-extraction.yaml passes
