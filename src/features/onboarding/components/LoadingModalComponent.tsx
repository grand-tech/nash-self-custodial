import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Incubator, PanningProvider, Text} from 'react-native-ui-lib';
import {useEffect} from 'react';
import {generateActionSetNormal} from '../../ui_state_manager/action.generators';
import {RootState} from '../../../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';

const LoadingModalComponent: React.FC<Props> = (props: Props) => {
  const [errorModalVisibility, setErrorModalVisibility] = useState(false);

  useEffect(() => {
    setErrorModalVisibility(props.visible);
  }, [props.visible]);

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
          source={require('../../../../assets/lottie_animations/loading.json')}
          autoPlay={true}
          loop={true}
          style={style.animation}
        />
        <Text style={style.dialogText} h2>
          {props.title}
        </Text>
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
    height: hp('30%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  title: state.ui_state.title,
  message: state.ui_state.message,
});

const mapDispatchToProps = {
  dispatchActionSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {
  visible: boolean;
}

export default connector(LoadingModalComponent);
