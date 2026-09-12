import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AcademicSetupScreen from '../screens/AcademicSetupScreen';
import StudentsScreen from '../screens/StudentsScreen';
import TeachersScreen from '../screens/TeachersScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import FeesScreen from '../screens/FeesScreen';
import ExamsScreen from '../screens/ExamsScreen';
import LibraryScreen from '../screens/LibraryScreen';
import InventoryScreen from '../screens/InventoryScreen';
import CommsScreen from '../screens/CommsScreen';
import ReportCardsScreen from '../screens/ReportCardsScreen';
import ParentPortalScreen from '../screens/ParentPortalScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#16274A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AcademicSetup" component={AcademicSetupScreen} options={{ title: 'Academic Setup' }} />
      <Stack.Screen name="Students" component={StudentsScreen} options={{ title: 'Students' }} />
      <Stack.Screen name="Teachers" component={TeachersScreen} options={{ title: 'Teachers' }} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance' }} />
      <Stack.Screen name="Fees" component={FeesScreen} options={{ title: 'Fees' }} />
      <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exams' }} />
      <Stack.Screen name="Library" component={LibraryScreen} options={{ title: 'Library' }} />
      <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
      <Stack.Screen name="Comms" component={CommsScreen} options={{ title: 'Comms / Messaging' }} />
      <Stack.Screen name="ReportCards" component={ReportCardsScreen} options={{ title: 'Report Cards' }} />
      <Stack.Screen name="ParentPortal" component={ParentPortalScreen} options={{ title: 'Parent Portal' }} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} options={{ title: 'AI Assistant' }} />
    </Stack.Navigator>
  );
}
