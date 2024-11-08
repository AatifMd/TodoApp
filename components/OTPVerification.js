import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

function OTPVerification({ navigation, route }) {
  const [otp, setOtp] = useState('');
  const { email, isForgotPassword  } = route.params;

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://192.168.50.176:5000/api/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, isForgotPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isForgotPassword) {
          Alert.alert('Verification successful! Please Enter New Password.');
          navigation.navigate('ResetPassword', { email });
        }else {
          Alert.alert('Verification successful! Please Login.');
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error verifying OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the OTP sent to your email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={4}  
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTPVerification;
