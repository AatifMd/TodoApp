import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';  // Updated import
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/FontAwesome';

const TodoItem = ({ todo, onDelete, onToggleComplete, onEdit }) => {
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newDesc, setNewDesc] = useState(todo.desc);

  const handleSave = () => {
    if (newTitle && newDesc) {
      onEdit(todo._id, newTitle, newDesc, todo.completed); 
      setEditFormVisible(false);
    } else {
      Alert.alert('Error', 'Title and description are required');
    }
  };

  return (
    <View style={styles.todoItem}>
      <CheckBox
        value={todo.completed}
        onValueChange={() => onToggleComplete(todo._id)}
        style={styles.checkbox}
      />

      <Text style={[styles.title, todo.completed && styles.completed]}>
        {todo.title}
      </Text>

      <TouchableOpacity onPress={() => setEditFormVisible(true)} style={styles.iconButton}>
        <Icons name="edit" size={24} color="green" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(todo._id)} style={styles.iconButton}>
        <MaterialCommunityIcons name="delete" size={24} color="red" />
      </TouchableOpacity>

      <Modal
        visible={editFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditFormVisible(false)} 
      >
        <View style={styles.overlay}>
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              placeholder="Edit Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Description"
              value={newDesc}
              onChangeText={setNewDesc}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setEditFormVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: "#E8E8E8",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: "#000000",
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  checkbox: {
    marginRight: 10,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  editForm: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TodoItem;
