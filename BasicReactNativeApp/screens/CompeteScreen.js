import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Mock data
const TEAM_LEAGUE = {
    currentTier: 'Gold',
    rank: 3,
    totalTeams: 250,
    xp: 89450,
    nextTierXP: 100000,
    seasonEndsIn: 345600, // seconds (4 days)
};

const TIERS = [
    { name: 'Bronze', color: ['#cd7f32', '#b87333'], minXP: 0 },
    { name: 'Silver', color: ['#c0c0c0', '#a8a8a8'], minXP: 25000 },
    { name: 'Gold', color: ['#ffd700', '#ffb700'], minXP: 50000 },
    { name: 'Diamond', color: ['#b9f2ff', '#00bfff'], minXP: 100000 },
];

const LEADERBOARD = [
    { rank: 1, name: 'FireStarter', avatar: '🔥', xp: 45230, region: 'NA', change: '+2' },
    { rank: 2, name: 'IronGiant', avatar: '🏋️', xp: 43150, region: 'EU', change: '-1' },
    { rank: 3, name: 'SpeedDemon', avatar: '⚡', xp: 41890, region: 'NA', change: '+5' },
    { rank: 4, name: 'YogaMaster', avatar: '🧘', xp: 39200, region: 'AS', change: '0' },
    { rank: 5, name: 'CardioKing', avatar: '👑', xp: 37540, region: 'EU', change: '+1' },
    { rank: 6, name: 'HIIT_Beast', avatar: '💪', xp: 35890, region: 'NA', change: '-3' },
    { rank: 7, name: 'RunForest', avatar: '🏃', xp: 34120, region: 'AS', change: '+2' },
    { rank: 8, name: 'LiftQueen', avatar: '👸', xp: 32450, region: 'EU', change: '0' },
    { rank: 9, name: 'FlexMachine', avatar: '🦾', xp: 31200, region: 'NA', change: '+4' },
    { rank: 10, name: 'ZenWarrior', avatar: '☯️', xp: 29800, region: 'AS', change: '-1' },
];

const CHALLENGES = {
    solo: [
        { id: 1, title: 'Weekend Warrior', desc: 'Complete 5 workouts this weekend', reward: 500, progress: 3, goal: 5, timeLeft: 172800 },
        { id: 2, title: 'Streak Master', desc: 'Maintain 10-day streak', reward: 750, progress: 7, goal: 10, timeLeft: 259200 },
    ],
    duo: [
        { id: 3, title: 'Partner Push', desc: 'Complete matching workouts with a friend', reward: 400, progress: 1, goal: 3, timeLeft: 86400 },
    ],
    team: [
        { id: 4, title: '7-Day Dominance', desc: 'Team earns 50k XP in 7 days', reward: 2000, progress: 32000, goal: 50000, timeLeft: 432000 },
        { id: 5, title: 'Perfect Attendance', desc: 'All members log workouts daily', reward: 1500, progress: 4, goal: 7, timeLeft: 518400 },
    ],
};

export default function CompeteScreen() {
    const [activeTab, setActiveTab] = useState('league'); // league, leaderboard, challenges
    const [selectedRegion, setSelectedRegion] = useState('All');
    const glowAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.15,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Compete</Text>
                <Text style={styles.headerSubtitle}>Season 3 • Ends in {formatTime(TEAM_LEAGUE.seasonEndsIn)}</Text>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'league' && styles.tabActive]}
                    onPress={() => setActiveTab('league')}
                >
                    <Text style={[styles.tabText, activeTab === 'league' && styles.tabTextActive]}>
                        🏆 League
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'leaderboard' && styles.tabActive]}
                    onPress={() => setActiveTab('leaderboard')}
                >
                    <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>
                        📊 Leaderboard
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'challenges' && styles.tabActive]}
                    onPress={() => setActiveTab('challenges')}
                >
                    <Text style={[styles.tabText, activeTab === 'challenges' && styles.tabTextActive]}>
                        ⚔️ Challenges
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'league' && (
                    <LeagueTab
                        teamLeague={TEAM_LEAGUE}
                        tiers={TIERS}
                        formatTime={formatTime}
                        glowAnim={glowAnim}
                    />
                )}

                {activeTab === 'leaderboard' && (
                    <LeaderboardTab
                        leaderboard={LEADERBOARD}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                    />
                )}

                {activeTab === 'challenges' && (
                    <ChallengesTab challenges={CHALLENGES} formatTime={formatTime} />
                )}
            </ScrollView>
        </View>
    );
}

// League Tab
const LeagueTab = ({ teamLeague, tiers, formatTime, glowAnim }) => {
    const currentTier = tiers.find(t => t.name === teamLeague.currentTier);
    const progress = ((teamLeague.xp - currentTier.minXP) / (teamLeague.nextTierXP - currentTier.minXP)) * 100;

    return (
        <View style={styles.leagueContainer}>
            {/* Current Tier Card */}
            <View style={styles.tierCard}>
                <LinearGradient
                    colors={currentTier.color}
                    style={styles.tierCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
                        <Text style={styles.tierEmoji}>🏆</Text>
                    </Animated.View>
                    <Text style={styles.tierName}>{currentTier.name} League</Text>
                    <Text style={styles.tierRank}>Rank #{teamLeague.rank} of {teamLeague.totalTeams}</Text>

                    <View style={styles.seasonBadge}>
                        <Text style={styles.seasonText}>⏰ Season ends in {formatTime(teamLeague.seasonEndsIn)}</Text>
                    </View>
                </LinearGradient>
            </View>

            {/* Progress to Next Tier */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Progress to Diamond</Text>
                    <Text style={styles.progressXP}>
                        {teamLeague.xp.toLocaleString()} / {teamLeague.nextTierXP.toLocaleString()} XP
                    </Text>
                </View>
                <View style={styles.progressBar}>
                    <LinearGradient
                        colors={['#4ade80', '#22c55e']}
                        style={[styles.progressFill, { width: `${progress}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                </View>
            </View>

            {/* All Tiers */}
            <Text style={styles.sectionTitle}>League Tiers</Text>
            {tiers.map((tier, index) => (
                <TierBadge
                    key={tier.name}
                    tier={tier}
                    isActive={tier.name === teamLeague.currentTier}
                    isUnlocked={teamLeague.xp >= tier.minXP}
                />
            ))}
        </View>
    );
};

const TierBadge = ({ tier, isActive, isUnlocked }) => {
    return (
        <View style={[styles.tierBadge, isActive && styles.tierBadgeActive]}>
            <LinearGradient
                colors={isUnlocked ? tier.color : ['#334155', '#1e293b']}
                style={styles.tierBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.tierBadgeContent}>
                    <View style={styles.tierBadgeLeft}>
                        <Text style={styles.tierBadgeName}>{tier.name}</Text>
                        <Text style={styles.tierBadgeXP}>{tier.minXP.toLocaleString()}+ XP</Text>
                    </View>
                    {isActive && (
                        <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>CURRENT</Text>
                        </View>
                    )}
                    {!isUnlocked && (
                        <Text style={styles.lockedIcon}>🔒</Text>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

// Leaderboard Tab
const LeaderboardTab = ({ leaderboard, selectedRegion, setSelectedRegion }) => {
    const regions = ['All', 'NA', 'EU', 'AS'];
    const filteredLeaderboard = selectedRegion === 'All'
        ? leaderboard
        : leaderboard.filter(p => p.region === selectedRegion);

    return (
        <View style={styles.leaderboardContainer}>
            {/* Region Filters */}
            <View style={styles.regionFilters}>
                {regions.map((region) => (
                    <TouchableOpacity
                        key={region}
                        style={[
                            styles.regionFilter,
                            selectedRegion === region && styles.regionFilterActive,
                        ]}
                        onPress={() => setSelectedRegion(region)}
                    >
                        <Text
                            style={[
                                styles.regionFilterText,
                                selectedRegion === region && styles.regionFilterTextActive,
                            ]}
                        >
                            {region}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Leaderboard List */}
            {filteredLeaderboard.map((player) => (
                <LeaderboardCard key={player.rank} player={player} />
            ))}
        </View>
    );
};

const LeaderboardCard = ({ player }) => {
    const getRankColor = (rank) => {
        if (rank === 1) return ['#ffd700', '#ffb700'];
        if (rank === 2) return ['#c0c0c0', '#a8a8a8'];
        if (rank === 3) return ['#cd7f32', '#b87333'];
        return ['#334155', '#1e293b'];
    };

    const getChangeColor = (change) => {
        if (change.startsWith('+')) return '#4ade80';
        if (change.startsWith('-')) return '#ef4444';
        return '#64748b';
    };

    return (
        <View style={styles.leaderboardCard}>
            <LinearGradient
                colors={getRankColor(player.rank)}
                style={styles.rankBadge}
            >
                <Text style={styles.rankText}>#{player.rank}</Text>
            </LinearGradient>

            <Text style={styles.playerAvatar}>{player.avatar}</Text>

            <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerRegion}>{player.region} • {player.xp.toLocaleString()} XP</Text>
            </View>

            <View style={[styles.changeIndicator, { borderColor: getChangeColor(player.change) }]}>
                <Text style={[styles.changeText, { color: getChangeColor(player.change) }]}>
                    {player.change}
                </Text>
            </View>
        </View>
    );
};

// Challenges Tab
const ChallengesTab = ({ challenges, formatTime }) => {
    return (
        <View style={styles.challengesContainer}>
            <View style={styles.challengeSection}>
                <Text style={styles.challengeSectionTitle}>⚡ Solo Quests</Text>
                {challenges.solo.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} formatTime={formatTime} />
                ))}
            </View>

            <View style={styles.challengeSection}>
                <Text style={styles.challengeSectionTitle}>🤝 Duo Challenges</Text>
                {challenges.duo.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} formatTime={formatTime} />
                ))}
            </View>

            <View style={styles.challengeSection}>
                <Text style={styles.challengeSectionTitle}>👥 7-Day Team Missions</Text>
                {challenges.team.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} formatTime={formatTime} type="team" />
                ))}
            </View>
        </View>
    );
};

const ChallengeCard = ({ challenge, formatTime, type = 'solo' }) => {
    const progress = (challenge.progress / challenge.goal) * 100;

    return (
        <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
                <View style={styles.challengeTitleSection}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDesc}>{challenge.desc}</Text>
                </View>
                <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>⚡{challenge.reward}</Text>
                </View>
            </View>

            <View style={styles.challengeProgress}>
                <View style={styles.challengeProgressBar}>
                    <View style={[styles.challengeProgressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.challengeProgressText}>
                    {type === 'team'
                        ? `${challenge.progress.toLocaleString()} / ${challenge.goal.toLocaleString()}`
                        : `${challenge.progress} / ${challenge.goal}`}
                </Text>
            </View>

            <View style={styles.challengeFooter}>
                <Text style={styles.challengeTime}>⏰ {formatTime(challenge.timeLeft)} left</Text>
                <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>View →</Text>
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: '#4ade80',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
    },
    tabTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },

    // League Tab
    leagueContainer: {
        padding: 15,
    },
    tierCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    tierCardGradient: {
        padding: 30,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
    },
    tierEmoji: {
        fontSize: 60,
        marginBottom: 15,
    },
    tierName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tierRank: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 15,
    },
    seasonBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    seasonText: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: '600',
    },
    progressCard: {
        backgroundColor: '#1e293b',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    progressXP: {
        fontSize: 14,
        color: '#4ade80',
        fontWeight: '600',
    },
    progressBar: {
        height: 12,
        backgroundColor: '#334155',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    tierBadge: {
        marginBottom: 12,
        borderRadius: 15,
        overflow: 'hidden',
    },
    tierBadgeActive: {
        borderWidth: 2,
        borderColor: '#4ade80',
    },
    tierBadgeGradient: {
        padding: 15,
    },
    tierBadgeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tierBadgeLeft: {},
    tierBadgeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    tierBadgeXP: {
        fontSize: 13,
        color: '#e0e0e0',
    },
    currentBadge: {
        backgroundColor: '#4ade80',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    currentBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    lockedIcon: {
        fontSize: 24,
        opacity: 0.5,
    },

    // Leaderboard Tab
    leaderboardContainer: {
        padding: 15,
    },
    regionFilters: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    regionFilter: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
    },
    regionFilterActive: {
        backgroundColor: '#4ade80',
        borderColor: '#4ade80',
    },
    regionFilterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    regionFilterTextActive: {
        color: '#ffffff',
    },
    leaderboardCard: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    rankBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    playerAvatar: {
        fontSize: 28,
        marginRight: 12,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    playerRegion: {
        fontSize: 12,
        color: '#64748b',
    },
    changeIndicator: {
        width: 50,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
    },
    changeText: {
        fontSize: 13,
        fontWeight: 'bold',
    },

    // Challenges Tab
    challengesContainer: {
        padding: 15,
    },
    challengeSection: {
        marginBottom: 25,
    },
    challengeSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
    },
    challengeCard: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 18,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#8b5cf6',
    },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    challengeTitleSection: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    challengeDesc: {
        fontSize: 13,
        color: '#94a3b8',
    },
    rewardBadge: {
        backgroundColor: '#fbbf24',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginLeft: 10,
    },
    rewardText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    challengeProgress: {
        marginBottom: 12,
    },
    challengeProgressBar: {
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 6,
    },
    challengeProgressFill: {
        height: '100%',
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
    },
    challengeProgressText: {
        fontSize: 12,
        color: '#cbd5e1',
        textAlign: 'right',
    },
    challengeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    challengeTime: {
        fontSize: 12,
        color: '#64748b',
    },
    acceptButton: {
        backgroundColor: '#8b5cf6',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    acceptButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});
