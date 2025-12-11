import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TEAMS = [
    {
        id: 'iron-warriors',
        name: 'Iron Warriors',
        members: 234,
        activity: 'Very Active',
        focus: 'Strength Training',
        emoji: '⚔️',
        color: ['#ef4444', '#dc2626'],
        location: 'Nearby',
    },
    {
        id: 'cardio-kings',
        name: 'Cardio Kings',
        members: 189,
        activity: 'Active',
        focus: 'Running & Cardio',
        emoji: '👑',
        color: ['#3b82f6', '#2563eb'],
        location: 'Your Gym',
    },
    {
        id: 'hybrid-heroes',
        name: 'Hybrid Heroes',
        members: 312,
        activity: 'Very Active',
        focus: 'Mixed Training',
        emoji: '🦸',
        color: ['#8b5cf6', '#7c3aed'],
        location: 'Nearby',
    },
    {
        id: 'morning-crew',
        name: 'Morning Crew',
        members: 156,
        activity: 'Moderate',
        focus: 'Early Bird Workouts',
        emoji: '🌅',
        color: ['#f59e0b', '#d97706'],
        location: 'Your Gym',
    },
];

export default function TeamSelectionScreen({ navigation, route }) {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const { archetype, skillLevel, xpMultiplier } = route.params;

    const handleSelectTeam = (teamId) => {
        setSelectedTeam(teamId);
    };

    const handleContinue = () => {
        navigation.navigate('Completion', {
            archetype,
            skillLevel,
            xpMultiplier,
            team: selectedTeam,
        });
    };

    const handleSkip = () => {
        navigation.navigate('Completion', {
            archetype,
            skillLevel,
            xpMultiplier,
            team: null,
        });
    };

    return (
        <LinearGradient
            colors={['#1e293b', '#334155', '#475569']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.filterContainer}>
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterText}>📍 Nearby</Text>
                    </View>
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterText}>🏋️ Your Gym</Text>
                    </View>
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterText}>⭐ Recommended</Text>
                    </View>
                </View>

                <View style={styles.teamsContainer}>
                    {TEAMS.map((team) => (
                        <TouchableOpacity
                            key={team.id}
                            activeOpacity={0.9}
                            onPress={() => handleSelectTeam(team.id)}
                        >
                            <LinearGradient
                                colors={team.color}
                                style={[
                                    styles.teamCard,
                                    selectedTeam === team.id && styles.selectedTeamCard,
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {selectedTeam === team.id && (
                                    <View style={styles.selectedBadge}>
                                        <Text style={styles.selectedBadgeText}>✓</Text>
                                    </View>
                                )}

                                <View style={styles.teamHeader}>
                                    <Text style={styles.teamEmoji}>{team.emoji}</Text>
                                    <View style={styles.teamInfo}>
                                        <Text style={styles.teamName}>{team.name}</Text>
                                        <Text style={styles.teamLocation}>{team.location}</Text>
                                    </View>
                                </View>

                                <View style={styles.teamStats}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>{team.members}</Text>
                                        <Text style={styles.statLabel}>Members</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>{team.activity}</Text>
                                        <Text style={styles.statLabel}>Activity</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>{team.focus}</Text>
                                        <Text style={styles.statLabel}>Focus</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    {selectedTeam ? (
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4ade80', '#22c55e']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.buttonText}>Join Team →</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkip}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.progressIndicator}>
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={styles.progressDot} />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#cbd5e1',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 25,
        flexWrap: 'wrap',
    },
    filterBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    filterText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    teamsContainer: {
        gap: 15,
        marginBottom: 25,
    },
    teamCard: {
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        position: 'relative',
    },
    selectedTeamCard: {
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    selectedBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#ffffff',
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedBadgeText: {
        fontSize: 20,
        color: '#22c55e',
        fontWeight: 'bold',
    },
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    teamEmoji: {
        fontSize: 50,
        marginRight: 15,
    },
    teamInfo: {
        flex: 1,
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    teamLocation: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    teamStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 15,
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#e0e0e0',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    buttonContainer: {
        gap: 15,
        marginTop: 10,
    },
    continueButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
    },
    skipButton: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        color: '#cbd5e1',
        textDecorationLine: 'underline',
    },
    progressIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressDotActive: {
        backgroundColor: '#4ade80',
        width: 30,
    },
});
