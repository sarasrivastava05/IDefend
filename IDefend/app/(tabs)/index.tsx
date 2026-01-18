import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Custom Balance Scale Icon Component from your SVG
function BalanceScaleIcon({ size = 100, color = '#4d341e' }) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 3v18" />
      <Path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
      <Path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
      <Path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
      <Path d="M7 21h10" />
    </Svg>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#805734', '#a67c52', '#805734']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.logoContainer}>
          <Text style={styles.title}>IDefend</Text>
          
          {/* Balance Scale Icon */}
          <View style={styles.scaleContainer}>
            <BalanceScaleIcon size={120} color="#4d341e" />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/signin')}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Text */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpPrompt}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Decorative Bubbles */}
      <View style={styles.bubble1} />
      <View style={styles.bubble2} />
      <View style={styles.bubble3} />
      <View style={styles.bubble4} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.15,
  },
  title: {
    fontSize: 68,
    fontWeight: '900',
    color: '#FFF8DC',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 3,
  },
  scaleContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 248, 220, 0.3)',
    borderRadius: 70,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#a67c52',
    paddingVertical: 20,
    paddingHorizontal: 70,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF8DC',
    letterSpacing: 1.5,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 28,
    alignItems: 'center',
  },
  signUpPrompt: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF8DC',
  },
  signUpLink: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  bubble1: {
    position: 'absolute',
    top: 80,
    left: 30,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 165, 0, 0.25)',
  },
  bubble2: {
    position: 'absolute',
    bottom: 120,
    right: 35,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 140, 0, 0.18)',
  },
  bubble3: {
    position: 'absolute',
    top: '42%',
    right: 15,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(210, 105, 30, 0.28)',
  },
  bubble4: {
    position: 'absolute',
    bottom: '35%',
    left: 25,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255, 160, 122, 0.22)',
  },
});