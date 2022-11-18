import React from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Incubator, PanningProvider} from 'react-native-ui-lib';
import {AppColors} from '../ui_lib_configs/colors';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../app-redux-store/store';

const ComingSoonModalComponent = (props: DialogProps) => {
  return (
    <Incubator.Dialog
      useSafeArea
      visible={props.visible}
      bottom
      centerH
      centerV
      panDirection={PanningProvider.Directions.DOWN}
      headerProps={{
        showKnob: false,
        showDivider: false,
      }}
      containerStyle={{
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('1.5%'),
        width: wp('75%'),
      }}
      ignoreBackgroundPress={true}>
      {/* Dialog view container */}
      <View style={style.dialogContainerStyle}>
        <Lottie
          source={require('../../assets/lottie_animations/coming_soon.json')}
          autoPlay={true}
          loop={false}
          style={style.animation}
        />

        <View style={style.buttonDiv}>
          <Button
            label="Okay"
            backgroundColor={AppColors.light_green}
            onPress={() => props.onCloseModal()}
          />
        </View>
      </View>
    </Incubator.Dialog>
  );
};

const style = StyleSheet.create({
  modalButton: {
    alignSelf: 'flex-end',
  },
  animation: {
    height: hp('18%'),
    alignSelf: 'center',
  },
  dialogText: {
    textAlign: 'center',
  },
  dialogContainerStyle: {
    justifyContent: 'space-around',
    height: hp('30%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('1.5%'),
  },
  buttonDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2.5%'),
  },
});

const mapStateToProps = (_state: RootState) => ({});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Coming soon dialog props.
 */
interface DialogProps extends ReduxProps {
  onCloseModal: any;
  visible: boolean;
}

export default connector(ComingSoonModalComponent);
