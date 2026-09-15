import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import StudentsScreen from './StudentsScreen';
import AttendanceScreen from './AttendanceScreen';
import FeesScreen from './FeesScreen';
import MoreScreen from './MoreScreen';
import ExamsScreen from './ExamsScreen';
import TeachersScreen from './TeachersScreen';
import AcademicSetupScreen from './AcademicSetupScreen';
import InventoryScreen from './InventoryScreen';
import LibraryScreen from './LibraryScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const StudentsStack = createNativeStackNavigator();
const AttendanceStack = createNativeStackNavigator();
const FeesStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#16274A' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
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
// with everything else living behind the "More" overflow sheet.
function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={screenOptions}>
      <MoreStack.Screen name="MoreMain" component={MoreScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exams' }} />
      <MoreStack.Screen name="Teachers" component={TeachersScreen} options={{ title: 'Staff' }} />
      <MoreStack.Screen name="AcademicSetup" component={AcademicSetupScreen} options={{ title: 'Setup' }} />
      <MoreStack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory & Assets' }} />
      <MoreStack.Screen name="Library" component={LibraryScreen} options={{ title: 'Library' }} />
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
          tabBarActiveTintColor: '#16274A',
          tabBarInactiveTintColor: '#9AA3B5',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
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
