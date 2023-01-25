import React, {useEffect, useState} from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Pressable, StyleSheet, ToastAndroid, View} from 'react-native';
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
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustomDrawerContent = (props: Props) => {
  const [totalBalanceFiat, setTotalBalanceFiat] = useState('-');
  const [totalBalanceUSD, setTotalBalanceUSD] = useState('-');
  // const [cUSDFiatBalance, setCUSDFiatBalance] = useState('-');
  // const [cEURFiatBalance, setCEURFiatBalance] = useState('-');
  // const [cREALFiatBalance, setCREALFiatBalance] = useState('-');

  useEffect(() => {
    const rates = props.currencyConversionRates;
    let totalFiatBalance = 0;

    if (typeof props.cUSDBalance === 'number' && rates?.KESUSD) {
      const balance = props.cUSDBalance / rates?.KESUSD;
      // setCUSDFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    if (typeof props.cRealBalance === 'number' && rates?.KESBRL) {
      const balance = props.cRealBalance / rates?.KESBRL;
      // setCREALFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    if (typeof props.cEuroBalance === 'number' && rates?.KESEUR) {
      const balance = props.cEuroBalance / rates?.KESEUR;
      // setCEURFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    setTotalBalanceFiat(Number(totalFiatBalance.toFixed(2)).toLocaleString());

    if (rates?.KESUSD) {
      setTotalBalanceUSD(
        Number((totalFiatBalance * rates?.KESUSD).toFixed(2)).toLocaleString(),
      );
    }
  }, [
    props.cEuroBalance,
    props.cRealBalance,
    props.cUSDBalance,
    props.currencyConversionRates,
  ]);

  return (
    <View style={[styles.container]}>
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
              <Text style={styles.cUSD}>USD {totalBalanceUSD}</Text>
              <Text style={styles.ksh}>Ksh {totalBalanceFiat}</Text>
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

      <Pressable
        onPress={() => {
          Clipboard.setString(props.publicAddress);
          ToastAndroid.showWithGravity(
            'Copied public address.',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        }}>
        <View style={styles.publicAddressView}>
          <Icon
            name="copy"
            color={AppColors.green}
            size={20}
            style={styles.copyIcon}
          />
          <Text body4 style={styles.publicAddress} numberOfLines={1}>
            {props.publicAddress}
          </Text>
        </View>
      </Pressable>

      <Text style={styles.versionNumber}>Version 0.0.1-dev</Text>
    </View>
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
  currencyConversionRates: state.currency_conversion_rates.rates,
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
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  publicAddressView: {
    backgroundColor: '#ffff',
    width: wp('60%'),
    alignContent: 'center',
    padding: wp('3.5%'),
    flexDirection: 'row',
    borderRadius: wp('2%'),
    marginBottom: hp('10%'),
    marginHorizontal: wp('2%'),
  },
  publicAddress: {
    textAlign: 'center',
    color: AppColors.green,
  },
  copyIcon: {
    paddingRight: wp('3%'),
    paddingLeft: wp('1%'),
  },
  versionNumber: {
    alignSelf: 'flex-end',
    marginRight: wp('5%'),
    marginBottom: hp('2%'),
  },
});
