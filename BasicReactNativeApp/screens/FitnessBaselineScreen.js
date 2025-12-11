import React, { useState } from 'react';

import {

    View,

    Text,

    StyleSheet,

    TouchableOpacity,

    Dimensions,

} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Slider from '@react-native-community/slider';



const { width } = Dimensions.get('window');



const SKILL_LEVELS = [

    { level: 0, name: 'Beginner', xpMultiplier: 1.0, description: 'Just starting out' },

    { level: 1, name: 'Intermediate', xpMultiplier: 1.5, description: 'Regular workouts' },

    { level: 2, name: 'Advanced', xpMultiplier: 2.0, description: 'Experienced athlete' },

    { level: 3, name: 'Elite', xpMultiplier: 3.0, description: 'Peak performance' },

];



export default function FitnessBaselineScreen({ navigation, route }) {

    const [skillLevel, setSkillLevel] = useState(1);

    const { archetype } = route.params;



    const currentLevel = SKILL_LEVELS[skillLevel];



    const handleContinue = () => {

        navigation.navigate('TeamSelection', {

            archetype,

            skillLevel: currentLevel.name,

            xpMultiplier: currentLevel.xpMultiplier,

        });

    };



    return (

        <LinearGradient

            colors={['#1e293b', '#334155', '#475569']}

            style={styles.container}

        >

            <View style={styles.content}>



                <View style={styles.levelCard}>

                    <LinearGradient

                        colors={['#6366f1', '#8b5cf6']}

                        style={styles.levelCardGradient}

                        start={{ x: 0, y: 0 }}

                        end={{ x: 1, y: 1 }}

                    >

                        <Text style={styles.levelEmoji}>

                            {skillLevel === 0 ? '🌱' : skillLevel === 1 ? '💪' : skillLevel === 2 ? '🔥' : '⭐'}

                        </Text>

                        <Text style={styles.levelName}>{currentLevel.name}</Text>

                        <Text style={styles.levelDescription}>{currentLevel.description}</Text>



                        <View style={styles.xpContainer}>

                            <Text style={styles.xpLabel}>XP Multiplier</Text>

                            <Text style={styles.xpValue}>{currentLevel.xpMultiplier}x</Text>

                        </View>

                    </LinearGradient>

                </View>



                <View style={styles.sliderContainer}>

                    <Text style={styles.sliderLabel}>Adjust Your Level</Text>



                    <Slider

                        style={styles.slider}

                        minimumValue={0}

                        maximumValue={3}

                        step={1}

                        value={skillLevel}

                        onValueChange={setSkillLevel}

                        minimumTrackTintColor="#4ade80"

                        maximumTrackTintColor="rgba(255, 255, 255, 0.3)"

                        thumbTintColor="#4ade80"

                    />



                    <View style={styles.sliderLabels}>

                        {SKILL_LEVELS.map((level, index) => (

                            <Text

                                key={index}

                                style={[

                                    styles.sliderLabelText,

                                    skillLevel === index && styles.sliderLabelTextActive,

                                ]}

                            >

                                {level.name}

                            </Text>

                        ))}

                    </View>

                </View>



                <View style={styles.infoBox}>

                    <Text style={styles.infoTitle}>💡 What does this mean?</Text>

                    <Text style={styles.infoText}>

                        Higher levels earn more XP, but challenges are tougher.

                    </Text>

                </View>



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

                        <Text style={styles.continueButtonText}>Continue →</Text>

                    </LinearGradient>

                </TouchableOpacity>



                <View style={styles.progressIndicator}>

                    <View style={[styles.progressDot, styles.progressDotActive]} />

                    <View style={[styles.progressDot, styles.progressDotActive]} />

                    <View style={styles.progressDot} />

                    <View style={styles.progressDot} />

                </View>

            </View>

        </LinearGradient>

    );

}



const styles = StyleSheet.create({

    container: {

        flex: 1,

    },

    content: {

        flex: 1,

        paddingVertical: 60,

        paddingHorizontal: 20,

        justifyContent: 'space-between',

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

    },

    levelCard: {

        marginVertical: -10,

    },

    levelCardGradient: {

        padding: 40,

        borderRadius: 25,

        alignItems: 'center',

        shadowColor: '#000',

        shadowOffset: { width: 0, height: 8 },

        shadowOpacity: 0.4,

        shadowRadius: 12,

        elevation: 12,

    },

    levelEmoji: {

        fontSize: 80,

        marginBottom: 15,

    },

    levelName: {

        fontSize: 32,

        fontWeight: 'bold',

        color: '#ffffff',

        marginBottom: 8,

    },

    levelDescription: {

        fontSize: 16,

        color: '#e0e0e0',

        marginBottom: 20,

    },

    xpContainer: {

        backgroundColor: 'rgba(255, 255, 255, 0.2)',

        paddingVertical: 15,

        paddingHorizontal: 30,

        borderRadius: 20,

        marginTop: 10,

        borderWidth: 2,

        borderColor: 'rgba(255, 255, 255, 0.3)',

    },

    xpLabel: {

        fontSize: 14,

        color: '#ffffff',

        textAlign: 'center',

        marginBottom: 5,

    },

    xpValue: {

        fontSize: 36,

        fontWeight: 'bold',

        color: '#4ade80',

        textAlign: 'center',

    },

    sliderContainer: {

        marginVertical: 20,

    },

    sliderLabel: {

        fontSize: 18,

        color: '#ffffff',

        fontWeight: '600',

        marginBottom: 20,

        textAlign: 'center',

    },

    slider: {

        width: '100%',

        height: 40,

    },

    sliderLabels: {

        flexDirection: 'row',

        justifyContent: 'space-between',

        marginTop: 10,

        paddingHorizontal: 5,

    },

    sliderLabelText: {

        fontSize: 10,

        color: 'rgba(255, 255, 255, 0.5)',

        fontWeight: '600',

    },

    sliderLabelTextActive: {

        color: '#4ade80',

        fontSize: 11,

    },

    infoBox: {

        backgroundColor: 'rgba(79, 70, 229, 0.3)',

        padding: 20,

        borderRadius: 15,

        borderWidth: 1,

        borderColor: 'rgba(99, 102, 241, 0.5)',

        marginVertical: 20,

    },

    infoTitle: {

        fontSize: 16,

        fontWeight: 'bold',

        color: '#ffffff',

        marginBottom: 10,

    },

    infoText: {

        fontSize: 14,

        color: '#cbd5e1',

        lineHeight: 20,

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

        marginTop: 10,

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