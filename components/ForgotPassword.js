import React, { useState } from 'react'
import { Text, View, TextInput,StyleSheet, Button, Alert } from 'react-native'

function ForgotPassword({navigation}) {
    const [email, setEmail] = useState('')

    const handleForgotpassword = async () => {
      try {
        const response = await fetch('http://192.168.50.176:5000/api/forgotpassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
    
        const data = await response.json();
        
        console.log(data); 
    
    
        if (response.ok) {
          Alert.alert('OTP sent to your email');
          navigation.navigate('OTPVerification', { email, isForgotPassword: true  });
        } else {
          Alert.alert('Failed to Reset Password failed');
        }
      } catch (error) {
        Alert.alert('Error in Reset Password. Please try again.');
      }
    };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Find Your Account</Text>
        <Text style={styles.text}>Please Enter Your Email</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
        />
        <Button
            title='Submit'
            onPress={handleForgotpassword}
        />
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    text : {
        fontSize: 16,
      marginBottom: 20,

    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 8,
    },
  });

export default ForgotPassword