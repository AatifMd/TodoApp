import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './components/Home';
import AddTodo from './components/AddTodo';
import Login from './components/Login';
import Register from './components/Register';
import OTPVerification from './components/OTPVerification';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';

const Stack = createNativeStackNavigator()
  
const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => { 
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 

        if (token !== null) {
          setInitialRoute('Home'); 
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error("Failed to fetch the token:", error);
        setInitialRoute('Login'); 
      }
    };

    checkToken();
  }, []);
  if (initialRoute === null) {
    return null; 
  }
  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name='Register' component={Register}/>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='OTPVerification' component={OTPVerification}/>
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        <Stack.Screen name='ResetPassword' component={ResetPassword} />
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='AddTodo' component={AddTodo}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
