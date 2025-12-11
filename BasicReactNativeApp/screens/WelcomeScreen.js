import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const glowAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous glow animation for tagline
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.2,
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

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/sports_welcome.png')}
                style={styles.backgroundImage}
                blurRadius={2}
            >
                <LinearGradient
                    colors={['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.9)']}
                    style={styles.overlay}
                >
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.logoContainer}>
                            <Text style={styles.logo}>💪</Text>
                            <Text style={styles.brandName}>FitLeague</Text>
                        </View>

                        <Animated.View
                            style={[
                                styles.taglineContainer,
                                { transform: [{ scale: glowAnim }] },
                            ]}
                        >
                            <Text style={styles.tagline}>Gamify Your Fitness</Text>
                            <Text style={styles.subtitle}>
                                Join the ultimate fitness challenge
                            </Text>
                        </Animated.View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('AvatarSetup')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4ade80', '#22c55e']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.buttonText}>Get Started</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.featuresList}>
                            <FeatureItem icon="🏆" text="Compete with friends" />
                            <FeatureItem icon="📊" text="Track your progress" />
                            <FeatureItem icon="⚡" text="Earn XP & rewards" />
                        </View>
                    </Animated.View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const FeatureItem = ({ icon, text }) => (
    <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 80,
        marginBottom: 10,
    },
    brandName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
    },
    taglineContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    tagline: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#e0e0e0',
        textAlign: 'center',
    },
    button: {
        width: width * 0.7,
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
    featuresList: {
        width: '100%',
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    featureText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
    },
});
