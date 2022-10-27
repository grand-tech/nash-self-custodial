import React from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import Lottie from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Text} from 'react-native-ui-lib';
import {RootState} from '../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';

const LoadingModalComponent: React.FC<Props> = (props: Props) => {
  const onShow = () => {
    props.onShowModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onShow={onShow}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Lottie
            source={require('../../assets/lottie_animations/loading.json')}
            autoPlay={true}
            loop={true}
            style={styles.animation}
          />
          <Text style={styles.dialogText} h2>
            {props.title}
          </Text>
        </View>
      </View>
    </Modal>
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
    height: hp('30%'),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    height: hp('100%'),
    width: wp('100%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  title: state.ui_state.title,
  message: state.ui_state.message,
  status: state.ui_state.status,
});

const mapDispatchToProps = {
  // dispatchActionSetNormal: generateActionSetNormal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

/**
 * Error dialog props.
 */
interface Props extends ReduxProps {
  visible: boolean;
  onShowModal: any;
}

export default connector(LoadingModalComponent);
