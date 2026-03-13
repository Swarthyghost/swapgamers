import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react-native'

type Message = {
  id: string;
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Hi there! I am the SwapGamers AI assist. How can I help you with game swapping, purchases, or community features today?',
  isUser: false,
}

const Assist = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    }

    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response based on app context
    setTimeout(() => {
      let aiResponseText = "I'm still learning! But I can help you navigate the app. Try asking about 'swapping a game' or 'buying accessories'."
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('swap') || lowerInput.includes('exchange')) {
        aiResponseText = "To swap a game, head over to the 'Swap' tab. You can request a swap for any available game, or join the waitlist if it's currently taken!"
      } else if (lowerInput.includes('buy') || lowerInput.includes('shop') || lowerInput.includes('purchase')) {
        aiResponseText = "You can find controllers, headsets, and other accessories in the 'Shop' tab. We currently support MTN MoMo and Telecel Cash!"
      } else if (lowerInput.includes('community') || lowerInput.includes('friends')) {
        aiResponseText = "Check out the 'Community' tab to see what other gamers are playing, read reviews, and find people to swap with."
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View style={[
        styles.messageWrapper,
        item.isUser ? styles.messageWrapperUser : styles.messageWrapperAI
      ]}>
        {!item.isUser && (
          <View style={styles.aiAvatar}>
            <Bot size={18} color="#22ff88" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.messageBubbleUser : styles.messageBubbleAI
        ]}>
          <Text style={[
             styles.messageText,
             item.isUser ? styles.messageTextUser : styles.messageTextAI
          ]}>
            {item.text}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Assist</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={() => (
             isTyping ? (
               <View style={styles.typingIndicator}>
                 <Text style={styles.typingText}>SwapGamers AI is typing...</Text>
               </View>
             ) : null
          )}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything about the app..."
            placeholderTextColor="#6a7a9a"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#0a0f1a' : '#6a7a9a'} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d45',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,255,136,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,255,136,0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22ff88',
    marginRight: 6,
  },
  statusText: {
    color: '#22ff88',
    fontSize: 12,
    fontWeight: '600',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 120, // To clear the floating tab bar
    gap: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageWrapperUser: {
    justifyContent: 'flex-end',
  },
  messageWrapperAI: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#22ff88',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleUser: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  messageBubbleAI: {
    backgroundColor: '#1e2d45',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#ffffff',
  },
  messageTextAI: {
    color: '#e2e8f0',
  },
  typingIndicator: {
    marginLeft: 40,
    marginBottom: 20,
  },
  typingText: {
    color: '#6a7a9a',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 14,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Pad extra for bottom tabs!
    backgroundColor: '#0a0f1a',
    borderTopWidth: 1,
    borderTopColor: '#1e2d45',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#111827',
    color: '#ffffff',
    minHeight: 46,
    maxHeight: 120,
    borderRadius: 23,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1e2d45',
    marginRight: 10,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22ff88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#1e2d45',
  },
})

export default Assist