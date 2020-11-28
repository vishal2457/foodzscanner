/* global require */
import React, { Fragment, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { Form } from 'native-base';

import PrimeButton from '../../elements/PrimeButton';
import TextInput from '../../elements/TextInput';
import Text from '../../elements/Text';

import {
  btnWidth,
  btnHeight,
  inputHeight,
  marginHorizontal,
  spaceVertical,
  responsiveHeight,
  colors,
} from '../../styles/variables';
// import {getVendorID} from "../../utils/helpers"
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import Common from './Common';


function ChooseOption(props) {
    const [state, setState] = useState({
      OrderID: ""
      });
      const [formSubmitted, setformSubmitted] = useState(false)
  

  useEffect(() => {
    setformSubmitted(false);
    async function checkAuth() {
      let auth = await AsyncStorage.getItem("authentication");
      if(!auth) {
        props.navigation.navigate("LoginScreen")
      }
    }
    checkAuth();
  //   const backAction = () => {
  //     Alert.alert("", "Are you sure you want to exit?", [
  //       {
  //         text: "Cancel",
  //         onPress: () => null,
  //         style: "cancel"
  //       },
  //       { text: "YES", onPress: () => BackHandler.exitApp() }
  //     ]);
  //     return true;
  //   };
  // const backHandler = BackHandler.addEventListener(
  //   "hardwareBackPress",
  //   backAction
  // );

    

    return () =>{};
  
  }, [])
    
  
  
      
        const googleBtnSetting = {
          btnWidth: btnWidth.large,
          btnHeight: btnHeight,
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          style: {
          }
        };
    
          /**
       * Handle when click sign in button
       */
      const handleOnPress = async () => {
        setformSubmitted(true);
        if(!state.OrderID) return
        let vendorID = await AsyncStorage.getItem("@vendorID")
        console.log(vendorID, state.OrderID, "this is vendorID");
        api.post('/getorderdetail.php', {v_id: JSON.parse(vendorID), order_id: state.OrderID})
        .then(res => {
          console.log(res.data, "THIS IS RESPONSE");
          if(res.data.success) {
            props.navigation.navigate("Details", {orderDetail: res.data.data});
            setState({OrderID: ""})
            setformSubmitted(false)
          }else {
            ToastAndroid.show("No order id found !", ToastAndroid.LONG)
          }
        })
    
      }

      const openBarcode = () => {
          console.log(props, "this are props");
          props.navigation.navigate("Barcode")
      }
      return (
        <Fragment>
    { props.isLoading ? ( <View style={[styles.container, styles.loading]}>
            <ActivityIndicator />
          </View>) : (
     <View style={styles.container}>
       <Common navigation={props.navigation} />
     <Form style={styles.form}>
       <TextInput
         inputHeight={inputHeight}
         onChangeText={(orderID) => setState({OrderID: orderID})}
         value={state.OrderID}
         label='Enter ID'
       />
       {!state.OrderID && formSubmitted ? <Text red>This field is required.</Text> : (null) }
       
   
    
     </Form>
     <View style={styles.btnCont}>
        <PrimeButton
         navigation={props.navigation}
         setting={googleBtnSetting}
         btnText='Get Details'
         onPressButton={handleOnPress}
       />
       <Text style={styles.orText}> OR </Text>
        <PrimeButton
         navigation={props.navigation}
         setting={googleBtnSetting}
         btnText='Scan Code'
         onPressButton={openBarcode}
       />
     </View>
     
    </View>
    )}
        </Fragment>
       
      );
}


const styles = StyleSheet.create({
    container: {
      marginHorizontal: marginHorizontal.small,
    },
    form: {
      // paddingTop: spaceVertical.small,
      paddingBottom: responsiveHeight(4)
    },
    btnCont: {
      alignItems: 'center',
      paddingBottom: spaceVertical.semiSmall,
    },
    orText : {
        color: "#BBBBBB",
        fontSize: 30,
        paddingVertical: spaceVertical.normal
    }
  });
  

export default ChooseOption
