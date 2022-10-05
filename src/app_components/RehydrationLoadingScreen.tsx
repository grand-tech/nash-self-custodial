import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../app-redux-store/store';
import {AppColors} from '../ui_lib_configs/colors';
import Lottie from 'lottie-react-native';

let ScreenHeight = Dimensions.get('window').height;

export const RehydrationLoadingScreen = () => {
  return (
    <View style={style.container}>
      <Lottie
        source={require('../../assets/lottie_animations/rehydrate.json')}
        autoPlay
        loop
        style={style.animation}
      />
    </View>
  );
};

const mapStateToProps = (state: RootState) => ({
  onboarded: state.onboarding.status,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RehydrationLoadingScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppColors.gray,
    height: ScreenHeight,
  },
  animation: {
    height: 200,
  },
});
