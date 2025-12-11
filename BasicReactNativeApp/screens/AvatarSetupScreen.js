import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ARCHETYPES = [
    {
        id: 'runner',
        name: 'Runner',
        emoji: '🏃',
        description: 'Speed & Endurance',
        details: 'Focus on cardio, stamina, and long-distance performance',
        color: ['#3b82f6', '#06b6d4'],
    },
    {
        id: 'lifter',
        name: 'Lifter',
        emoji: '🏋️',
        description: 'Strength & Power',
        details: 'Build muscle, increase strength, and dominate the weights',
        color: ['#ef4444', '#f97316'],
    },
    {
        id: 'hybrid',
        name: 'Hybrid',
        emoji: '⚡',
        description: 'Balanced All-Around',
        details: 'Master both strength and cardio for complete fitness',
        color: ['#a855f7', '#ec4899'],
    },
];

export default function AvatarSetupScreen({ navigation }) {
    const [selectedArchetype, setSelectedArchetype] = useState(null);
    const scaleAnims = useRef(
        ARCHETYPES.map(() => new Animated.Value(1))
    ).current;

    const handleSelectArchetype = (archetype, index) => {
        setSelectedArchetype(archetype.id);

        // Animate button press
        Animated.sequence([
            Animated.timing(scaleAnims[index], {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[index], {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleContinue = () => {
        if (selectedArchetype) {
            navigation.navigate('FitnessBaseline', { archetype: selectedArchetype });
        }
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
                <View style={styles.header}>
                    <Text style={styles.title}>Choose Your Path</Text>
                    <Text style={styles.subtitle}>
                        Select the archetype that matches your fitness goals
                    </Text>
                </View>

                <View style={styles.archetypesContainer}>
                    {ARCHETYPES.map((archetype, index) => (
                        <Animated.View
                            key={archetype.id}
                            style={[
                                styles.cardWrapper,
                                { transform: [{ scale: scaleAnims[index] }] },
                            ]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => handleSelectArchetype(archetype, index)}
                            >
                                <LinearGradient
                                    colors={archetype.color}
                                    style={[
                                        styles.archetypeCard,
                                        selectedArchetype === archetype.id &&
                                        styles.selectedCard,
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {selectedArchetype === archetype.id && (
                                        <View style={styles.selectedBadge}>
                                            <Text style={styles.selectedBadgeText}>✓</Text>
                                        </View>
                                    )}

                                    <Text style={styles.archetypeEmoji}>{archetype.emoji}</Text>
                                    <Text style={styles.archetypeName}>{archetype.name}</Text>
                                    <Text style={styles.archetypeDescription}>
                                        {archetype.description}
                                    </Text>
                                    <Text style={styles.archetypeDetails}>
                                        {archetype.details}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {selectedArchetype && (
                    <Animated.View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4ade80', '#22c55e']}
                                style={styles.continueButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.continueButtonText}>
                                    Continue →
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <View style={styles.progressIndicator}>
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={styles.progressDot} />
                    <View style={styles.progressDot} />
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
        marginBottom: 30,
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
    archetypesContainer: {
        gap: 20,
        marginBottom: 30,
    },
    cardWrapper: {
        width: '100%',
    },
    archetypeCard: {
        padding: 30,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
        position: 'relative',
    },
    selectedCard: {
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    selectedBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#ffffff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedBadgeText: {
        fontSize: 24,
        color: '#22c55e',
        fontWeight: 'bold',
    },
    archetypeEmoji: {
        fontSize: 80,
        marginBottom: 15,
    },
    archetypeName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    archetypeDescription: {
        fontSize: 18,
        color: '#f0f0f0',
        marginBottom: 10,
        fontWeight: '600',
    },
    archetypeDetails: {
        fontSize: 14,
        color: '#e0e0e0',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    continueButton: {
        width: width * 0.7,
        borderRadius: 30,
        overflow: 'hidden',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
    },
    progressIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 30,
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
