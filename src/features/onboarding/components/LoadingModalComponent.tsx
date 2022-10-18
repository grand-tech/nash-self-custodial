import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Incubator, PanningProvider, Text} from 'react-native-ui-lib';
import {useEffect} from 'react';

/**
 * Error dialog props.
 */
interface LoadingDialogProps {
  visible: boolean;
  message: string;
}

const LoadingModalComponent = (props: LoadingDialogProps) => {
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
          {props.message}
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

export default LoadingModalComponent;
