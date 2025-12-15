import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Mock data
const USER_PROFILE = {
    name: 'FitWarrior',
    avatar: '⚡',
    level: 42,
    archetype: 'Hybrid',
    seasonTier: 'Diamond II',
    totalXP: 89450,
    currentStreak: 12,
    longestStreak: 28,
    bestWeek: 4250,
    teamContributions: 67890,
    joinDate: '2024-08-15',
};

const TROPHIES = [
    { id: 1, name: 'Week Grinder', desc: '7-day streak', icon: '🔥', earned: true },
    { id: 2, name: 'Consistency King', desc: '30-day perfect attendance', icon: '👑', earned: true },
    { id: 3, name: 'PR Hunter', desc: '10 personal records', icon: '🎯', earned: true },
    { id: 4, name: 'Team Player', desc: '50k team XP contribution', icon: '🦸', earned: true },
    { id: 5, name: 'Early Bird', desc: '20 morning workouts', icon: '🌅', earned: false },
    { id: 6, name: 'Century Club', desc: '100 total workouts', icon: '💯', earned: true },
];

const JOURNEY_EVENTS = [
    { id: 1, type: 'levelup', title: 'Reached Level 42', date: '2 days ago', icon: '⬆️' },
    { id: 2, type: 'pr', title: 'New PR: Deadlift 315 lbs', date: '5 days ago', icon: '🏆' },
    { id: 3, type: 'promotion', title: 'Promoted to Diamond II', date: '1 week ago', icon: '💎' },
    { id: 4, type: 'streak', title: '12-Day Streak!', date: '1 week ago', icon: '🔥' },
    { id: 5, type: 'levelup', title: 'Reached Level 40', date: '2 weeks ago', icon: '⬆️' },
];

// Generate heatmap data (last 12 weeks)
const generateHeatmapData = () => {
    const data = [];
    const today = new Date();

    for (let i = 83; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Random workout intensity (0-4)
        const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;

        data.push({
            date: date.toISOString().split('T')[0],
            intensity,
        });
    }

    return data;
};

const HEATMAP_DATA = generateHeatmapData();

export default function ProfileScreen({ navigation }) {
    const glowAnim = useRef(new Animated.Value(1)).current;
    const [settingsVisible, setSettingsVisible] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.2,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleLogout = () => {
        setSettingsVisible(false);
        // Navigate to onboarding
        navigation.getParent()?.navigate('Onboarding');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Settings Icon */}
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setSettingsVisible(true)}
            >
                <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>

            {/* Settings Modal */}
            <Modal
                visible={settingsVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSettingsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>⚙️ Settings</Text>

                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <LinearGradient
                                colors={['#ef4444', '#dc2626']}
                                style={styles.logoutGradient}
                            >
                                <Text style={styles.logoutText}>🚪 Logout</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setSettingsVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Header Background */}
            <LinearGradient
                colors={['#1e293b', '#0f172a']}
                style={styles.headerGradient}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    {/* Season Border Avatar */}
                    <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
                        <LinearGradient
                            colors={['#b9f2ff', '#00bfff']}
                            style={styles.seasonBorder}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarEmoji}>{USER_PROFILE.avatar}</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    <Text style={styles.userName}>{USER_PROFILE.name}</Text>
                    <Text style={styles.userLevel}>
                        Level {USER_PROFILE.level} • {USER_PROFILE.archetype}
                    </Text>

                    <View style={styles.seasonTierBadge}>
                        <LinearGradient
                            colors={['#b9f2ff', '#00bfff']}
                            style={styles.seasonTierGradient}
                        >
                            <Text style={styles.seasonTierText}>💎 {USER_PROFILE.seasonTier}</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard label="Total XP" value={USER_PROFILE.totalXP.toLocaleString()} icon="⚡" />
                    <StatCard label="Streak" value={`${USER_PROFILE.currentStreak} 🔥`} />
                    <StatCard label="Best Week" value={USER_PROFILE.bestWeek.toLocaleString()} icon="🏆" />
                    <StatCard label="Team XP" value={USER_PROFILE.teamContributions.toLocaleString()} icon="🦸" />
                </View>

                {/* Streak Heatmap */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📅 Workout Activity</Text>
                    <HeatmapCalendar data={HEATMAP_DATA} />
                    <View style={styles.heatmapLegend}>
                        <Text style={styles.legendText}>Less</Text>
                        <View style={styles.legendDots}>
                            <View style={[styles.legendDot, { backgroundColor: '#1e293b' }]} />
                            <View style={[styles.legendDot, { backgroundColor: '#3b82f6', opacity: 0.3 }]} />
                            <View style={[styles.legendDot, { backgroundColor: '#3b82f6', opacity: 0.5 }]} />
                            <View style={[styles.legendDot, { backgroundColor: '#3b82f6', opacity: 0.7 }]} />
                            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                        </View>
                        <Text style={styles.legendText}>More</Text>
                    </View>
                </View>

                {/* Trophy Shelf */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Trophy Shelf</Text>
                    <View style={styles.trophyGrid}>
                        {TROPHIES.map((trophy) => (
                            <TrophyBadge key={trophy.id} trophy={trophy} />
                        ))}
                    </View>
                </View>

                {/* Journey Timeline */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📜 Journey Timeline</Text>
                    {JOURNEY_EVENTS.map((event, index) => (
                        <TimelineEvent key={event.id} event={event} isLast={index === JOURNEY_EVENTS.length - 1} />
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

// Stat Card Component
const StatCard = ({ label, value, icon }) => {
    return (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

// Heatmap Calendar Component
const HeatmapCalendar = ({ data }) => {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
    }

    const getIntensityColor = (intensity) => {
        if (intensity === 0) return '#1e293b';
        if (intensity === 1) return 'rgba(59, 130, 246, 0.3)';
        if (intensity === 2) return 'rgba(59, 130, 246, 0.5)';
        if (intensity === 3) return 'rgba(59, 130, 246, 0.7)';
        return '#3b82f6';
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.heatmapContainer}
        >
            {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.heatmapWeek}>
                    {week.map((day, dayIndex) => (
                        <View
                            key={dayIndex}
                            style={[
                                styles.heatmapCell,
                                { backgroundColor: getIntensityColor(day.intensity) },
                            ]}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

// Trophy Badge Component
const TrophyBadge = ({ trophy }) => {
    return (
        <View style={[styles.trophyBadge, !trophy.earned && styles.trophyBadgeLocked]}>
            <LinearGradient
                colors={trophy.earned ? ['#8b5cf6', '#7c3aed'] : ['#334155', '#1e293b']}
                style={styles.trophyGradient}
            >
                <Text style={[styles.trophyIcon, !trophy.earned && styles.trophyIconLocked]}>
                    {trophy.earned ? trophy.icon : '🔒'}
                </Text>
                <Text style={[styles.trophyName, !trophy.earned && styles.trophyNameLocked]}>
                    {trophy.name}
                </Text>
                <Text style={styles.trophyDesc}>{trophy.desc}</Text>
            </LinearGradient>
        </View>
    );
};

// Timeline Event Component
const TimelineEvent = ({ event, isLast }) => {
    const getEventColor = (type) => {
        switch (type) {
            case 'levelup': return '#4ade80';
            case 'pr': return '#fbbf24';
            case 'promotion': return '#00bfff';
            case 'streak': return '#ef4444';
            default: return '#8b5cf6';
        }
    };

    return (
        <View style={styles.timelineEvent}>
            <View style={styles.timelineLeft}>
                <View style={[styles.timelineIcon, { backgroundColor: getEventColor(event.type) }]}>
                    <Text style={styles.timelineEmoji}>{event.icon}</Text>
                </View>
                {!isLast && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{event.title}</Text>
                <Text style={styles.timelineDate}>{event.date}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
    },
    seasonBorder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        padding: 5,
        marginBottom: 15,
        shadowColor: '#00bfff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 20,
    },
    avatarContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 65,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 70,
    },
    userName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    userLevel: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 15,
    },
    seasonTierBadge: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    seasonTierGradient: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    seasonTierText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 15,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        minWidth: (width - 54) / 2,
        backgroundColor: '#1e293b',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 13,
        color: '#64748b',
    },

    // Section
    section: {
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },

    // Heatmap
    heatmapContainer: {
        gap: 3,
        paddingVertical: 10,
    },
    heatmapWeek: {
        gap: 3,
        marginRight: 3,
    },
    heatmapCell: {
        width: 12,
        height: 12,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#0f172a',
    },
    heatmapLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 6,
    },
    legendText: {
        fontSize: 11,
        color: '#64748b',
    },
    legendDots: {
        flexDirection: 'row',
        gap: 3,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },

    // Trophy Shelf
    trophyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    trophyBadge: {
        width: (width - 54) / 2,
        borderRadius: 15,
        overflow: 'hidden',
    },
    trophyBadgeLocked: {
        opacity: 0.5,
    },
    trophyGradient: {
        padding: 15,
        alignItems: 'center',
        minHeight: 130,
        justifyContent: 'center',
    },
    trophyIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    trophyIconLocked: {
        opacity: 0.4,
    },
    trophyName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 4,
    },
    trophyNameLocked: {
        color: '#64748b',
    },
    trophyDesc: {
        fontSize: 11,
        color: '#cbd5e1',
        textAlign: 'center',
    },

    // Timeline
    timelineEvent: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 15,
    },
    timelineIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineEmoji: {
        fontSize: 20,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#334155',
        marginTop: 8,
    },
    timelineContent: {
        flex: 1,
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 6,
    },
    timelineDate: {
        fontSize: 13,
        color: '#64748b',
    },

    // Settings
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    settingsIcon: {
        fontSize: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 30,
        width: width - 60,
        borderWidth: 2,
        borderColor: '#334155',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
    },
    logoutButton: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 15,
    },
    logoutGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: '#334155',
        borderRadius: 15,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});
