import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Mock data
const TEAM_DATA = {
    name: 'Hybrid Heroes',
    emoji: '🦸',
    level: 42,
    standing: 3,
    totalMembers: 312,
    weeklyXP: 89450,
    currentStreak: 12,
};

const RIVAL_TEAM = {
    name: 'Iron Warriors',
    emoji: '⚔️',
    weeklyXP: 85200,
};

const LIVE_ACTIVITIES = [
    { id: 1, user: 'Sarah', xp: 300, action: 'completed HIIT workout', time: '2m ago' },
    { id: 2, user: 'Mike', xp: 540, action: 'crushed a 5K run', time: '5m ago' },
    { id: 3, user: 'Alex', xp: 425, action: 'hit new PR on deadlifts', time: '8m ago' },
    { id: 4, user: 'Emma', xp: 380, action: 'finished yoga session', time: '12m ago' },
];

const ROSTER = [
    { id: 1, name: 'Sarah Chen', avatar: '🏋️', weeklyXP: 8450, rank: 1, isLeader: true },
    { id: 2, name: 'Mike Johnson', avatar: '🚴', weeklyXP: 7820, rank: 2, isLeader: false },
    { id: 3, name: 'Alex Rivera', avatar: '🏃', weeklyXP: 7215, rank: 3, isLeader: false },
    { id: 4, name: 'You', avatar: '⚡', weeklyXP: 6890, rank: 4, isLeader: false },
    { id: 5, name: 'Emma Davis', avatar: '🤸', weeklyXP: 6340, rank: 5, isLeader: false },
    { id: 6, name: 'Chris Lee', avatar: '🏊', weeklyXP: 5920, rank: 6, isLeader: false },
];

const CHAT_MESSAGES = [
    { id: 1, user: 'Sarah', avatar: '🏋️', message: "Let's crush it this week team! 💪", time: '10:30 AM', isPinned: true },
    { id: 2, user: 'Mike', avatar: '🚴', message: 'Who wants to join me for a group run tomorrow?', time: '11:15 AM', isPinned: false },
    { id: 3, user: 'System', avatar: '🏆', message: '⚡ Challenge Alert: Beat Iron Warriors by 10k XP this week!', time: '12:00 PM', isPinned: true, isAlert: true },
    { id: 4, user: 'Alex', avatar: '🏃', message: 'Just hit a new PR! Feeling pumped 🔥', time: '1:45 PM', reactions: ['🔥', '💪', '👏'] },
];

export default function TeamHubScreen() {
    const [activeTab, setActiveTab] = useState('arena'); // arena, roster, chat
    const [xpBoostActive, setXpBoostActive] = useState(false);
    const [boostTimeLeft, setBoostTimeLeft] = useState(0);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const tickerAnim = useRef(new Animated.Value(0)).current;

    // Calculate XP percentage for tug-of-war
    const totalXP = TEAM_DATA.weeklyXP + RIVAL_TEAM.weeklyXP;
    const teamPercentage = (TEAM_DATA.weeklyXP / totalXP) * 100;

    useEffect(() => {
        // Animate progress bar
        Animated.timing(progressAnim, {
            toValue: teamPercentage,
            duration: 1500,
            useNativeDriver: false,
        }).start();

        // Animate ticker
        Animated.loop(
            Animated.timing(tickerAnim, {
                toValue: 1,
                duration: 20000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const activateXPBoost = () => {
        setXpBoostActive(true);
        setBoostTimeLeft(3600); // 60 minutes in seconds

        // Countdown timer
        const interval = setInterval(() => {
            setBoostTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setXpBoostActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Days until Sunday
    const daysUntilSunday = 7 - new Date().getDay();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.teamTitleSection}>
                        <Text style={styles.teamEmoji}>{TEAM_DATA.emoji}</Text>
                        <View>
                            <Text style={styles.teamName}>{TEAM_DATA.name}</Text>
                            <Text style={styles.teamLevel}>Level {TEAM_DATA.level} • #{TEAM_DATA.standing} in League</Text>
                        </View>
                    </View>

                    {xpBoostActive && (
                        <View style={styles.boostBadge}>
                            <Text style={styles.boostText}>⚡ 2x {formatTime(boostTimeLeft)}</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'arena' && styles.tabActive]}
                    onPress={() => setActiveTab('arena')}
                >
                    <Text style={[styles.tabText, activeTab === 'arena' && styles.tabTextActive]}>
                        ⚔️ Arena
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'roster' && styles.tabActive]}
                    onPress={() => setActiveTab('roster')}
                >
                    <Text style={[styles.tabText, activeTab === 'roster' && styles.tabTextActive]}>
                        👥 Roster
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
                    onPress={() => setActiveTab('chat')}
                >
                    <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
                        💬 Chat
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'arena' && (
                    <ArenaTab
                        teamData={TEAM_DATA}
                        rivalTeam={RIVAL_TEAM}
                        teamPercentage={teamPercentage}
                        progressAnim={progressAnim}
                        daysUntilSunday={daysUntilSunday}
                        liveActivities={LIVE_ACTIVITIES}
                        tickerAnim={tickerAnim}
                        xpBoostActive={xpBoostActive}
                        onActivateBoost={activateXPBoost}
                    />
                )}

                {activeTab === 'roster' && (
                    <RosterTab roster={ROSTER} />
                )}

                {activeTab === 'chat' && (
                    <ChatTab messages={CHAT_MESSAGES} />
                )}
            </ScrollView>
        </View>
    );
}

// Arena Tab Component
const ArenaTab = ({ teamData, rivalTeam, teamPercentage, progressAnim, daysUntilSunday, liveActivities, tickerAnim, xpBoostActive, onActivateBoost }) => {
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.arenaContainer}>
            {/* Battle Arena */}
            <View style={styles.battleCard}>
                <Text style={styles.battleTitle}>⚔️ Weekly Battle Arena</Text>
                <Text style={styles.battleSubtitle}>Ends in {daysUntilSunday} days</Text>

                <View style={styles.vsContainer}>
                    <View style={styles.teamInfo}>
                        <Text style={styles.vsTeamEmoji}>{teamData.emoji}</Text>
                        <Text style={styles.vsTeamName}>{teamData.name}</Text>
                    </View>
                    <Text style={styles.vsText}>VS</Text>
                    <View style={styles.teamInfo}>
                        <Text style={styles.vsTeamEmoji}>{rivalTeam.emoji}</Text>
                        <Text style={styles.vsTeamName}>{rivalTeam.name}</Text>
                    </View>
                </View>

                {/* Tug of War Bar */}
                <View style={styles.tugOfWarContainer}>
                    <View style={styles.tugOfWarBar}>
                        <Animated.View style={[styles.tugOfWarProgress, { width: progressWidth }]}>
                            <LinearGradient
                                colors={['#8b5cf6', '#a78bfa']}
                                style={styles.tugOfWarGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </Animated.View>
                    </View>

                    <View style={styles.tugOfWarScores}>
                        <Text style={styles.xpScore}>{teamData.weeklyXP.toLocaleString()} XP</Text>
                        <Text style={styles.xpScore}>{rivalTeam.weeklyXP.toLocaleString()} XP</Text>
                    </View>
                </View>

                <View style={styles.leadContainer}>
                    <Text style={styles.leadText}>
                        {teamData.weeklyXP > rivalTeam.weeklyXP ? '🎉 You\'re Leading!' : '⚡ Time to Push!'}
                    </Text>
                    <Text style={styles.leadAmount}>
                        {Math.abs(teamData.weeklyXP - rivalTeam.weeklyXP).toLocaleString()} XP difference
                    </Text>
                </View>
            </View>

            {/* Team Stats */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{teamData.level}</Text>
                    <Text style={styles.statLabel}>Team Level</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>#{teamData.standing}</Text>
                    <Text style={styles.statLabel}>Standing</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{teamData.currentStreak} 🔥</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
            </View>

            {/* Live Ticker */}
            <View style={styles.tickerCard}>
                <Text style={styles.tickerTitle}>🔴 Live Activity</Text>
                <View style={styles.tickerContainer}>
                    {liveActivities.map((activity) => (
                        <View key={activity.id} style={styles.tickerItem}>
                            <Text style={styles.tickerText}>
                                <Text style={styles.tickerUser}>{activity.user}</Text> {activity.action}
                                <Text style={styles.tickerXP}> +{activity.xp} XP</Text>
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Leader Tools */}
            <View style={styles.leaderTools}>
                <Text style={styles.leaderTitle}>👑 Leader Tools</Text>

                <TouchableOpacity
                    style={[styles.boostButton, xpBoostActive && styles.boostButtonActive]}
                    onPress={onActivateBoost}
                    disabled={xpBoostActive}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={xpBoostActive ? ['#6b7280', '#4b5563'] : ['#fbbf24', '#f59e0b']}
                        style={styles.boostButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.boostButtonText}>
                            {xpBoostActive ? '⚡ Boost Active' : '⚡ Activate 2x XP Boost (60 min)'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.leaderActions}>
                    <TouchableOpacity style={styles.leaderActionButton}>
                        <Text style={styles.leaderActionText}>✅ Approve Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.leaderActionButton}>
                        <Text style={styles.leaderActionText}>❌ Manage Members</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Roster Tab Component
const RosterTab = ({ roster }) => {
    return (
        <View style={styles.rosterContainer}>
            <Text style={styles.rosterTitle}>Weekly XP Leaderboard</Text>

            {roster.map((member) => (
                <View key={member.id} style={styles.rosterCard}>
                    <View style={styles.rosterRank}>
                        <Text style={styles.rosterRankText}>#{member.rank}</Text>
                    </View>

                    <Text style={styles.rosterAvatar}>{member.avatar}</Text>

                    <View style={styles.rosterInfo}>
                        <View style={styles.rosterNameRow}>
                            <Text style={styles.rosterName}>{member.name}</Text>
                            {member.isLeader && <Text style={styles.leaderBadge}>👑</Text>}
                        </View>
                        <Text style={styles.rosterXP}>{member.weeklyXP.toLocaleString()} XP this week</Text>
                    </View>

                    <TouchableOpacity style={styles.rosterMoreButton}>
                        <Text style={styles.rosterMoreText}>⋯</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

// Chat Tab Component
const ChatTab = ({ messages }) => {
    const [newMessage, setNewMessage] = useState('');

    return (
        <View style={styles.chatContainer}>
            {messages.map((msg) => (
                <View
                    key={msg.id}
                    style={[
                        styles.chatMessage,
                        msg.isPinned && styles.chatMessagePinned,
                        msg.isAlert && styles.chatMessageAlert,
                    ]}
                >
                    {msg.isPinned && (
                        <View style={styles.pinnedBadge}>
                            <Text style={styles.pinnedBadgeText}>📌 Pinned</Text>
                        </View>
                    )}

                    <View style={styles.chatHeader}>
                        <Text style={styles.chatAvatar}>{msg.avatar}</Text>
                        <View style={styles.chatUserInfo}>
                            <Text style={styles.chatUser}>{msg.user}</Text>
                            <Text style={styles.chatTime}>{msg.time}</Text>
                        </View>
                    </View>

                    <Text style={styles.chatText}>{msg.message}</Text>

                    {msg.reactions && (
                        <View style={styles.chatReactions}>
                            {msg.reactions.map((reaction, idx) => (
                                <Text key={idx} style={styles.chatReaction}>{reaction}</Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}

            {/* Message Input */}
            <View style={styles.chatInputContainer}>
                <TextInput
                    style={styles.chatInput}
                    placeholder="Send a message..."
                    placeholderTextColor="#64748b"
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.chatSendButton}>
                    <Text style={styles.chatSendText}>➤</Text>
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
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teamTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    teamEmoji: {
        fontSize: 50,
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    teamLevel: {
        fontSize: 14,
        color: '#e0e0e0',
        marginTop: 4,
    },
    boostBadge: {
        backgroundColor: 'rgba(251, 191, 36, 0.3)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fbbf24',
    },
    boostText: {
        color: '#fbbf24',
        fontSize: 14,
        fontWeight: 'bold',
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
        borderBottomColor: '#8b5cf6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    tabTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },

    // Arena Tab
    arenaContainer: {
        padding: 15,
    },
    battleCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    battleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 5,
    },
    battleSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 20,
    },
    vsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 25,
    },
    teamInfo: {
        alignItems: 'center',
    },
    vsTeamEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    vsTeamName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    vsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    tugOfWarContainer: {
        marginBottom: 15,
    },
    tugOfWarBar: {
        height: 30,
        backgroundColor: '#ef4444',
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 10,
    },
    tugOfWarProgress: {
        height: '100%',
    },
    tugOfWarGradient: {
        flex: 1,
    },
    tugOfWarScores: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    xpScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    leadContainer: {
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    leadText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4ade80',
        marginBottom: 4,
    },
    leadAmount: {
        fontSize: 14,
        color: '#94a3b8',
    },
    statsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#334155',
    },
    tickerCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    tickerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    tickerContainer: {
        gap: 12,
    },
    tickerItem: {
        paddingVertical: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4ade80',
        paddingLeft: 12,
    },
    tickerText: {
        fontSize: 14,
        color: '#cbd5e1',
    },
    tickerUser: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    tickerXP: {
        color: '#4ade80',
        fontWeight: 'bold',
    },
    leaderTools: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    leaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    boostButton: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 15,
    },
    boostButtonActive: {
        opacity: 0.6,
    },
    boostButtonGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    boostButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    leaderActions: {
        flexDirection: 'row',
        gap: 10,
    },
    leaderActionButton: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    leaderActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#cbd5e1',
        textAlign: 'center',
    },

    // Roster Tab
    rosterContainer: {
        padding: 15,
    },
    rosterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    rosterCard: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    rosterRank: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rosterRankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    rosterAvatar: {
        fontSize: 32,
        marginRight: 12,
    },
    rosterInfo: {
        flex: 1,
    },
    rosterNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rosterName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    leaderBadge: {
        fontSize: 16,
    },
    rosterXP: {
        fontSize: 13,
        color: '#4ade80',
        marginTop: 4,
    },
    rosterMoreButton: {
        padding: 8,
    },
    rosterMoreText: {
        fontSize: 24,
        color: '#64748b',
    },

    // Chat Tab
    chatContainer: {
        padding: 15,
        paddingBottom: 80,
    },
    chatMessage: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    chatMessagePinned: {
        borderColor: '#8b5cf6',
        borderWidth: 2,
    },
    chatMessageAlert: {
        backgroundColor: '#7c3aed',
        borderColor: '#8b5cf6',
    },
    pinnedBadge: {
        marginBottom: 8,
    },
    pinnedBadgeText: {
        fontSize: 12,
        color: '#a78bfa',
        fontWeight: '600',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    chatAvatar: {
        fontSize: 28,
    },
    chatUserInfo: {
        flex: 1,
    },
    chatUser: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    chatTime: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    chatText: {
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 20,
    },
    chatReactions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    chatReaction: {
        fontSize: 18,
    },
    chatInputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        gap: 10,
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 14,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#334155',
    },
    chatSendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatSendText: {
        fontSize: 20,
        color: '#ffffff',
    },
});
