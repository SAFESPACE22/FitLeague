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

const { width, height } = Dimensions.get('window');

// Mock data
const DAILY_QUESTS = [
    { id: 1, title: 'Log a workout', progress: 0, goal: 1, xp: 100, icon: '💪' },
    { id: 2, title: 'Give 5 reactions', progress: 3, goal: 5, xp: 50, icon: '🔥' },
    { id: 3, title: 'Hit 5k steps', progress: 3200, goal: 5000, xp: 75, icon: '👟' },
    { id: 4, title: 'Share a workout', progress: 0, goal: 1, xp: 50, icon: '📤' },
];

const WORKOUT_TYPES = [
    { id: 'lift', name: 'Lift', emoji: '🏋️', color: ['#ef4444', '#dc2626'], xpRate: 10 },
    { id: 'cardio', name: 'Cardio', emoji: '❤️', color: ['#f59e0b', '#d97706'], xpRate: 8 },
    { id: 'run', name: 'Run', emoji: '🏃', color: ['#3b82f6', '#2563eb'], xpRate: 9 },
    { id: 'hiit', name: 'HIIT', emoji: '⚡', color: ['#8b5cf6', '#7c3aed'], xpRate: 12 },
    { id: 'yoga', name: 'Yoga', emoji: '🧘', color: ['#10b981', '#059669'], xpRate: 7 },
];

export default function TrainScreen({ navigation }) {
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [sessionXP, setSessionXP] = useState(0);
    const [sets, setSets] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(7);

    // Animation refs
    const workoutWheelAnim = useRef(new Animated.Value(0)).current;
    const xpCounterAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animate workout wheel entrance
        Animated.spring(workoutWheelAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        let timer;
        if (isSessionActive) {
            timer = setInterval(() => {
                setSessionTime(prev => prev + 1);
                // Accumulate XP based on time (simplified)
                if (selectedWorkout && sessionTime % 10 === 0) {
                    setSessionXP(prev => prev + selectedWorkout.xpRate);
                    // Pulse XP counter
                    Animated.sequence([
                        Animated.timing(xpCounterAnim, {
                            toValue: 1.2,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(xpCounterAnim, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isSessionActive, sessionTime, selectedWorkout]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startWorkout = (workout) => {
        setSelectedWorkout(workout);
        setIsSessionActive(true);
        setSessionTime(0);
        setSessionXP(0);
        setSets(0);
    };

    const addSet = () => {
        setSets(prev => prev + 1);
        setSessionXP(prev => prev + 25);
    };

    const endSession = () => {
        setIsSessionActive(false);
        setShowCompletion(true);
    };

    const closeCompletion = () => {
        setShowCompletion(false);
        setSelectedWorkout(null);
        setSessionTime(0);
        setSessionXP(0);
        setSets(0);
    };

    if (showCompletion) {
        return (
            <CompletionScreen
                workout={selectedWorkout}
                time={sessionTime}
                xp={sessionXP}
                sets={sets}
                streak={currentStreak}
                onClose={closeCompletion}
            />
        );
    }

    if (isSessionActive && selectedWorkout) {
        return (
            <ActiveSessionScreen
                workout={selectedWorkout}
                time={sessionTime}
                xp={sessionXP}
                sets={sets}
                onAddSet={addSet}
                onEnd={endSession}
                xpCounterAnim={xpCounterAnim}
            />
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Train</Text>
                <Text style={styles.headerSubtitle}>Choose your workout</Text>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Daily Quests */}
                <View style={styles.questsSection}>
                    <Text style={styles.sectionTitle}>📋 Daily Quests</Text>
                    {DAILY_QUESTS.map((quest) => (
                        <QuestCard key={quest.id} quest={quest} />
                    ))}
                </View>

                {/* Workout Type Wheel */}
                <View style={styles.workoutWheelSection}>
                    <Text style={styles.sectionTitle}>💪 Choose Workout Type</Text>
                    <Animated.View
                        style={[
                            styles.workoutWheel,
                            {
                                opacity: workoutWheelAnim,
                                transform: [{ scale: workoutWheelAnim }],
                            },
                        ]}
                    >
                        {WORKOUT_TYPES.map((workout, index) => (
                            <WorkoutButton
                                key={workout.id}
                                workout={workout}
                                index={index}
                                onPress={() => startWorkout(workout)}
                            />
                        ))}
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

// Quest Card Component
const QuestCard = ({ quest }) => {
    const progress = Math.min((quest.progress / quest.goal) * 100, 100);
    const isComplete = quest.progress >= quest.goal;

    return (
        <View style={[styles.questCard, isComplete && styles.questCardComplete]}>
            <Text style={styles.questIcon}>{quest.icon}</Text>
            <View style={styles.questInfo}>
                <View style={styles.questHeader}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    <Text style={styles.questXP}>+{quest.xp} XP</Text>
                </View>
                <View style={styles.questProgressContainer}>
                    <View style={styles.questProgressBar}>
                        <View style={[styles.questProgressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.questProgressText}>
                        {quest.progress}/{quest.goal}
                    </Text>
                </View>
            </View>
            {isComplete && (
                <View style={styles.completeCheck}>
                    <Text style={styles.completeCheckText}>✓</Text>
                </View>
            )}
        </View>
    );
};

// Workout Button Component
const WorkoutButton = ({ workout, index, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.workoutButton}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={workout.color}
                style={styles.workoutButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.workoutEmoji}>{workout.emoji}</Text>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutXPRate}>{workout.xpRate} XP/min</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

// Active Session Screen
const ActiveSessionScreen = ({ workout, time, xp, sets, onAddSet, onEnd, xpCounterAnim }) => {
    return (
        <LinearGradient
            colors={workout.color}
            style={styles.sessionContainer}
        >
            <StatusBar style="light" />

            <View style={styles.sessionContent}>
                <Text style={styles.sessionWorkoutType}>{workout.emoji} {workout.name}</Text>

                {/* Timer */}
                <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Session Time</Text>
                    <Text style={styles.timerValue}>{formatTimeDisplay(time)}</Text>
                </View>

                {/* Live XP Counter */}
                <Animated.View
                    style={[
                        styles.xpContainer,
                        { transform: [{ scale: xpCounterAnim }] },
                    ]}
                >
                    <Text style={styles.xpIcon}>⚡</Text>
                    <Text style={styles.xpValue}>{xp}</Text>
                    <Text style={styles.xpLabel}>XP Earned</Text>
                </Animated.View>

                {/* Sets Counter */}
                <View style={styles.setsContainer}>
                    <Text style={styles.setsLabel}>Sets Completed</Text>
                    <Text style={styles.setsValue}>{sets}</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={onAddSet}>
                        <View style={styles.actionButtonInner}>
                            <Text style={styles.actionButtonIcon}>➕</Text>
                            <Text style={styles.actionButtonText}>Add Set</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionButtonInner}>
                            <Text style={styles.actionButtonIcon}>📸</Text>
                            <Text style={styles.actionButtonText}>Add Photo</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* End Session Button */}
                <TouchableOpacity style={styles.endButton} onPress={onEnd}>
                    <Text style={styles.endButtonText}>🏁 End Session</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

// Completion Screen with XP Sparks
const CompletionScreen = ({ workout, time, xp, sets, streak, onClose }) => {
    const [particles, setParticles] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Generate XP spark particles
        const newParticles = [];
        for (let i = 0; i < 30; i++) {
            newParticles.push({
                id: i,
                left: Math.random() * width,
                delay: i * 50,
            });
        }
        setParticles(newParticles);

        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <LinearGradient
            colors={['#1e1b4b', '#312e81', '#4c1d95']}
            style={styles.completionContainer}
        >
            <StatusBar style="light" />

            {/* XP Particles */}
            {particles.map((particle) => (
                <XPParticle key={particle.id} left={particle.left} delay={particle.delay} />
            ))}

            <Animated.View style={[styles.completionContent, { opacity: fadeAnim }]}>
                <Text style={styles.completionEmoji}>🎉</Text>
                <Text style={styles.completionTitle}>Workout Complete!</Text>

                {/* Stats */}
                <View style={styles.completionStats}>
                    <View style={styles.completionStatItem}>
                        <Text style={styles.completionStatValue}>{formatTimeDisplay(time)}</Text>
                        <Text style={styles.completionStatLabel}>Time</Text>
                    </View>
                    <View style={styles.completionStatItem}>
                        <Text style={styles.completionStatValue}>{sets}</Text>
                        <Text style={styles.completionStatLabel}>Sets</Text>
                    </View>
                </View>

                {/* XP Badge */}
                <View style={styles.completionXPBadge}>
                    <LinearGradient
                        colors={['#4ade80', '#22c55e']}
                        style={styles.completionXPGradient}
                    >
                        <Text style={styles.completionXPIcon}>⚡</Text>
                        <Text style={styles.completionXPValue}>+{xp} XP</Text>
                    </LinearGradient>
                </View>

                {/* Streak Meter */}
                <View style={styles.streakMeter}>
                    <Text style={styles.streakTitle}>🔥 Workout Streak</Text>
                    <View style={styles.streakContainer}>
                        <View style={styles.streakBar}>
                            {[...Array(7)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.streakDay,
                                        i < streak && styles.streakDayActive,
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={styles.streakText}>{streak} days strong! 💪</Text>
                    </View>
                </View>

                {/* Done Button */}
                <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.doneButtonGradient}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

// XP Particle Component
const XPParticle = ({ left, delay }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -height,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.delay(2000),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        }, delay);
    }, []);

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Text style={styles.particleText}>✨</Text>
        </Animated.View>
    );
};

const formatTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 4,
    },
    content: {
        flex: 1,
    },

    // Quests Section
    questsSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
    },
    questCard: {
        backgroundColor: '#1e293b',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    questCardComplete: {
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
    questIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    questInfo: {
        flex: 1,
    },
    questHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    questTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    questXP: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4ade80',
    },
    questProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    questProgressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        overflow: 'hidden',
    },
    questProgressFill: {
        height: '100%',
        backgroundColor: '#4ade80',
        borderRadius: 4,
    },
    questProgressText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    completeCheck: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4ade80',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    completeCheckText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    // Workout Wheel
    workoutWheelSection: {
        padding: 15,
    },
    workoutWheel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    workoutButton: {
        width: (width - 54) / 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    workoutButtonGradient: {
        padding: 20,
        alignItems: 'center',
        minHeight: 140,
        justifyContent: 'center',
    },
    workoutEmoji: {
        fontSize: 48,
        marginBottom: 10,
    },
    workoutName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    workoutXPRate: {
        fontSize: 12,
        color: '#e0e0e0',
    },

    // Active Session
    sessionContainer: {
        flex: 1,
    },
    sessionContent: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    sessionWorkoutType: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 16,
        color: '#e0e0e0',
        marginBottom: 10,
    },
    timerValue: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#ffffff',
        fontVariant: ['tabular-nums'],
    },
    xpContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    xpIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    xpValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fbbf24',
        marginBottom: 4,
    },
    xpLabel: {
        fontSize: 14,
        color: '#e0e0e0',
    },
    setsContainer: {
        alignItems: 'center',
    },
    setsLabel: {
        fontSize: 14,
        color: '#e0e0e0',
        marginBottom: 8,
    },
    setsValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    quickActions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
    actionButtonInner: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    actionButtonIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    endButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    endButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },

    // Completion Screen
    completionContainer: {
        flex: 1,
    },
    particle: {
        position: 'absolute',
        bottom: 0,
    },
    particleText: {
        fontSize: 24,
    },
    completionContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    completionEmoji: {
        fontSize: 100,
        marginBottom: 20,
    },
    completionTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
        textAlign: 'center',
    },
    completionStats: {
        flexDirection: 'row',
        gap: 40,
        marginBottom: 30,
    },
    completionStatItem: {
        alignItems: 'center',
    },
    completionStatValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    completionStatLabel: {
        fontSize: 14,
        color: '#cbd5e1',
    },
    completionXPBadge: {
        marginVertical: 30,
    },
    completionXPGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 30,
        gap: 10,
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    completionXPIcon: {
        fontSize: 28,
    },
    completionXPValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    streakMeter: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 30,
    },
    streakTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 15,
        textAlign: 'center',
    },
    streakContainer: {
        alignItems: 'center',
    },
    streakBar: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    streakDay: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#334155',
        borderWidth: 2,
        borderColor: '#475569',
    },
    streakDayActive: {
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
    },
    streakText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    doneButton: {
        width: '80%',
        borderRadius: 30,
        overflow: 'hidden',
    },
    doneButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});
