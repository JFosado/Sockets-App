import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'; // Importa Alert desde 'react-native'
import WebSocket from 'react-native-websocket';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage desde la nueva ubicación
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { insertList } from '../api'; // Importa la función insertList desde el archivo api.js


const Card = ({ title, content }) => {


  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{content}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 30,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 5,  // For Android shadow
    width: '45%',
     // You can adjust the width based on your design needs
  },
  title: {
    fontSize: 48,
    marginBottom: 10,
    color:"#FF7C0C",
    textAlign:"center"
  },
  subtitle:{
    textAlign:"center"
  }
});

export default Card;