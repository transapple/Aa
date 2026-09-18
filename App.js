import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import StudentsScreen from './screens/StudentsScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import FeesScreen from './screens/FeesScreen';
import MoreScreen from './screens/MoreScreen';
import ExamsScreen from './screens/ExamsScreen';
import TeachersScreen from './screens/TeachersScreen';
import AcademicSetupScreen from './screens/AcademicSetupScreen';
import InventoryScreen from './screens/InventoryScreen';
import LibraryScreen from './screens/LibraryScreen';
import SchoolHealthScreen from './screens/SchoolHealthScreen';
import CommsScreen from './screens/CommsScreen';
import AioAiScreen from './screens/AioAiScreen';
import AccountScreen from './screens/AccountScreen';
import ContactScreen from './screens/ContactScreen';
import SettingsScreen from './screens/SettingsScreen';
import TrashScreen from './screens/TrashScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const StudentsStack = createNativeStackNavigator();
const AttendanceStack = createNativeStackNavigator();
const FeesStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#4338CA' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
  );
}

function StudentsStackScreen() {
  return (
    <StudentsStack.Navigator screenOptions={screenOptions}>
      <StudentsStack.Screen name="StudentsMain" component={StudentsScreen} options={{ title: 'Students' }} />
    </StudentsStack.Navigator>
  );
}

function AttendanceStackScreen() {
  return (
    <AttendanceStack.Navigator screenOptions={screenOptions}>
      <AttendanceStack.Screen name="AttendanceMain" component={AttendanceScreen} options={{ title: 'Attendance' }} />
    </AttendanceStack.Navigator>
  );
}

function FeesStackScreen() {
  return (
    <FeesStack.Navigator screenOptions={screenOptions}>
      <FeesStack.Screen name="FeesMain" component={FeesScreen} options={{ title: 'Fees' }} />
    </FeesStack.Navigator>
  );
}

// "More" holds every module that doesn't get its own bottom tab, matching
// the web app's BOTTOMNAV_PRIMARY_IDS (dashboard, students, attendance, fees)
// with everything else living behind the "More" overflow sheet — this now
// covers the full web NAV list: AiO ai, Exams, Staff, Setup, Inventory,
// Library, School Health, Comms, Account, Contact, Settings, Trash.
function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={screenOptions}>
      <MoreStack.Screen name="MoreMain" component={MoreScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="AioAi" component={AioAiScreen} options={{ title: 'AiO ai' }} />
      <MoreStack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exams' }} />
      <MoreStack.Screen name="Teachers" component={TeachersScreen} options={{ title: 'Staff' }} />
      <MoreStack.Screen name="AcademicSetup" component={AcademicSetupScreen} options={{ title: 'Setup' }} />
      <MoreStack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory & Assets' }} />
      <MoreStack.Screen name="Library" component={LibraryScreen} options={{ title: 'Library' }} />
      <MoreStack.Screen name="SchoolHealth" component={SchoolHealthScreen} options={{ title: 'School Health' }} />
      <MoreStack.Screen name="Comms" component={CommsScreen} options={{ title: 'Comms' }} />
      <MoreStack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
      <MoreStack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact TransApple' }} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <MoreStack.Screen name="Trash" component={TrashScreen} options={{ title: 'Trash' }} />
    </MoreStack.Navigator>
  );
}

const TAB_ICONS = {
  Home: 'home',
  Students: 'people',
  Attendance: 'checkmark-done',
  Fees: 'cash',
  More: 'menu',
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1472D9',
          tabBarInactiveTintColor: '#7890AA',
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E4EDF5', borderTopWidth: 1, height: 70, paddingBottom: 8, paddingTop: 7, elevation: 0 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={TAB_ICONS[route.name]} size={focused ? size + 1 : size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Students" component={StudentsStackScreen} />
        <Tab.Screen name="Attendance" component={AttendanceStackScreen} />
        <Tab.Screen name="Fees" component={FeesStackScreen} />
        <Tab.Screen name="More" component={MoreStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
