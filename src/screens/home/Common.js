import { View } from 'native-base'
import Text from "../../elements/Text"
import React, {useEffect, useState} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fontSize, marginHorizontal, responsiveWidth, spaceVertical } from '../../styles/variables'
import { Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'


  function Common(props) {  

    useEffect(() => {
        async function checkAuth() {
            let authentication2 = await AsyncStorage.getItem("authentication")
            let authentication = JSON.parse(authentication2)
      if (!authentication) {
        AsyncStorage.setItem(
          "authentication",
          JSON.stringify({ isAuthenticated: false })
        );
  
        return   props.navigation.navigate("LoginScreen", {clearFields : true});
      } else if (!authentication.isAuthenticated) {
  
        return   props.navigation.navigate("LoginScreen", {clearFields : true});
      }
        }
        checkAuth()
    }, [])   
  
    const logoWidth = responsiveWidth(10.67);
    const logoHeight = logoWidth * 0.858;
    return (
       <View style={{flexDirection: "row", justifyContent: "space-between",   marginVertical: spaceVertical.normal}}>
           <Image 
              source={require('../../../assets/log.png')}
              style={{width: logoWidth, height: logoHeight, marginTop: marginHorizontal.small}}
           />
           <TouchableOpacity onPress={() => {
               AsyncStorage.removeItem("authentication")
               props.navigation.navigate("LoginScreen", {clearFields : true})}}><Text style={{fontSize: fontSize.medium, marginHorizontal: marginHorizontal.semiSmall, marginTop: marginHorizontal.semiSmall}}> Logout</Text></TouchableOpacity>
       </View>
    )
}

export default Common
