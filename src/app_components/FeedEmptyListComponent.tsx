import React from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Text} from 'react-native-ui-lib';
import {RootState} from '../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';

const FeedEmptyListComponent: React.FC<Props> = (_props: Props) => {
  return (
    <View style={styles.centeredView}>
      <Lottie
        source={require('../../assets/lottie_animations/empty.json')}
        autoPlay={true}
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.dialogText} h3>
        There are not transactions in this category at the moment.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    height: hp('40%'),
    alignSelf: 'center',
  },
  dialogText: {
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
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

export default connector(FeedEmptyListComponent);
