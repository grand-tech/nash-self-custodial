import React, {useLayoutEffect} from 'react';
import {StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {Text} from 'react-native-ui-lib';
import {Screen} from 'react-native-screens';
import {generateActionLogout} from '../../../app-redux-store/global_redux_actions/action.generators';

/**
 * Screen displayed when the user is logging out.
 * @returns logging out loader.
 */
export function LogOutScreen() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(generateActionLogout());
  }, []);

  return (
    <Screen>
      {/* <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> */}
      <Lottie
        source={require('../../../../assets/lottie_animations/loading.json')}
        autoPlay={true}
        loop={true}
        style={style.animation}
      />
      <Text style={style.dialogText} h2>
        Logging out ...
      </Text>
      {/* </View> */}
    </Screen>
  );
}

const style = StyleSheet.create({
  modalButton: {
    alignSelf: 'flex-end',
  },
  animation: {
    height: hp('8%'),
    alignSelf: 'center',
  },
  dialogText: {
    textAlign: 'center',
  },
  dialogContainerStyle: {
    justifyContent: 'space-around',
    height: hp('30%'),
  },
});
