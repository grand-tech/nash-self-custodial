import React, {useEffect, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from '../../../app-redux-store/store';
import {AppColors} from '../../../ui_lib_configs/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button, Text} from 'react-native-ui-lib';
import {FONTS} from '../../../ui_lib_configs/fonts';
import Screen from '../../../app_components/Screen';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WalletHomeNavigationStackParamsList} from '../navigation/navigation.params.type';
import {generateActionSendFunds} from '../redux_store/action.generators';
import LoadingModalComponent from '../../../app_components/LoadingModalComponent';
import {
  generateActionSetLoading,
  generateActionSetEnterPIN,
} from '../../ui_state_manager/action.generators';
import SuccessModalComponent from '../../../app_components/SuccessModalComponent';
import EnterPinModal from '../../../app_components/EnterPinModal';
import {NashCache} from '../../../utils/cache';

/**
 * Contains the screen to enter user name.
 */
const ReviewSendTransaction: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const coinLabel = props.route.params.coin;
  const amount = props.route.params.amount;
  const [fiatAmount, setFiatAmount] = useState('-');

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // manipulate the header section after all animations are done
      props.navigation.getParent()?.setOptions({headerShown: false});
      props.navigation.setOptions({
        title: 'Send Funds',
        headerTransparent: true,
      });
    });
    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  useEffect(() => {
    if (props.rates) {
      let rate = props.rates?.KESUSD;
      if (coinLabel === 'cUSD') {
        rate = props.rates.KESUSD;
      }

      if (coinLabel === 'cEUR') {
        rate = props.rates.KESEUR;
      }

      if (coinLabel === 'cREAL') {
        rate = props.rates.KESBRL;
      }

      setFiatAmount(Number((amount / rate).toFixed(2)).toLocaleString());
    }
  });

  const [pin, setPin] = useState('');

  const onShowModal = () => {
    const params = props.route.params;
    props.dispatchSendFunds(params.coin, params.amount, params.address, pin);
  };

  const onSend = () => {
    const pinCache = NashCache.getPinCache();
    if (pinCache) {
      setPin(pinCache);
      props.dispatchSetLoading('Sending transaction ...', '');
    } else {
      props.dispatchRequestPIN();
    }
  };

  const onPinMatched = (p: string) => {
    setPin(p);
    props.dispatchSetLoading('Sending transaction ...', '');
  };

  const onPressOkay = () => {
    if (props.ui_state !== 'loading') {
      props.navigation.navigate('WalletHomeScreen');
    }
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <Text style={style.explanation}>I want to send:</Text>
        <View>
          <View style={style.div}>
            <Text style={style.amountLabel}>Amount</Text>
            <Text style={style.amountValue}>
              {props.route.params.amount} {props.route.params.coin}
            </Text>
          </View>
          <View style={style.div}>
            <Text />
            <Text style={style.amountFiatValue}>{fiatAmount} Ksh</Text>
          </View>
          <Text style={style.explanation}>To address:</Text>

          <Text style={style.amountValue}>{props.route.params.address}</Text>
        </View>
      </View>

      <Button
        label={'Send'}
        labelStyle={style.buttonLabel}
        secondary
        onPress={onSend}
        outline={true}
        outlineColor={AppColors.light_green}
      />

      <EnterPinModal
        visible={props.ui_state === 'enter_pin' && isFocused}
        onPinMatched={onPinMatched}
        target={'privateKey'}
      />

      <LoadingModalComponent
        TAG="ReviewSendTransaction"
        onShowModal={onShowModal}
        visible={props.ui_state === 'loading' && isFocused}
      />

      <SuccessModalComponent
        visible={props.ui_state === 'success' && isFocused}
        onPressOkay={onPressOkay}
      />
    </Screen>
  );
};

/**
 *
 * @param state the applications state.
 * @returns the props intended to be passed to the component from state variables.
 */
const mapStateToProps = (state: RootState) => ({
  ui_state: state.ui_state.status,
  rates: state.currency_conversion_rates.rates,
});

const mapDispatchToProps = {
  dispatchSendFunds: generateActionSendFunds,
  dispatchSetLoading: generateActionSetLoading,
  dispatchRequestPIN: generateActionSetEnterPIN,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WalletHomeNavigationStackParamsList,
  'ReviewSendTransaction'
>;

type Props = ReduxProps & StackProps;
export default connector(ReviewSendTransaction);

const style = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  reviewButton: {
    width: wp('80.0%'),
    marginTop: hp('30%'),
  },
  contentContainer: {
    height: hp('22%'),
    width: wp('70%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('3%'),
    backgroundColor: '#ffff',
    justifyContent: 'space-between',
    borderRadius: wp('5%'),
  },
  explanation: {
    ...FONTS.body1,
    color: AppColors.green,
    fontWeight: 'bold',
  },
  amountLabel: {
    ...FONTS.body1,
    color: AppColors.black,
  },
  amountValue: {
    ...FONTS.body1,
    color: AppColors.black,
  },
  amountFiatValue: {
    ...FONTS.body1,
    color: AppColors.brown,
  },
  buttonLabel: {
    ...FONTS.body1,
    fontWeight: '700',
  },
  div: {flexDirection: 'row', justifyContent: 'space-between'},
  screenContainer: {
    paddingTop: hp('10%'),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
