import React from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Text} from 'react-native-ui-lib';
import {RootState} from '../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';

const FeedLoaderComponent: React.FC<Props> = (_props: Props) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Lottie
          source={require('../../assets/lottie_animations/loading.json')}
          autoPlay={true}
          loop={true}
          style={styles.animation}
        />
        <Text style={styles.dialogText} h2>
          Loading ...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: hp('60%'),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 2,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.75,
    width: wp('100%'),
  },
});

const mapStateToProps = (_state: RootState) => ({});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {
  visible: boolean;
}

export default connector(FeedLoaderComponent);
