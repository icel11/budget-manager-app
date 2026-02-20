import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import LabelsScreen from '../screens/LabelsScreen';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        // Set a default icon to prevent errors and remove the need for `as any`
                        let iconName: React.ComponentProps<
                            typeof Ionicons
                        >['name'] = 'help-circle';

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'AddExpense') {
                            iconName = focused
                                ? 'add-circle'
                                : 'add-circle-outline';
                        } else if (route.name === 'Labels') {
                            iconName = focused ? 'list' : 'list-outline';
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="AddExpense" component={AddExpenseScreen} />
                <Tab.Screen name="Labels" component={LabelsScreen} />
            </Tab.Navigator>
            <Toast />
        </>
    );
}
