import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Mock data
const TEAM_DATA = {
    name: 'Hybrid Heroes',
    todayXP: 12450,
    rank: 3,
    emoji: '🦸',
};

const STORIES = [
    { id: 1, user: 'You', avatar: '💪', type: 'add', gradient: ['#667eea', '#764ba2'] },
    { id: 2, user: 'Alex', avatar: '🏃', hasNew: true, gradient: ['#f093fb', '#f5576c'] },
    { id: 3, user: 'Sarah', avatar: '🏋️', hasNew: true, gradient: ['#4facfe', '#00f2fe'] },
    { id: 4, user: 'Mike', avatar: '🚴', hasNew: false, gradient: ['#43e97b', '#38f9d7'] },
    { id: 5, user: 'Emma', avatar: '🤸', hasNew: true, gradient: ['#fa709a', '#fee140'] },
];

const FEED_DATA = [
    {
        id: 1,
        user: { name: 'Alex Rivera', avatar: '🏃', team: 'Cardio Kings' },
        workoutType: '5K Morning Run',
        isPR: true,
        stats: { distance: '5.2 km', time: '24:32', pace: '4:43/km' },
        xp: 540,
        reactions: { fire: 23, flex: 12, comments: 8 },
        timestamp: '2 hours ago',
    },
    {
        id: 2,
        user: { name: 'Sarah Chen', avatar: '🏋️', team: 'Iron Warriors' },
        workoutType: 'Deadlift Session',
        isLevelUp: true,
        stats: { reps: 80, weight: '315 lbs', time: '45 min' },
        xp: 725,
        reactions: { fire: 45, flex: 34, comments: 15 },
        timestamp: '4 hours ago',
    },
    {
        id: 3,
        user: { name: 'Mike Johnson', avatar: '🚴', team: 'Hybrid Heroes' },
        workoutType: 'Cycling + Strength',
        isPR: false,
        stats: { distance: '25 km', time: '1:12:00', sets: 3 },
        xp: 890,
        reactions: { fire: 18, flex: 9, comments: 5 },
        timestamp: '6 hours ago',
    },
    {
        id: 4,
        user: { name: 'Emma Davis', avatar: '🤸', team: 'Morning Crew' },
        workoutType: 'HIIT Circuit',
        isPR: false,
        stats: { rounds: 6, time: '30 min', exercises: 12 },
        xp: 620,
        reactions: { fire: 31, flex: 22, comments: 11 },
        timestamp: '8 hours ago',
    },
];

export default function HomeFeedScreen({ navigation }) {
    const [selectedReactions, setSelectedReactions] = useState({});
    const glowAnim = useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.15,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const toggleReaction = (postId, reactionType) => {
        const key = `${postId}-${reactionType}`;
        setSelectedReactions(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>FitLeague</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Text style={styles.iconText}>🔔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Text style={styles.iconText}>💬</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Team Highlights Banner */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('TeamHub')}
                >
                    <LinearGradient
                        colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                        style={styles.teamBanner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.teamBannerContent}>
                            <View style={styles.teamInfo}>
                                <Text style={styles.teamEmoji}>{TEAM_DATA.emoji}</Text>
                                <View>
                                    <Text style={styles.teamName}>{TEAM_DATA.name}</Text>
                                    <Text style={styles.teamRank}>Rank #{TEAM_DATA.rank} Today</Text>
                                </View>
                            </View>
                            <View style={styles.teamXP}>
                                <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
                                    <Text style={styles.teamXPValue}>
                                        {TEAM_DATA.todayXP.toLocaleString()}
                                    </Text>
                                </Animated.View>
                                <Text style={styles.teamXPLabel}>Team XP</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.teamChatButton}>
                            <Text style={styles.teamChatText}>💬 Team Chat</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Stories Row */}
                <View style={styles.storiesSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.storiesContainer}
                    >
                        {STORIES.map((story) => (
                            <TouchableOpacity
                                key={story.id}
                                style={styles.storyItem}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={story.gradient}
                                    style={[
                                        styles.storyGradient,
                                        story.hasNew && styles.storyGradientNew,
                                    ]}
                                >
                                    <View style={styles.storyAvatar}>
                                        <Text style={styles.storyEmoji}>
                                            {story.type === 'add' ? '➕' : story.avatar}
                                        </Text>
                                    </View>
                                </LinearGradient>
                                <Text style={styles.storyName}>{story.user}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Feed */}
                <View style={styles.feedSection}>
                    {FEED_DATA.map((post) => (
                        <WorkoutCard
                            key={post.id}
                            post={post}
                            selectedReactions={selectedReactions}
                            onReactionPress={toggleReaction}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// Workout Card Component
const WorkoutCard = ({ post, selectedReactions, onReactionPress }) => {
    return (
        <View style={styles.card}>
            {/* Milestone Badge */}
            {(post.isPR || post.isLevelUp) && (
                <View style={styles.milestoneBadge}>
                    <LinearGradient
                        colors={post.isPR ? ['#fbbf24', '#f59e0b'] : ['#8b5cf6', '#7c3aed']}
                        style={styles.milestoneBadgeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.milestoneBadgeText}>
                            {post.isPR ? '🏆 NEW PR!' : '⬆️ LEVEL UP!'}
                        </Text>
                    </LinearGradient>
                </View>
            )}

            {/* User Header */}
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarEmoji}>{post.user.avatar}</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{post.user.name}</Text>
                        <Text style={styles.userTeam}>{post.user.team} • {post.timestamp}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Text style={styles.moreIcon}>⋯</Text>
                </TouchableOpacity>
            </View>

            {/* Workout Type */}
            <Text style={styles.workoutType}>{post.workoutType}</Text>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {Object.entries(post.stats).map(([key, value], index) => (
                    <View key={index} style={styles.statItem}>
                        <Text style={styles.statValue}>{value}</Text>
                        <Text style={styles.statLabel}>{key}</Text>
                    </View>
                ))}
            </View>
            {/*
            {/* XP Badge 
            <View style={styles.xpBadgeContainer}>
                <LinearGradient
                    colors={['#4ade80', '#22c55e', '#16a34a']}
                    style={styles.xpBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.xpBadgeIcon}>⚡</Text>
                    <Text style={styles.xpBadgeText}>+{post.xp} XP</Text>
                </LinearGradient>
            </View>
            */}
            {/* Reactions */}
            <View style={styles.reactionsContainer}>
                <View style={styles.reactionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.reactionButton,
                            selectedReactions[`${post.id}-fire`] && styles.reactionButtonActive,
                        ]}
                        onPress={() => onReactionPress(post.id, 'fire')}
                    >
                        <Text style={styles.reactionEmoji}>🔥</Text>
                        <Text style={styles.reactionCount}>{post.reactions.fire}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reactionButton,
                            selectedReactions[`${post.id}-flex`] && styles.reactionButtonActive,
                        ]}
                        onPress={() => onReactionPress(post.id, 'flex')}
                    >
                        <Text style={styles.reactionEmoji}>💪</Text>
                        <Text style={styles.reactionCount}>{post.reactions.flex}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.reactionButton,
                            selectedReactions[`${post.id}-comment`] && styles.reactionButtonActive,
                        ]}
                        onPress={() => onReactionPress(post.id, 'comment')}
                    >
                        <Text style={styles.reactionEmoji}>💬</Text>
                        <Text style={styles.reactionCount}>{post.reactions.comments}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareButton}>
                    <Text style={styles.shareIcon}>↗️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },

    // Team Banner
    teamBanner: {
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    teamBannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    teamEmoji: {
        fontSize: 40,
    },
    teamName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    teamRank: {
        fontSize: 14,
        color: '#e0e0e0',
        marginTop: 2,
    },
    teamXP: {
        alignItems: 'flex-end',
    },
    teamXPValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fbbf24',
        textShadowColor: 'rgba(251, 191, 36, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    teamXPLabel: {
        fontSize: 12,
        color: '#e0e0e0',
        marginTop: 2,
    },
    teamChatButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    teamChatText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Stories
    storiesSection: {
        marginVertical: 20,
    },
    storiesContainer: {
        paddingHorizontal: 15,
        gap: 15,
    },
    storyItem: {
        alignItems: 'center',
    },
    storyGradient: {
        width: 70,
        height: 70,
        borderRadius: 35,
        padding: 3,
        marginBottom: 5,
    },
    storyGradientNew: {
        shadowColor: '#f5576c',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
    },
    storyAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1e293b',
    },
    storyEmoji: {
        fontSize: 32,
    },
    storyName: {
        fontSize: 12,
        color: '#cbd5e1',
        marginTop: 4,
    },

    // Feed
    feedSection: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    milestoneBadge: {
        position: 'absolute',
        top: -8,
        right: 20,
        zIndex: 10,
    },
    milestoneBadgeGradient: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 15,
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
    },
    milestoneBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userAvatarEmoji: {
        fontSize: 28,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userTeam: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    moreIcon: {
        fontSize: 24,
        color: '#94a3b8',
    },
    workoutType: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 15,
    },
    statItem: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        minWidth: (width - 90) / 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#64748b',
        textTransform: 'capitalize',
    },
    xpBadgeContainer: {
        marginVertical: 15,
        alignItems: 'center',
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        gap: 8,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 10,
    },
    xpBadgeIcon: {
        fontSize: 20,
    },
    xpBadgeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    reactionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    reactionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#334155',
    },
    reactionButtonActive: {
        backgroundColor: '#334155',
        borderColor: '#4ade80',
    },
    reactionEmoji: {
        fontSize: 16,
    },
    reactionCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#cbd5e1',
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    shareIcon: {
        fontSize: 18,
    },
});
