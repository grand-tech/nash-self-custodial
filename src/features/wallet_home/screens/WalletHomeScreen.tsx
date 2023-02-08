import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-ui-lib';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import {AppColors} from '../../../ui_lib_configs/colors';
import BottomMenu from '../components/BottomMenu';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {RootState} from '../../../app-redux-store/store';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {selectSavedPublicDEK} from '../../onboarding/redux_store/selectors';
import {generateActionSavePublicDataEncryptionKey} from '../../comment_encryption/redux_store/action.generators';
import {NashCache} from '../../../utils/cache';
import {initializeContractKit} from '../../account_balance/contract.kit.utils';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WalletHomeNavigationStackParamsList} from '../navigation/navigation.params.type';

const WalletHomeScreen: React.FC<Props> = (props: Props) => {
  const saved_public_dek = useSelector(selectSavedPublicDEK);

  const [totalBalanceFiat, setTotalBalanceFiat] = useState('-');
  const [cUSDFiatBalance, setCUSDFiatBalance] = useState('-');
  const [cEURFiatBalance, setCEURFiatBalance] = useState('-');
  const [cREALFiatBalance, setCREALFiatBalance] = useState('-');

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      props.navigation.getParent()?.setOptions({
        title: 'Home',
        headerTransparent: true,
        headerShown: true,
      });
    });

    return () => {};
  });

  useEffect(() => {
    const rates = props.currencyConversionRates.rates;
    let totalFiatBalance = 0;

    if (typeof props.cUSDBalance === 'number' && rates?.KESUSD) {
      const balance = props.cUSDBalance / rates?.KESUSD;
      setCUSDFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    if (typeof props.cRealBalance === 'number' && rates?.KESBRL) {
      const balance = props.cRealBalance / rates?.KESBRL;
      setCREALFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    if (typeof props.cEuroBalance === 'number' && rates?.KESEUR) {
      const balance = props.cEuroBalance / rates?.KESEUR;
      setCEURFiatBalance(Number(balance.toFixed(2)).toLocaleString());
      totalFiatBalance += balance;
    }

    setTotalBalanceFiat(Number(totalFiatBalance.toFixed(2)).toLocaleString());

    if (!saved_public_dek) {
      initializeContractKit();
      const pin = NashCache.getPinCache() ?? '202222';
      props.dispatchSaveDEK(pin);
    }
  }, [
    props,
    props.cEuroBalance,
    props.cRealBalance,
    props.cUSDBalance,
    props.currencyConversionRates,
    saved_public_dek,
  ]);

  return (
    <Screen style={style.screenContainer}>
      <View>
        <View
          style={{
            paddingHorizontal: wp('7%'),
          }}>
          <Text style={style.cUSD}>Total Balance</Text>
          <Text style={style.ksh}>Ksh {totalBalanceFiat}</Text>
        </View>
        <View style={style.rowContainer}>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cUSD{' '}
              {typeof props.cUSDBalance === 'number'
                ? props.cUSDBalance.toFixed(2)
                : props.cUSDBalance}
            </Text>
            <Text style={style.ksh}>Ksh {cUSDFiatBalance}</Text>
          </View>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cEUR{' '}
              {typeof props.cEuroBalance === 'number'
                ? props.cEuroBalance.toFixed(2)
                : props.cEuroBalance}
            </Text>
            <Text style={style.ksh}>Ksh {cEURFiatBalance}</Text>
          </View>
        </View>
        <View style={style.rowContainer}>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cREAL{' '}
              {typeof props.cRealBalance === 'number'
                ? props.cRealBalance.toFixed(2)
                : props.cRealBalance}
            </Text>
            <Text style={style.ksh}>Ksh {cREALFiatBalance}</Text>
          </View>
          {/* <View style={style.balance}>
            <Text style={style.cUSD}>
              CELO{' '}
              {typeof props.cGoldBalance === 'number'
                ? props.cGoldBalance.toFixed(2)
                : props.cGoldBalance}
            </Text>
            <Text style={style.ksh}>Ksh 1000</Text>
          </View> */}
        </View>
      </View>

      <BottomMenu />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('7%'),
    justifyContent: 'space-between',
    paddingBottom: hp('3%'),
  },
  hr: {flex: 1, height: 1, backgroundColor: AppColors.light_green},
  hrText: {
    width: 50,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    textAlign: 'left',
    alignContent: 'flex-start',
  },
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
  rowContainer: {flexDirection: 'row', justifyContent: 'space-around'},
});

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
  currencyConversionRates: state.currency_conversion_rates,
});

type NavigationProps = NativeStackScreenProps<
  WalletHomeNavigationStackParamsList,
  'WalletHomeScreen'
>;

const mapDispatchToProps = {
  dispatchSaveDEK: generateActionSavePublicDataEncryptionKey,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & NavigationProps;
export default connector(WalletHomeScreen);
