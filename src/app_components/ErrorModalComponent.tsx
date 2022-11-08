import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Incubator, PanningProvider, Text} from 'react-native-ui-lib';
import {useEffect} from 'react';
import {AppColors} from '../ui_lib_configs/colors';
import {connect, ConnectedProps} from 'react-redux';
import {generateActionSetNormal} from '../features/ui_state_manager/action.generators';
import {RootState} from '../app-redux-store/store';

const ErrorModalComponent = (props: ErrorDialogProps) => {
  const [errorModalVisibility, setErrorModalVisibility] = useState(false);

  useEffect(() => {
    setErrorModalVisibility(props.visible);
  }, [props.visible]);

  const onRetry = () => {
    props.onRetry();
  };

  return (
    <Incubator.Dialog
      useSafeArea
      visible={errorModalVisibility}
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
          source={require('../../assets/lottie_animations/error.json')}
          autoPlay={true}
          loop={true}
          style={style.animation}
        />
        <Text style={style.dialogText} h2>
          Ooooh Snap!
        </Text>
        <Text style={style.dialogText} body3>
          {props.message}
        </Text>

        <View style={style.buttonDiv}>
          <Button
            label="Retry"
            backgroundColor={AppColors.yellow}
            onPress={() => onRetry()}
          />
          <Button
            label="Okay"
            backgroundColor={AppColors.light_green}
            onPress={() => props.dispatchActionSetNormal()}
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
    height: hp('8%'),
    alignSelf: 'center',
  },
  dialogText: {
    textAlign: 'center',
  },
  dialogContainerStyle: {
    justifyContent: 'space-around',
    height: hp('35%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('1.5%'),
  },
  buttonDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2.5%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  title: state.ui_state.title,
  message: state.ui_state.message,
  status: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchActionSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface ErrorDialogProps extends ReduxProps {
  onRetry: any;
  visible: boolean;
}

export default connector(ErrorModalComponent);
