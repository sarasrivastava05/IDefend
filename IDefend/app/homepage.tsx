import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import ArticlesScreen from './articles';

const { width, height } = Dimensions.get('window');

// Icon Components
function HomeIcon({ size = 24, color = '#FFF8DC', filled = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );
}

function ArticleIcon({ size = 24, color = '#FFF8DC' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Path d="M14 2v6h6" />
      <Path d="M16 13H8" />
      <Path d="M16 17H8" />
      <Path d="M10 9H8" />
    </Svg>
  );
}

function ProfileIcon({ size = 24, color = '#FFF8DC' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M20 21a8 8 0 1 0-16 0" />
    </Svg>
  );
}

// Category Icons
function PoliceIcon({ size = 40, color = '#4d341e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2l3 3-3 3-3-3 3-3z" />
      <Path d="M12 8v4" />
      <Path d="M8.5 14h7" />
      <Path d="M6 22v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <Path d="M12 16v6" />
    </Svg>
  );
}

function TenantIcon({ size = 40, color = '#4d341e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 21h18" />
      <Path d="M5 21V7l8-4v18" />
      <Path d="M19 21V11l-6-4" />
      <Path d="M9 9v.01" />
      <Path d="M9 12v.01" />
      <Path d="M9 15v.01" />
      <Path d="M9 18v.01" />
    </Svg>
  );
}

function WorkerIcon({ size = 40, color = '#4d341e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 7h-9" />
      <Path d="M14 17H5" />
      <Circle cx="17" cy="17" r="3" />
      <Circle cx="7" cy="7" r="3" />
      <Path d="M12 12l4-4" />
    </Svg>
  );
}

function ConsumerIcon({ size = 40, color = '#4d341e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="21" r="1" />
      <Circle cx="20" cy="21" r="1" />
      <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </Svg>
  );
}

const categories = [
  {
    id: 'police',
    title: 'Police & Arrests',
    description: 'Know your rights during encounters',
    icon: PoliceIcon,
    color: '#D4A574',
  },
  {
    id: 'tenants',
    title: 'Tenant Rights',
    description: 'Housing & landlord issues',
    icon: TenantIcon,
    color: '#C4956A',
  },
  {
    id: 'workers',
    title: 'Worker Rights',
    description: 'Employment & workplace issues',
    icon: WorkerIcon,
    color: '#B8865C',
  },
  {
    id: 'consumers',
    title: 'Consumer Rights',
    description: 'Purchases, refunds & scams',
    icon: ConsumerIcon,
    color: '#A67748',
  },
];

type TabType = 'articles' | 'home' | 'profile';

export default function Homepage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  //get the actual user later
  const userName = 'Sharon';

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/chatbot',
      params: { category: categoryId },
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return <ArticlesScreen />
          
      case 'profile':
        return (
          <View style={styles.placeholderContainer}>
            <ProfileIcon size={60} color="#4d341e" />
            <Text style={styles.placeholderText}>Profile</Text>
            <Text style={styles.placeholderSubtext}>Manage your account</Text>
            <TouchableOpacity 
              style={styles.signOutButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.subtitle}>What do you need help with today?</Text>
            </View>

            {/* Category Cards */}
            <View style={styles.categoriesContainer}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, { backgroundColor: category.color }]}
                    onPress={() => handleCategoryPress(category.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.categoryIconContainer}>
                      <IconComponent size={36} color="#4d341e" />
                    </View>
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <LinearGradient
      colors={['#805734', '#a67c52', '#8B6914']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBarContainer}>
        <View style={styles.navBar}>
          {/* Articles Tab */}
          <TouchableOpacity
            style={[
              styles.navButton,
              activeTab === 'articles' && styles.navButtonActive,
            ]}
            onPress={() => setActiveTab('articles')}
            activeOpacity={0.7}
          >
            <ArticleIcon 
              size={24} 
              color={activeTab === 'articles' ? '#4d341e' : '#FFF8DC'} 
            />
          </TouchableOpacity>

          {/* Home Tab */}
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navButtonCenter,
              activeTab === 'home' && styles.navButtonActive,
            ]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <HomeIcon 
              size={28} 
              color={activeTab === 'home' ? '#4d341e' : '#FFF8DC'}
              filled={activeTab === 'home'}
            />
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={[
              styles.navButton,
              activeTab === 'profile' && styles.navButtonActive,
            ]}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <ProfileIcon 
              size={24} 
              color={activeTab === 'profile' ? '#4d341e' : '#FFF8DC'} 
            />
          </TouchableOpacity>
        </View>
      </View>

    
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFF8DC',
    opacity: 0.9,
    fontWeight: '500',
  },
  userName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF8DC',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF8DC',
    opacity: 0.85,
    marginTop: 12,
    fontWeight: '500',
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 248, 220, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3d2815',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#5a3d20',
    fontWeight: '500',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF8DC',
    marginTop: 20,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#FFF8DC',
    opacity: 0.8,
    marginTop: 8,
  },
  signOutButton: {
    marginTop: 40,
    backgroundColor: '#4d341e',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  signOutText: {
    color: '#FFF8DC',
    fontSize: 16,
    fontWeight: '600',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#3d2815',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navButtonCenter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginHorizontal: 8,
  },
  navButtonActive: {
    backgroundColor: '#FFF8DC',
  },
  bubble1: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    pointerEvents: 'none',
  },
  bubble2: {
    position: 'absolute',
    top: '40%',
    left: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(210, 105, 30, 0.18)',
    pointerEvents: 'none',
  },
});