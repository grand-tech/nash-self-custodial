import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppButtonProps} from '../../../app_components/DefaultButton';
import {Button} from 'react-native-ui-lib';

/**
 * Contains the onboarding UI.
 */
export const CreateAccountScreen = () => {
  return (
    <View style={style.container}>
      <AppButtonProps title="Create Account" onPress={() => {}} />
      <Button
        outline={true}
        outlineColor={AppColors.light_green}
        lable={'Create Account'}
        secondary></Button>
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
)(CreateAccountScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: AppColors.gray,
  },
  button: {
    backgroundColor: AppColors.light_green,
  },
});
