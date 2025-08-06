import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, DATABASE_TABLES } from '../config/supabase';

const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

// Database service functions
export const databaseService = {
  // Get table name based on content type
  getTableName: (contentType) => {
    switch (contentType) {
      case 'video':
        return DATABASE_TABLES.TREND_VIDEO;
      case 'image':
        return DATABASE_TABLES.TREND_IMAGE;
      case 'text':
        return DATABASE_TABLES.TREND_TEXT;
      default:
        return DATABASE_TABLES.TREND_EQUAL;
    }
  },

  // Load categories from database
  loadCategories: async (contentType) => {
    try {
      const tableName = databaseService.getTableName(contentType);
      const { data, error } = await supabase
        .from(tableName)
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error loading categories:', error);
        return [{ value: 'all', label: 'All Categories' }];
      }

      // Extract unique categories
      const categories = [...new Set(data
        .filter(d => d.category && d.category.trim() !== '')
        .map(d => d.category.trim())
      )].sort();

      // Add "All Categories" option
      const allCategories = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
      ];

      return allCategories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [{ value: 'all', label: 'All Categories' }];
    }
  },

  // Load trending topics from database
  loadTrendingTopics: async (contentType, topicCategory = 'all') => {
    try {
      const tableName = databaseService.getTableName(contentType);
      let query = supabase
        .from(tableName)
        .select('*')
        .not('group_name', 'is', null)
        .not('final_trend_score', 'is', null);

      // Filter by category if not "all"
      if (topicCategory !== 'all') {
        query = query.eq('category', topicCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading trending topics:', error);
        return [];
      }

      // Remove duplicates based on group_name and keep the highest score
      const uniqueGroups = new Map();
      data.forEach(d => {
        const groupName = d.group_name?.trim();
        const score = Number(d.final_trend_score);

        if (groupName && !isNaN(score)) {
          if (!uniqueGroups.has(groupName) || score > uniqueGroups.get(groupName).score) {
            uniqueGroups.set(groupName, {
              group_name: groupName,
              final_trend_score: score,
              category: d.category
            });
          }
        }
      });

      // Process the data
      const processed = Array.from(uniqueGroups.values())
        .sort((a, b) => b.final_trend_score - a.final_trend_score)
        .slice(0, 10) // Show top 10 trending topics
        .map((d, index) => ({
          id: index + 1,
          name: d.group_name,
          trendScore: d.final_trend_score.toFixed(2),
          category: d.category
        }));

      return processed;
    } catch (error) {
      console.error('Error loading trending topics:', error);
      return [];
    }
  },

  // Load related keywords from database
  loadRelatedKeywords: async (groupName, contentType = 'all') => {
    try {
      const tableName = databaseService.getTableName(contentType);
      const { data, error } = await supabase
        .from(tableName)
        .select('keyword, final_trend_score')
        .eq('group_name', groupName)
        .not('keyword', 'is', null)
        .not('keyword', 'eq', '')
        .order('final_trend_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading related keywords:', error);
        return [];
      }

      return data.map(d => ({
        keyword: d.keyword.trim(),
        score: Number(d.final_trend_score).toFixed(2)
      }));
    } catch (error) {
      console.error('Error loading related keywords:', error);
      return [];
    }
  },

  // Load data for main page bubble chart
  loadBubbleChartData: async () => {
    try {
      console.log('Fetching from table:', DATABASE_TABLES.TREND_EQUAL);
      
      // First, let's see what tables exist and get a sample of data
      const { data: allData, error: allError } = await supabase
        .from(DATABASE_TABLES.TREND_EQUAL)
        .select('*')
        .limit(5);
      
      console.log('All data sample:', allData);
      console.log('All data error:', allError);
      
      if (allError) {
        console.error('Error fetching all data:', allError);
        return [];
      }
      
      // Now try the filtered query
      const { data, error } = await supabase
        .from(DATABASE_TABLES.TREND_EQUAL)
        .select('*')
        .not('group_name', 'is', null)
        .not('final_trend_score', 'is', null);

      if (error) {
        console.error('Error loading bubble chart data:', error);
        return [];
      }
      
      console.log('Raw data from database:', data);

      // Remove duplicates based on group_name and keep the highest score
      const uniqueGroups = new Map();
      data.forEach(d => {
        const groupName = d.group_name?.trim();
        const score = Number(d.final_trend_score);

        if (groupName && !isNaN(score)) {
          if (!uniqueGroups.has(groupName) || score > uniqueGroups.get(groupName).score) {
            uniqueGroups.set(groupName, {
              group_name: groupName,
              final_trend_score: score
            });
          }
        }
      });

      const sorted = Array.from(uniqueGroups.values())
        .sort((a, b) => b.final_trend_score - a.final_trend_score)
        .slice(0, 15) // Display top 15 bubbles
        .map((d, i) => ({
          keyword: d.group_name,
          score: d.final_trend_score,
          rank: i + 1
        }));

      console.log('Processed bubble chart data:', sorted);
      return sorted;
    } catch (error) {
      console.error('Error loading bubble chart data:', error);
      return [];
    }
  }
};

export default databaseService; 