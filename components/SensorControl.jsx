import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import WebSocket from 'react-native-websocket';

const SensorControl = () => {
  const [ledEncendido, setLedEncendido] = useState(false);

  const toggleLed = () => {
    const message = ledEncendido ? 'apagar' : 'encender';
    
    ws.send(message);
    setLedEncendido(!ledEncendido);
    console.log(message);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Encender LED</Text>
      
      <TouchableOpacity style={styles.button} onPress={toggleLed}>
        <Image 
          source={require('../assets/cambiar.png')}  
          style={styles.icon}
        />
      </TouchableOpacity>

      <WebSocket
        url="ws://192.168.137.107:80"  // Asegúrate de que esta URL sea correcta
        onOpen={() => console.log('Conexión WebSocket abierta')}
        onError={(error) => console.log('Error de WebSocket:', error)}
        reconnect={true}
        ref={(ref) => { ws = ref; }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161D39',
    padding: 20,
    margin: 10,
    borderRadius: 30,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
    elevation: 5,  // For Android shadow
    width: '90%', // You can adjust the width based on your design needs
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color:"white",
    paddingLeft:40
  },
  icon:{
    height:50,
    width:50

  },
  button:{
    backgroundColor:"#FF7C0C",
    borderRadius:100
  }

});


export default SensorControl