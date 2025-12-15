import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    ImageBackground,
    StatusBar, // Import StatusBar to manage the status bar style
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

        // Continuous glow/pulse animation for tagline
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1.05, // Slightly scaled up
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 1, // Back to normal
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../assets/images/WelcomePage.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover" // Ensure image covers the screen
            >
                <LinearGradient
                    // Modern Blue-Purple Gradient Overlay
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
                        {/* Top Section: Logo & Brand */}
                        <View style={styles.logoContainer}>
                            {/* Placeholder for Logo Icon - You can add an Image or Icon here */}
                            <Text style={styles.brandName}>FitLeague</Text>
                        </View>

                        {/* Middle Section: Tagline & Subtitle */}
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

                        {/* Bottom Section: Action Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('AvatarSetup')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                // Vibrant Green Gradient for CTA
                                colors={['#4ade80', '#22c55e']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.buttonText}>GET STARTED</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </Animated.View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

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
        justifyContent: 'center', // Center content vertically
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between', // Distribute space evenly
        paddingHorizontal: 30,
        paddingVertical: 80, // More breathing room
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logo: {
        fontSize: 80,
        marginBottom: 10,
        // Removed textShadow for emoji, add back if using text
    },
    brandName: {
        fontSize: 52, // Slightly larger
        fontWeight: '900', // Extra bold
        color: '#ffffff',
        letterSpacing: 3,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        fontFamily: 'System', // Use system font or custom font
    },
    taglineContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    tagline: {
        fontSize: 36, // Larger impact
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 15,
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    subtitle: {
        fontSize: 18,
        color: '#e0e0e0',
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 20,
        lineHeight: 24, // Better readability
    },
    button: {
        width: width * 0.8, // Slightly wider button
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 40,
    },
    buttonGradient: {
        paddingVertical: 20,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 2, // More spacing for "GET STARTED"
        textTransform: 'uppercase',
    },
});