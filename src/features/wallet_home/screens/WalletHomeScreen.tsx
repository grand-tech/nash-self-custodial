import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-ui-lib';
import {StyleSheet, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import {AppColors} from '../../../ui_lib_configs/colors';
import BottomMenu from '../components/BottomMenu';
import {FONTS} from '../../../ui_lib_configs/fonts';
import {RootState} from '../../../app-redux-store/store';
import {connect, ConnectedProps} from 'react-redux';

const WalletHomeScreen: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();
  return (
    <Screen style={style.screenContainer}>
      <View>
        <View
          style={{
            paddingHorizontal: wp('7%'),
          }}>
          <Text style={style.cUSD}>Total Balance</Text>
          <Text style={style.ksh}>Ksh 1000</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cUSD{' '}
              {typeof props.cUSDBalance === 'number'
                ? props.cUSDBalance.toFixed(2)
                : props.cUSDBalance}
            </Text>
            <Text style={style.ksh}>Ksh 1000</Text>
          </View>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cEUR{' '}
              {typeof props.cEuroBalance === 'number'
                ? props.cEuroBalance.toFixed(2)
                : props.cEuroBalance}
            </Text>
            <Text style={style.ksh}>Ksh 1000</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              cREAL{' '}
              {typeof props.cRealBalance === 'number'
                ? props.cRealBalance.toFixed(2)
                : props.cRealBalance}
            </Text>
            <Text style={style.ksh}>Ksh 1000</Text>
          </View>
          <View style={style.balance}>
            <Text style={style.cUSD}>
              CELO{' '}
              {typeof props.cGoldBalance === 'number'
                ? props.cGoldBalance.toFixed(2)
                : props.cGoldBalance}
            </Text>
            <Text style={style.ksh}>Ksh 1000</Text>
          </View>
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
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;
export default connector(WalletHomeScreen);
