import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    const tabs = [
        { name: 'HomeFeed', icon: '🏠', label: 'Home' },
        { name: 'TeamHub', icon: '🦸', label: 'Team' },
        { name: 'Train', icon: '⚡', label: 'Train', isCenter: true },
        { name: 'Compete', icon: '🏆', label: 'Compete' },
        { name: 'Profile', icon: '👤', label: 'Profile' },
    ];

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={styles.tabBar}>
                {tabs.map((tab, index) => {
                    const isFocused = state.index === state.routes.findIndex(r => r.name === tab.name);

                    if (tab.isCenter) {
                        return (
                            <CenterTrainButton
                                key={tab.name}
                                isFocused={isFocused}
                                onPress={() => navigation.navigate(tab.name)}
                            />
                        );
                    }

                    return (
                        <TabButton
                            key={tab.name}
                            tab={tab}
                            isFocused={isFocused}
                            onPress={() => navigation.navigate(tab.name)}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const TabButton = ({ tab, isFocused, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            style={styles.tab}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                    <Text style={[styles.icon, isFocused && styles.iconActive]}>
                        {tab.icon}
                    </Text>
                    {isFocused && <View style={styles.activeGlow} />}
                </View>
                <Text style={[styles.label, isFocused && styles.labelActive]}>
                    {tab.label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const CenterTrainButton = ({ isFocused, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const sparkles = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.85,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.1,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        // Trigger sparkle animation
        sparkles.forEach((sparkle, i) => {
            Animated.sequence([
                Animated.delay(i * 50),
                Animated.parallel([
                    Animated.timing(sparkle, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(sparkle, {
                        toValue: 0,
                        duration: 400,
                        delay: 200,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        });
    };

    return (
        <View style={styles.centerTabContainer}>
            {/* Sparkle particles */}
            {sparkles.map((sparkle, i) => {
                const angle = (i * 360) / 6;
                const translateX = sparkle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.cos((angle * Math.PI) / 180) * 30],
                });
                const translateY = sparkle.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.sin((angle * Math.PI) / 180) * 30],
                });

                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.sparkle,
                            {
                                opacity: sparkle,
                                transform: [{ translateX }, { translateY }],
                            },
                        ]}
                    >
                        <Text style={styles.sparkleText}>✨</Text>
                    </Animated.View>
                );
            })}

            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <LinearGradient
                        colors={isFocused ? ['#4ade80', '#22c55e'] : ['#8b5cf6', '#7c3aed']}
                        style={styles.centerButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.centerButtonInner}>
                            <Text style={styles.centerIcon}>⚡</Text>
                            <Text style={styles.centerLabel}>Train</Text>
                        </View>

                        {/* Glow effect */}
                        <View style={[styles.glowRing, isFocused && styles.glowRingActive]} />
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#1e293b',
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 4,
    },
    iconContainerActive: {
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
    icon: {
        fontSize: 24,
        opacity: 0.6,
    },
    iconActive: {
        opacity: 1,
    },
    activeGlow: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4ade80',
        opacity: 0.2,
    },
    label: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
    },
    labelActive: {
        color: '#4ade80',
        fontWeight: '700',
    },

    // Center Train Button
    centerTabContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 12,
    },
    centerButtonInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerIcon: {
        fontSize: 32,
    },
    centerLabel: {
        fontSize: 10,
        color: '#ffffff',
        fontWeight: 'bold',
        marginTop: 2,
    },
    glowRing: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    glowRingActive: {
        borderColor: 'rgba(74, 222, 128, 0.5)',
    },
    sparkle: {
        position: 'absolute',
    },
    sparkleText: {
        fontSize: 16,
    },
});
