import React, { useState, useRef, useEffect } from 'react';
import Constants from 'expo-constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

// Icons
function BackIcon({ size = 24, color = '#FFF8DC' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5" />
      <Path d="M12 19l-7-7 7-7" />
    </Svg>
  );
}

function SendIcon({ size = 24, color = '#FFF8DC' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 2L11 13" />
      <Path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </Svg>
  );
}

function ScaleIcon({ size = 24, color = '#4d341e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v18" />
      <Path d="m19 8 3 8a5 5 0 0 1-6 0z" />
      <Path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
      <Path d="m5 8 3 8a5 5 0 0 1-6 0z" />
      <Path d="M7 21h10" />
    </Svg>
  );
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const categoryInfo: Record<string, { title: string; systemPrompt: string }> = {
  police: {
    title: 'Police & Arrests',
    systemPrompt: `You are a knowledgeable legal rights assistant specializing in police encounters and arrests in the United States. Your role is to help users understand their constitutional rights during interactions with law enforcement.

Key areas you cover:
- Fourth Amendment rights (search and seizure)
- Fifth Amendment rights (right to remain silent)
- Sixth Amendment rights (right to an attorney)
- What to do during traffic stops
- Rights during arrests
- Miranda rights
- When police can and cannot search you or your property
- How to document police encounters
- Filing complaints against officers

Always remind users that:
1. You provide general legal information, not legal advice
2. Laws vary by state and jurisdiction
3. They should consult a licensed attorney for specific legal situations
4. Remaining calm and polite during encounters is important for safety

Be supportive, clear, and empowering in your responses. Keep responses concise but helpful.`,
  },
  tenants: {
    title: 'Tenant Rights',
    systemPrompt: `You are a knowledgeable legal rights assistant specializing in tenant and housing rights in the United States. Your role is to help users understand their rights as renters.

Key areas you cover:
- Lease agreements and terms
- Security deposits (limits, return timelines, deductions)
- Habitability requirements (heat, water, repairs)
- Landlord entry rights and notice requirements
- Eviction processes and protections
- Rent increases and rent control (where applicable)
- Discrimination protections (Fair Housing Act)
- Breaking a lease
- Subletting rights
- Dealing with uninhabitable conditions
- Small claims court for deposit disputes

Always remind users that:
1. You provide general legal information, not legal advice
2. Tenant laws vary significantly by state, city, and county
3. They should check local tenant rights organizations
4. Documentation (photos, written communication) is crucial
5. They should consult a tenant rights attorney for complex situations

Be supportive, practical, and empowering in your responses. Keep responses concise but helpful.`,
  },
  workers: {
    title: 'Worker Rights',
    systemPrompt: `You are a knowledgeable legal rights assistant specializing in employment and worker rights in the United States. Your role is to help users understand their workplace rights.

Key areas you cover:
- Minimum wage and overtime (FLSA)
- Workplace safety (OSHA)
- Discrimination and harassment (Title VII, ADA, ADEA)
- Family and Medical Leave (FMLA)
- Wrongful termination
- Retaliation protections
- Whistleblower rights
- Workers' compensation
- Unemployment benefits
- Union rights (NLRA)
- Wage theft and unpaid wages
- Workplace accommodations
- Non-compete and employment contracts

Always remind users that:
1. You provide general legal information, not legal advice
2. Employment laws vary by state and some cities have additional protections
3. Documentation of incidents is crucial
4. Time limits (statutes of limitations) apply to many claims
5. They should consult an employment attorney for specific situations
6. Filing with EEOC, DOL, or state agencies may be necessary

Be supportive, informative, and empowering in your responses. Keep responses concise but helpful.`,
  },
  consumers: {
    title: 'Consumer Rights',
    systemPrompt: `You are a knowledgeable legal rights assistant specializing in consumer protection and rights in the United States. Your role is to help users understand their rights as consumers.

Key areas you cover:
- Refunds and return policies
- Warranty rights (express and implied)
- Lemon laws for vehicles
- Debt collection practices (FDCPA)
- Credit reporting rights (FCRA)
- Identity theft protection
- Scams and fraud
- Deceptive advertising (FTC Act)
- Online purchase protections
- Credit card dispute rights (chargebacks)
- Small claims court
- Contract disputes
- Product liability

Always remind users that:
1. You provide general legal information, not legal advice
2. Consumer protection laws vary by state
3. Documentation (receipts, communications, photos) is essential
4. Time limits apply to disputes and claims
5. They can file complaints with FTC, CFPB, state AG, or BBB
6. They should consult a consumer rights attorney for significant issues

Be supportive, practical, and empowering in your responses. Keep responses concise but helpful.`,
  },
};

const GEMINI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY;
console.log('API Key loaded:', GEMINI_API_KEY);

export default function ChatbotScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string }>();
  const category = params.category || 'police';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const categoryData = categoryInfo[category] || categoryInfo.police;

  // Initial welcome message (not sent to API)
  const welcomeMessage = `Hello! I'm your ${categoryData.title} assistant. I'm here to help you understand your legal rights.\n\nWhat can I help you with today?`;

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for Gemini - only user messages that have been sent
      // Gemini needs alternating user/model messages, starting with user
      const conversationHistory = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const requestBody = {
        contents: conversationHistory,
        systemInstruction: {
          parts: [{ text: categoryData.systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      console.log('Sending request to Gemini:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log('Gemini response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('Gemini API Error:', data);
        throw new Error(data.error?.message || 'API request failed');
      }

      //gemini error
      const assistantContent = 
        data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'I apologize, but I encountered an error. Please try again.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: assistantContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `I'm having trouble connecting right now. Error: ${error.message || 'Unknown error'}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <LinearGradient
      colors={['#5C3D2E', '#7A5240', '#6B4332']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <BackIcon size={24} color="#FFF8DC" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <ScaleIcon size={24} color="#FFF8DC" />
          <Text style={styles.headerTitle}>{categoryData.title}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Message (static, not part of conversation) */}
          <View style={styles.assistantBubble}>
            <View style={styles.assistantIconContainer}>
              <ScaleIcon size={18} color="#5C3D2E" />
            </View>
            <View style={styles.assistantTextContainer}>
              <Text style={styles.assistantText}>{welcomeMessage}</Text>
            </View>
          </View>

          {/* Dynamic Messages */}
          {messages.map((message) => (
            <View
              key={message.id}
              style={message.role === 'user' ? styles.userBubble : styles.assistantBubble}
            >
              {message.role === 'model' && (
                <View style={styles.assistantIconContainer}>
                  <ScaleIcon size={18} color="#5C3D2E" />
                </View>
              )}
              <View style={message.role === 'user' ? styles.userTextContainer : styles.assistantTextContainer}>
                <Text style={message.role === 'user' ? styles.userText : styles.assistantText}>
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.assistantBubble}>
              <View style={styles.assistantIconContainer}>
                <ScaleIcon size={18} color="#5C3D2E" />
              </View>
              <View style={styles.typingContainer}>
                <ActivityIndicator size="small" color="#5C3D2E" />
                <Text style={styles.typingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area - Brown Theme */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your question..."
              placeholderTextColor="#A68B7C"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <SendIcon size={20} color={inputText.trim() ? '#FFF8DC' : '#8B7355'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            For informational purposes only. Not legal advice.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 248, 220, 0.15)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF8DC',
  },
  headerSpacer: {
    width: 44,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 16,
  },
  // User message bubble
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userTextContainer: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderBottomRightRadius: 6,
  },
  userText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFF8DC',
  },
  // Assistant message bubble
  assistantBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  assistantIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4B896',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  assistantTextContainer: {
    flex: 1,
    backgroundColor: '#D4B896',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
  },
  assistantText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3D2B1F',
  },
  // Typing indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D4B896',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
  },
  typingText: {
    fontSize: 14,
    color: '#5C3D2E',
    fontStyle: 'italic',
  },
  // Input area - Brown theme
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
    backgroundColor: '#4A3228',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#6B4A3A',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: '#8B6B5B',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF8DC',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#5C4033',
  },
  disclaimer: {
    fontSize: 11,
    color: '#C4A484',
    textAlign: 'center',
    marginTop: 10,
  },
});