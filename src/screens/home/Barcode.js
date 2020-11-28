import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, BackHandler, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Barcode(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

      const backAction = () => {
        props.navigation.push('ChooseOption', {goBack: true});
      }
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
    }, []);
  
    const handleBarCodeScanned = async ({ type, data }) => {
      setScanned(true);
      let vendorID = await AsyncStorage.getItem("@vendorID")
      console.log(vendorID, "this is vendorID");
      api.post('/getorderdetail.php', {v_id: JSON.parse(vendorID), order_id: data})
      .then(res => {
        console.log(res.data, "THIS IS RESPONSE");
        if(res.data.success) {
          props.navigation.navigate("Details", {orderDetail: res.data.data});
          setState({OrderID: ""})
        }else {
          ToastAndroid.show("Invalid Barcode", ToastAndroid.LONG);
        }
      })   
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 0.5,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 7
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 0.5,
    backgroundColor: opacity
  },
});
  
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={[StyleSheet.absoluteFillObject, styles.container]}
        >
               <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
        </BarCodeScanner>
  
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
    );



}

export default Barcode
