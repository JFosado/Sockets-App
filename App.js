import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch,Alert,TouchableOpacity} from 'react-native';
import Card from './components/Card';
import SensorControl from './components/SensorControl';
import WebSocket from 'react-native-websocket';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage desde la nueva ubicación
import { insertList, getLists, deleteList} from './api'; // Importa la función insertList desde el archivo api.js



const App = () => {

	const [TemperaturaActual, setTemperaturaActual] = useState('0');
	const [LDR, setLDR] = useState(true);
	const [DistanciaObjeto, setDistanciaObjeto] = useState('0');
	
	const [lists, setLists] = useState([]);

	const handleData = (message) => {
		const data = JSON.parse(message.data);
		setTemperaturaActual(data.temperatura);
		setDistanciaObjeto(data.distancia)
		setLDR(data.light);

	};


	// Obtiene las listas de la API cuando el componente se monta
	useEffect(() => {
		fetchLists();
	}, []);

	// Función para obtener las listas desde la API
	const fetchLists = async () => {
		try {
			const response = await getLists();
			setLists(response); // Actualiza el estado con las listas obtenidas
			console.log(response);
		} catch (error) {
			console.error('Error al obtener las listas:', error);
		}
	};

	// Función para eliminar un elemento de la lista
	const handleDeleteListItem = async (code) => {
		try {
			// Mostrar alerta de confirmación antes de eliminar
			Alert.alert(
				'Confirmar eliminación',
				'¿Está seguro de que desea eliminar este elemento?',
				[
					{
						text: 'Cancelar',
						style: 'cancel',
					},
					{
						text: 'OK',
						onPress: async () => {
							await deleteList(code);
							// Después de eliminar, obtener las listas actualizadas
							fetchLists();
						},
					},
				],
				{ cancelable: false }
			);
		} catch (error) {
			console.error('Error al eliminar el elemento de la lista:', error);
		}
	};
	const onOpen = (event) => {
		console.log("Conexión WebSocket abierta");
	};

	const generarCodigoAleatorio = () => {
		return Math.floor(100000 + Math.random() * 9000); // Genera un número aleatorio de 4 dígitos
	};

	const guardarDatos = async () => {
		try {
			const codigo = generarCodigoAleatorio(); // Genera el código aleatorio
			const datosAGuardar = {
				code: codigo + "", 
				Ldr:LDR , 
				Temperature:TemperaturaActual,
				ObjectDistancie:DistanciaObjeto

			};

		

			// Enviar los datos a la base de datos a través de la API
			await insertList(datosAGuardar);
    
			await fetchLists();

			console.log('Datos guardados y enviados a la base de datos:', datosAGuardar);

			// Mostrar alerta de guardado exitoso
			Alert.alert('Guardado exitoso', 'Los datos se han guardado correctamente.');

		} catch (error) {
			console.error('Error al guardar los datos:', error);
			// Mostrar alerta de error si ocurre algún problema
			Alert.alert('Error', 'Ha ocurrido un error al intentar guardar los datos.');
		}


	};
	const backStyle = {
		backgroundColor: getBackgroundColor(LDR)
	};
  const titleStyle = {
		color: getTitleColor(LDR)
	};

	return (
		<View style={[styles.container, backStyle]}>

			<Text style={[styles.welcomeText,titleStyle]}>Bienvenido</Text>

			<View style={styles.containerCards}>
			<Card title={TemperaturaActual} content="Temperatura" />
			<Card title={Math.round(parseFloat(DistanciaObjeto))} content="Distancia" />
			</View>

			<View>
			<SensorControl/>
			</View>

			<View style={styles.sensorContainer}>
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
		{lists.map((item) => (
			<View key={item.code} style={styles.card}>
				<View style={styles.cardBody}>
					<Text style={styles.textItem}>Temperatura: {item.Temperature} °</Text>
					<Text style={styles.textItem}>Distancia: {item.ObjectDistancie}cm</Text>
					<Text style={styles.textItem}>Sensor de luz: {item.Ldr + ""}</Text>
				</View>
				<TouchableOpacity
					style={styles.buttonDelete}
					onPress={() => handleDeleteListItem(item.code)}>
					<Text style={styles.buttonText}>Eliminar</Text>
				</TouchableOpacity>
			</View>
		))}
	</ScrollView>
		</View>

		<View style={styles.buttonContainer}>
			<TouchableOpacity style={styles.button} onPress={guardarDatos}>
				<Text style={styles.buttonText}>Guardar</Text>
			</TouchableOpacity>
		</View>


		<WebSocket
			url="ws://192.168.137.107:80"
			onOpen={onOpen}
			onMessage={handleData}
			onError={(error) => console.log('Error de WebSocket:', error)}
			reconnect={true}
		/>
		</View>

	);
};

const styles = StyleSheet.create({
	container:{
		height:"100%",
		display:"flex",
		flexDirection:"column",
		paddingTop:60
	},
	sensorContainer:{
		height:"50%",
	},
	welcomeText:{
		textAlign:"left",
		fontSize:30,
		marginLeft:50,
	},
	containerCards: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,

},
buttonContainer:{
	position:'absolute',
	bottom:0,
	left:0,
	right:0,
	display:'flex',
	backgroundColor:"#F6F6F6",
	width:'100%',
	height:'10%',
	justifyContent:'center',
	alignItems:'center'

},
scrollViewContent: {
  flexGrow: 1,
  alignItems: 'center',
  paddingVertical: 20,

},
card: {
  width: '70%',
  backgroundColor: 'white',
  borderRadius: 20,
  marginBottom: 22,
  padding: 15,
  alignItems: 'center',
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.27,
  shadowRadius: 4.65,
  elevation: 6,
},
cardBody: {
  marginBottom: 10,
},
textItem: {
  fontSize: 14,
  marginBottom: 7,
  color: '#161D39',
  textAlign: 'center',
},
buttonDelete: {
  backgroundColor: '#FF7C0C',
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 20,
  alignItems: 'center',
  marginTop: 4,
},
buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},


button: {
	backgroundColor: '#FF7C0C',
	paddingVertical: 20,
	paddingHorizontal: 40,
	borderRadius: 20,
	alignItems: 'center',
	width:200,
	justifyContent:'center'
},
buttonText: {
	fontSize: 16,
	fontWeight: 'bold',
	color: '#FFF',
},
});


function getBackgroundColor(ldr) {
	if(ldr){
		return "#F6F6F6"; 
		}else{
			return "#161D39";
		}

	}
  function getTitleColor(ldr) {
    if(ldr){
      return "#000"; 
      }else{
        return "#fff";
      }
  
    }



export default App;
