import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

function ResetPassword({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email } = route.params;

  const handleResetPassword = async () => {

    if (password !== confirmPassword) {
        Alert.alert('Passwords do not match');
        return;
      }
    try {
      const response = await fetch('http://192.168.50.176:5000/api/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text(); 
    console.log('Response Text:', text); 
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      Alert.alert('Error parsing response');
      return;
    }
      if (response.ok) {
        Alert.alert('Password reset successful. Please log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert(data.message || 'Error resetting password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error resetting password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your new password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <Button title="Reset Password" onPress={handleResetPassword} color="#007BFF" />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
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

export default ResetPassword;
