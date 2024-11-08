import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground } from 'react-native';

const AddTodoScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const {addTodo} = route.params

  const handleAddTodo = () => {
    if (title.trim() && desc.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        title,
        desc,
      }
      addTodo(newTodo)
      navigation.goBack(); 
    }
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://pub-static.fotor.com/assets/bg/ca5fa97f-7696-414b-bc87-9b5205b27575.jpg" }}
        style={styles.inputContainer}
        imageStyle={{ borderRadius: 8 }}
      >
        <Text style={styles.title}>Add Todo</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Todo Title"
          value={title}
          onChangeText={setTitle}
        />
         <TextInput
          style={styles.input}
          placeholder="Enter Todo Description"
          value={desc}
          onChangeText={setDesc}
        />
        <Button title="Add Todo" onPress={handleAddTodo} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
  },
  inputContainer: {
    padding: 16,
    justifyContent: 'center',
    height: 250,
    marginVertical: 50,
    borderRadius: 8, 
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color:"white",
    fontWeight:"bold"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
});

export default AddTodoScreen;
