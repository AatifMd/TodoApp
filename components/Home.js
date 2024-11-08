import React, {useState, useEffect} from 'react';
import {View,FlatList,Text,StyleSheet,TouchableOpacity,Alert} from 'react-native';
import TodoItem from './TodoItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = ({navigation}) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);
  const loadTodos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.50.176:5000/api/todo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Failed to load todos: ${response.statusText}`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log('Failed to load todos', error);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.50.176:5000/api/todo/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo.title, desc: newTodo.desc }),
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const data = await response.json();
      console.log('Todo added:', data);
      setTodos(preTodos => [...preTodos, data]);
    } catch (error) {
      console.error("Error in adding todo:", error); 
    }
  };
  const deleteTodo = async todoId => {
    console.log("request to delete : ",todoId)
    try {
      Alert.alert(
        "Confirm Deletion",
        "Do you want to delete this Todo?",
        [
          { text: 'Cancel', style: 'cancel' }, 
          { 
            text: 'OK', 
            onPress: async () => {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(
                `http://192.168.50.176:5000/api/todo/${todoId}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
  
              if (response.ok) {
                const data = await response.json(); 
                console.log('Response from server:', data); 
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId)); 
                console.log('Todo deleted successfully');
              } else {
                throw new Error('Failed to delete todo');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.log('Failed to delete todo', error);
      Alert.alert('Error', 'Something went wrong while deleting the todo');
    }
  };
  
  const toggleComplete = async (todoId) => {
    const todoToUpdate = todos.find((todo) => todo._id === todoId);
    const updatedData = { completed: !todoToUpdate.completed };
    console.log("Todo ID being passed:", todoId);
  
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `http://192.168.50.176:5000/api/todo/${todoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error('Failed to toggle complete');
      const updatedTodo = await response.json(); 
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === todoId ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (error) {
      console.log('Failed to toggle complete', error);
    }
  };
  

  const editTodo = async (todoId, newTitle, newDesc, completed) => {
    const updatedData = {title: newTitle, desc: newDesc, completed};
    console.log(updatedData)
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      const response = await fetch(
        `http://192.168.50.176:5000/api/todo/${todoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        },
      );
      if (!response.ok) throw new Error('Failed to edit todo');
      
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData); 
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo._id === todoId ? {...todo, title: newTitle, desc: newDesc,  completed} : todo,
        ),
      );
    } catch (error) {
      console.log('Failed to edit todo', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: logout},
    ]);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}], 
      });
    } catch (error) {
      console.log('Failed to log out', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <FlatList
        data={todos}
        renderItem={({item}) => (
          <TodoItem
            todo={item}
            onDelete={() => deleteTodo(item._id)}
            onToggleComplete={() => toggleComplete(item._id)}
            onEdit={(id, newTitle, newDesc, completed) => editTodo(id, newTitle, newDesc, completed)}
          />
        )}
        keyExtractor={item => item._id}
      />
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => navigation.navigate('AddTodo', {addTodo})}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  addIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'red',
    padding: 7,
    borderRadius: 5,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
