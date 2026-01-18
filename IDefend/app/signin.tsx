// app/signin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const US_STATES = [
 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

const LANGUAGES = [
    'English', 'Spanish', 'Chinese', 'Hindi'
];

// Custom Dropdown Component
interface CustomDropdownProps {
  placeholder: string;
  value: string;
  onSelect: (value: string) => void;
  options: string[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ placeholder, value, onSelect, options }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(option);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.selectedOption
                  ]}>
                    {option}
                  </Text>
                  {value === option && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usState, setUsState] = useState('');
  const [language, setLanguage] = useState('');

  const validateEmail = (email:any) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!validateEmail(signInEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      // Check if user data exists
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        
        // Check if email matches (basic validation for demo)
        if (userData.email === signInEmail) {
          console.log('Signing in:', { email: signInEmail });
          router.replace('/homepage');
        } else {
          Alert.alert('Error', 'Invalid email or password');
        }
      } else {
        // For development: allow sign in even without signup
        // Create a temporary user profile
        const tempUserData = {
          firstName: 'Demo',
          lastName: 'User',
          email: signInEmail,
          state: 'California',
          language: 'English'
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(tempUserData));
        await AsyncStorage.setItem('userState', 'California');
        
        console.log('Creating temp user and signing in');
        router.replace('/homepage');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'An error occurred during sign in');
    }
  };

  const handleSignUp = async () => {
    // Validation
    if (!firstName || !lastName || !signUpEmail || !signUpPassword || !confirmPassword || !usState || !language) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!validateEmail(signUpEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (signUpPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    
    if (signUpPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Create user data object
    const userData = {
      firstName,
      lastName,
      email: signUpEmail,
      state: usState,
      language
    };
    
    try {
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userState', usState);
      
      console.log('Creating account:', userData);
      
      // After successful sign up
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/homepage') }
      ]);
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#805734', '#a67c52', '#805734']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Legal Assistant</Text>
          <Text style={styles.subtitle}>Your AI Legal Help Chatbot</Text>
          
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, mode === 'signin' && styles.activeTab]}
              onPress={() => setMode('signin')}
            >
              <Text style={[styles.tabText, mode === 'signin' && styles.activeTabText]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === 'signup' && styles.activeTab]}
              onPress={() => setMode('signup')}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.activeTabText]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Form */}
          {mode === 'signin' && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#a67c52"
                value={signInEmail}
                onChangeText={setSignInEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#a67c52"
                value={signInPassword}
                onChangeText={setSignInPassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <View style={styles.formContainer}>
              <View style={styles.nameRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="First Name"
                  placeholderTextColor="#a67c52"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Last Name"
                  placeholderTextColor="#a67c52"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#a67c52"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password (min. 8 characters)"
                placeholderTextColor="#a67c52"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#a67c52"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              
              <CustomDropdown
                placeholder="Select US State"
                value={usState}
                onSelect={setUsState}
                options={US_STATES}
              />
              
              <CustomDropdown
                placeholder="Select Language"
                value={language}
                onSelect={setLanguage}
                options={LANGUAGES}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF8DC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF8DC',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 248, 220, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFF8DC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF8DC',
  },
  activeTabText: {
    color: '#4d341e',
  },
  formContainer: {
    gap: 16,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: '#FFF8DC',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#4d341e',
  },
  halfInput: {
    flex: 1,
  },
  dropdownButton: {
    backgroundColor: '#FFF8DC',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#4d341e',
  },
  placeholderText: {
    color: '#a67c52',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#4d341e',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF8DC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#a67c52',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4d341e',
  },
  modalClose: {
    fontSize: 24,
    color: '#4d341e',
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8d0',
  },
  optionText: {
    fontSize: 16,
    color: '#4d341e',
  },
  selectedOption: {
    fontWeight: '700',
    color: '#805734',
  },
  checkmark: {
    fontSize: 20,
    color: '#805734',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#4d341e',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF8DC',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#FFF8DC',
    fontSize: 16,
  },
});