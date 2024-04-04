//Chat.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const Chat = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [assistantId, setAssistantId] = useState(null);

  useEffect(() => {
    // Initialize thread here by making a request to your Node.js backend
    const initThread = async () => {
      try {
        const response = await axios.post('http://localhost:3000/create-thread');
        setThreadId(response.data.threadId);
        setAssistantId(response.data.assistantId);
      } catch (error) {
        console.error('Error initializing thread:', error);
      }
    };
    
    initThread();
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Display the user message
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: currentMessage }]);
    
    try {
      // Send the message to your Node.js backend
      const response = await axios.post('http://localhost:3000/send-message', {
        threadId,
        assistantId,
        message: currentMessage,
      });

      // Display the assistant's response
      response.data.messages.forEach((msg) => {
        if (msg.role === 'assistant') {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setCurrentMessage('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type your message..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '70%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    padding: 10,
  },
});

export default Chat;
