// app/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

// Scale/Justice Icon
function ScaleIcon({ size = 80, color = '#FFF8DC' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v18" />
      <Path d="m19 8 3 8a5 5 0 0 1-6 0z" />
      <Path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
      <Path d="m5 8 3 8a5 5 0 0 1-6 0z" />
      <Path d="M7 21h10" />
    </Svg>
  );
}

export default function LandingScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#805734', '#a67c52', '#805734']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo/Icon Section */}
          <View style={styles.logoContainer}>
            <View style={styles.iconWrapper}>
              <ScaleIcon size={100} color="#FFF8DC" />
            </View>
            <Text style={styles.appTitle}>IDefend</Text>
            <Text style={styles.tagline}>Know Your Rights, Anytime</Text>
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/signin')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

           
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            For informational purposes only. Not legal advice.{'\n'}
            Consult a licensed attorney for specific legal situations.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 248, 220, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(255, 248, 220, 0.3)',
  },
  appTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF8DC',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFF8DC',
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresContainer: {
    gap: 16,
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 248, 220, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 220, 0.2)',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF8DC',
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 248, 220, 0.08)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 220, 0.15)',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#FFF8DC',
    textAlign: 'center',
    opacity: 0.95,
  },
  buttonContainer: {
    gap: 14,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#4d341e',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
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
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 248, 220, 0.4)',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF8DC',
  },
  disclaimer: {
    fontSize: 11,
    color: '#FFF8DC',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
    marginTop: 10,
  },
});