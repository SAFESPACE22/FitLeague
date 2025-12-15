import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import AvatarSetupScreen from './screens/AvatarSetupScreen';
import FitnessBaselineScreen from './screens/FitnessBaselineScreen';
import TeamSelectionScreen from './screens/TeamSelectionScreen';
import CompletionScreen from './screens/CompletionScreen';
import HomeFeedScreen from './screens/HomeFeedScreen';
import TeamHubScreen from './screens/TeamHubScreen';
import TrainScreen from './screens/TrainScreen';
import CompeteScreen from './screens/CompeteScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import custom tab bar
import CustomTabBar from './components/CustomTabBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Onboarding Stack Navigator
function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0f172a' },
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AvatarSetup" component={AvatarSetupScreen} />
      <Stack.Screen name="FitnessBaseline" component={FitnessBaselineScreen} />
      <Stack.Screen name="TeamSelection" component={TeamSelectionScreen} />
      <Stack.Screen name="Completion" component={CompletionScreen} />
    </Stack.Navigator>
  );
}

// Main App Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeFeed" component={HomeFeedScreen} />
      <Tab.Screen name="TeamHub" component={TeamHubScreen} />
      <Tab.Screen name="Train" component={TrainScreen} />
      <Tab.Screen name="Compete" component={CompeteScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator
function RootNavigator() {
  // For development: show main tabs immediately
  // In production, you'd check AsyncStorage or user state
  const showMainApp = true; // Change to false to test onboarding

  return (
    <Stack.Navigator
      initialRouteName={showMainApp ? 'MainApp' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingStack} />
      <Stack.Screen name="MainApp" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
