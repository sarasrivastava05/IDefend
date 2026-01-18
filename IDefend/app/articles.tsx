import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

interface Article {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  urlToImage?: string;
}

const NEWS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_NEWS_API_KEY;

// Trusted legal news sources
const TRUSTED_SOURCES = [
  'reuters',
  'associated-press',
  'the-washington-post',
  'bbc-news',
  'abc-news',
  'cbs-news',
  'nbc-news',
];

export default function ArticlesScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'For You', query: 'legal rights OR civil rights OR law' },
    { id: 'police', label: 'Police Rights', query: 'police rights OR law enforcement' },
    { id: 'tenant', label: 'Tenant Rights', query: 'tenant rights OR housing law OR eviction' },
    { id: 'worker', label: 'Worker Rights', query: 'labor rights OR employment law OR workplace' },
    { id: 'consumer', label: 'Consumer Rights', query: 'consumer protection OR consumer rights' },
  ];

  const fetchArticles = async (category = 'all') => {
    try {
      const selectedCat = categories.find(c => c.id === category);
      const query = selectedCat?.query || categories[0].query;
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
      );

      const data = await response.json();
      
      if (data.status === 'ok') {
        // Filter by trusted sources if possible
        const filtered = data.articles.filter((article: Article) => 
          article.title && article.description && article.url
        );
        setArticles(filtered);
      } else {
        console.error('News API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategory);
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArticles(selectedCategory);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const openArticle = (url: string) => {
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#5C3D2E', '#7A5240', '#6B4332']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF8DC" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#5C3D2E', '#7A5240', '#6B4332']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legal News</Text>
        <Text style={styles.headerSubtitle}>Stay informed about your rights</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryTab,
              selectedCategory === cat.id && styles.categoryTabActive,
            ]}
            onPress={() => {
              setSelectedCategory(cat.id);
              setLoading(true);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles Feed */}
      <ScrollView
        style={styles.articlesContainer}
        contentContainerStyle={styles.articlesContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFF8DC"
          />
        }
      >
        {articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles found</Text>
            <Text style={styles.emptySubtext}>Try a different category</Text>
          </View>
        ) : (
          articles.map((article, index) => (
            <TouchableOpacity
              key={index}
              style={styles.articleCard}
              onPress={() => openArticle(article.url)}
              activeOpacity={0.8}
            >
              <View style={styles.articleHeader}>
                <Text style={styles.sourceName}>{article.source.name}</Text>
                <Text style={styles.publishDate}>{formatDate(article.publishedAt)}</Text>
              </View>
              
              <Text style={styles.articleTitle} numberOfLines={3}>
                {article.title}
              </Text>
              
              {article.description && (
                <Text style={styles.articleDescription} numberOfLines={3}>
                  {article.description}
                </Text>
              )}
              
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Read more →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFF8DC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF8DC',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D4B896',
  },
  categoryContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 248, 220, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 248, 220, 0.2)',
  },
  categoryTabActive: {
    backgroundColor: '#8B5A2B',
    borderColor: '#8B5A2B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4B896',
  },
  categoryTextActive: {
    color: '#FFF8DC',
  },
  articlesContainer: {
    flex: 1,
  },
  articlesContent: {
    padding: 20,
    gap: 16,
  },
  articleCard: {
    backgroundColor: '#D4B896',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5A2B',
    textTransform: 'uppercase',
  },
  publishDate: {
    fontSize: 12,
    color: '#6B4332',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    color: '#5C4033',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreContainer: {
    alignItems: 'flex-end',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF8DC',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D4B896',
  },
});