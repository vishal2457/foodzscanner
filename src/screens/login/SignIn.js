/* global require */
import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, BackHandler, Alert } from "react-native";
import { Form } from "native-base";
import PropTypes from "prop-types";

import PrimeButton from "../../elements/PrimeButton";
import TextInput from "../../elements/TextInput";
import Text from "../../elements/Text";

import {
  btnWidth,
  btnHeight,
  inputHeight,
  marginHorizontal,
  spaceVertical,
  responsiveHeight,
  colors,
} from "../../styles/variables";

function SignIn(props) {
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const [formSubmitted, setformSubmitted] = useState(true);

  useEffect(() => {
    setformSubmitted(false);
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [props.navigation]);

 

  const googleBtnSetting = {
    btnWidth: btnWidth.large,
    btnHeight: btnHeight,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    style: {},
  };

  /**
   * Handle when click sign in button
   */

  const { email, password } = form;

  const handleOnPressSignIn = (e) => {
    // console.log(props.navigation, "this are navigation props");
    e.preventDefault();
    setformSubmitted(true);
    if (!form.email || !form.password) return;

    props.onPressSignIn({ email, Password: password });
  };
  return (
    <Fragment>
      {props.isLoading ? (
        <View style={[styles.container, styles.loading]}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          <Form style={styles.form}>
            <TextInput
              inputHeight={inputHeight}
              onChangeText={(email) => setform({ ...form, email })}
              label="Username"
            />
            {!form.email && formSubmitted ? (
              <Text red>This field is required.</Text>
            ) : null}

            <TextInput
              inputHeight={inputHeight}
              onChangeText={(password) => setform({ ...form, password })}
              label="Password"
              secureTextEntry={true}
           />
            {!form.password && formSubmitted ? (
              <Text red>This field is required.</Text>
            ) : null}
          </Form>
          <View style={styles.btnCont}>
            <PrimeButton
              navigation={props.navigation}
              setting={googleBtnSetting}
              btnText="Login"
              onPressButton={handleOnPressSignIn}
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
    paddingBottom: responsiveHeight(4),
  },
  btnCont: {
    alignItems: "center",
    paddingBottom: spaceVertical.semiSmall,
  },
});

SignIn.propTypes = {
  navigation: PropTypes.any,
  onPressSignIn: PropTypes.any,
  onPressSignUp: PropTypes.any,
  onPressForgotPass: PropTypes.any,
  onPressFacebook: PropTypes.any,
  onPressGoogle: PropTypes.any,
  isLoading: PropTypes.bool,
};

export default SignIn;
