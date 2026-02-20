import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import TabNavigator from './navigation/TabNavigator';
import { colors } from './styles';

const darkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
    },
};

export default function App() {
    return (
        <NavigationContainer theme={darkTheme}>
            <StatusBar style="light" />
            <TabNavigator />
            <Toast />
        </NavigationContainer>
    );
}
