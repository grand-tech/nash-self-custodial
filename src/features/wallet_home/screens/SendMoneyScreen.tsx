import React from 'react';
import {InteractionManager, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Screen from '../../../app_components/Screen';
import {AppColors} from '../../../ui_lib_configs/colors';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {WalletHomeNavigationStackParamsList} from '../navigation/navigation.params.type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {StableToken} from '@celo/contractkit';
import EnterAmountComponent from '../../../app_components/EnterAmountComponent';

// TODO: Re-use enter amount component.
const SendMoneyScreen: React.FC<Props> = (props: Props) => {
  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      props.navigation.getParent()?.setOptions({headerShown: false});
      props.navigation.setOptions({
        title: 'Enter Amount',
        headerTransparent: true,
      });
    });

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const onSubmit = (amount: string, coin: StableToken) => {
    props.navigation.navigate('ReviewSendTransaction', {
      address: props.route.params.address,
      amount: Number(amount),
      coin: coin,
    });
  };

  return (
    <Screen style={style.screenContainer}>
      <EnterAmountComponent onSubmit={onSubmit} submitButtonLabel={'Review'} />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  keyPadContainer: {
    paddingTop: hp('5%'),
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: wp('10%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('3%'),
    width: wp('30%'),
    borderRadius: wp('1%'),
    borderColor: AppColors.light_green,
    borderWidth: 1,
    paddingHorizontal: wp('1%'),
    backgroundColor: '#fff',
  },
  reviewButton: {},
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: AppColors.light_green,
  },
  amountDisplayGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  cUSDBalance: state.wallet_balance.cUSD,
  cEuroBalance: state.wallet_balance.cEUR,
  cRealBalance: state.wallet_balance.cREAL,
  cGoldBalance: state.wallet_balance.CELO,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WalletHomeNavigationStackParamsList,
  'SendMoney'
>;

type Props = ReduxProps & StackProps;
export default connector(SendMoneyScreen);
