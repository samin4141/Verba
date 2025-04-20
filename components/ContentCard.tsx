import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, Bookmark, Share2 } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ContentCardProps {
  title: string;
  content: string;
  imageUrl?: string;
  source?: string;
  date?: string;
  onSave?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onPress?: () => void;
  saved?: boolean;
  liked?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  content,
  imageUrl,
  source,
  date,
  onSave,
  onLike,
  onShare,
  onPress,
  saved = false,
  liked = false,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content} numberOfLines={4}>{content}</Text>
        
        {(source || date) && (
          <View style={styles.metaContainer}>
            {source && <Text style={styles.source}>{source}</Text>}
            {date && <Text style={styles.date}>{date}</Text>}
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike}>
            <Heart 
              size={20} 
              color={liked ? colors.secondary : colors.gray[500]} 
              fill={liked ? colors.secondary : 'none'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Bookmark 
              size={20} 
              color={saved ? colors.primary : colors.gray[500]} 
              fill={saved ? colors.primary : 'none'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Share2 size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  source: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: colors.gray[500],
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 12,
  },
  actionButton: {
    marginRight: 20,
    padding: 4,
  },
});