import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './screens/StartScreen';

const Stack = createNativeStackNavigator();

export function OnBoardingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Start" component={StartScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}