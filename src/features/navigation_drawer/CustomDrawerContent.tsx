import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {StyleSheet, View} from 'react-native';
import Screen from '../../app_components/Screen';
import {Text} from 'react-native-ui-lib';
import Lottie from 'lottie-react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../app-redux-store/store';
import {generateActionCompletedOnboarding} from '../onboarding/redux_store/action.generators';
import {AppColors} from '../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FONTS} from '../../ui_lib_configs/fonts';
import Identicon from 'react-native-identicon';

const CustomDrawerContent = (props: Props) => {
  return (
    <Screen>
      <View>
        <View
          style={{
            paddingLeft: wp('5%'),
            paddingTop: hp('2%'),
          }}>
          <Identicon value={props.publicAddress + props.name} size={32} />
          <Text style={styles.text}>{props.name}</Text>
        </View>

        <View style={styles.balance}>
          {props.cUSDBalance !== '-' ? (
            <View>
              <Text style={styles.text}>Current Balance</Text>
              <Text style={styles.cUSD}>cUSD {props.cUSDBalance}</Text>
              <Text style={styles.ksh}>Ksh {props.cUSDBalance}</Text>
            </View>
          ) : (
            <View style={styles.loadingDiv}>
              <Lottie
                source={require('../../../assets/lottie_animations/loading.json')}
                autoPlay={true}
                loop={true}
                style={styles.animation}
              />
              <Text style={styles.loadingMessage}>Loading ..</Text>
            </View>
          )}
        </View>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Text>Version 0.0.1-dev</Text>
    </Screen>
  );
};

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  name: state.onboarding.user_name,
  publicAddress: state.onboarding.publicAddress,
  cUSDBalance: state.wallet_balance.cUSD,
  cEuroBalance: state.wallet_balance.cEUR,
  cRealBalance: state.wallet_balance.cREAL,
  cGoldBalance: state.wallet_balance.CELO,
});

const mapDispatchToProps = {
  completeOnboarding: generateActionCompletedOnboarding,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = DrawerContentComponentProps & ReduxProps;
export default connector(CustomDrawerContent);

const styles = StyleSheet.create({
  balance: {
    marginRight: wp('2%'),
    height: 101,
    marginLeft: wp('2%'),
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
    borderRadius: 14,
    backgroundColor: '#ffff',
    padding: 13,
    justifyContent: 'space-between',
    alignContent: 'center',
    textAlign: 'center',
    shadowColor: AppColors.gray,
    shadowOffset: {width: 10, height: 2.5},
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 100,
  },
  ksh: {
    ...FONTS.body4,
    color: AppColors.light_green,
    fontWeight: 'bold',
    margin: 2,
  },
  cUSD: {
    ...FONTS.h2,
    color: AppColors.light_green,
    fontWeight: 'bold',
    marginTop: 2,
  },
  text: {
    ...FONTS.body2,
    fontWeight: 'bold',
  },
  loadingMessage: {
    ...FONTS.body4,
    marginTop: 2,
    marginBottom: 10,
  },
  loadingDiv: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  animation: {
    height: hp('4%'),
    alignSelf: 'center',
  },
});
