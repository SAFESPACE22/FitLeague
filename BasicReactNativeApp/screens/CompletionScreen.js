import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Easing,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

// Particle component
const Particle = ({ delay, duration, startX }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -height,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.delay(duration - 1000),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: duration - 200,
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
                    left: startX,
                    opacity,
                    transform: [{ translateY }, { scale }],
                },
            ]}
        >
            <Text style={styles.particleText}>✨</Text>
        </Animated.View>
    );
};

export default function CompletionScreen({ route, navigation }) {
    const { archetype, skillLevel, xpMultiplier, team } = route.params || {};

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(1)).current;
    const [sound, setSound] = useState();

    useEffect(() => {
        // Play celebration sound
        playSound();

        // Animate text entrance
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        // Continuous glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.1,
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

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    async function playSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/success.mp3'),
                { shouldPlay: true }
            );
            setSound(sound);
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    // Generate particles
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push(
            <Particle
                key={i}
                delay={i * 100}
                duration={3000 + Math.random() * 2000}
                startX={Math.random() * width}
            />
        );
    }

    return (
        <LinearGradient
            colors={['#1e1b4b', '#312e81', '#4c1d95']}
            style={styles.container}
        >
            {/* Particles */}
            <View style={styles.particlesContainer}>{particles}</View>

            {/* Main content */}
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.celebrationContainer,
                        { transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <Text style={styles.celebrationEmoji}>🎉</Text>

                    <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
                        <Text style={styles.celebrationTitle}>
                            You Joined the League!
                        </Text>
                    </Animated.View>

                    <Text style={styles.celebrationSubtitle}>
                        Your fitness journey starts now
                    </Text>
                </Animated.View>

                {/* <View style={styles.summaryContainer}>
    <LinearGradient
        colors={['rgba(139, 92, 246, 0.4)', 'rgba(124, 58, 237, 0.4)']}
        style={styles.summaryCard}
    >
        <Text style={styles.summaryTitle}>Your Profile</Text>

        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Archetype:</Text>
            <Text style={styles.summaryValue}>
                {archetype === 'runner' ? '🏃 Runner' : archetype === 'lifter' ? '🏋️ Lifter' : '⚡ Hybrid'}
            </Text>
        </View>

        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Skill Level:</Text>
            <Text style={styles.summaryValue}>{skillLevel || 'Intermediate'}</Text>
        </View>

        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>XP Multiplier:</Text>
            <Text style={styles.summaryValueHighlight}>
                {xpMultiplier || 1.5}x
            </Text>
        </View>

        {team && (
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Team:</Text>
                <Text style={styles.summaryValue}>{team}</Text>
            </View>
        )}
    </LinearGradient>
</View> 
*/}

                <View style={styles.xpBadgeContainer}>
                    <LinearGradient
                        colors={['#fbbf24', '#f59e0b']}
                        style={styles.xpBadge}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate('MainApp')}>
                            <Text style={styles.xpBadgeText}>+500 XP</Text>
                            <Text style={styles.xpBadgeSubtext}>Welcome Bonus!</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <Text style={styles.footerText}>
                    Get ready to compete, level up, and achieve your goals! 💪
                </Text>

            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    particle: {
        position: 'absolute',
        bottom: 0,
    },
    particleText: {
        fontSize: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    celebrationContainer: {
        alignItems: 'center',
    },
    celebrationEmoji: {
        fontSize: 100,
        marginBottom: 20,
    },
    celebrationTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    celebrationSubtitle: {
        fontSize: 18,
        color: '#cbd5e1',
        textAlign: 'center',
    },
    summaryContainer: {
        width: '100%',
    },
    summaryCard: {
        padding: 25,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(139, 92, 246, 0.6)',
    },
    summaryTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#cbd5e1',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    summaryValueHighlight: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4ade80',
    },
    xpBadgeContainer: {
        marginVertical: 20,
    },
    xpBadge: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#f59e0b',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
    xpBadgeText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    xpBadgeSubtext: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '600',
    },
    footerText: {
        fontSize: 16,
        color: '#cbd5e1',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    progressIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ade80',
        width: 30,
    },
    continueButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButtonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
    },
});
