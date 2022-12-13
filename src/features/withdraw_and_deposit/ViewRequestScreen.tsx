import React, {useEffect, useState} from 'react';
import Screen from '../../app_components/Screen';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {Button, Text} from 'react-native-ui-lib';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {AppColors} from '../../ui_lib_configs/colors';
import {FONTS} from '../../ui_lib_configs/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootState} from '../../app-redux-store/store';
import {
  generateActionSetEnterPIN,
  generateActionSetLoading,
  generateActionSetNormal,
} from '../ui_state_manager/action.generators';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {NashCache} from '../../utils/cache';
import EnterPinModal from '../../app_components/EnterPinModal';
import LoadingModalComponent from '../../app_components/LoadingModalComponent';
import SuccessModalComponent from '../../app_components/SuccessModalComponent';
import {
  generateActionApproveTransaction,
  generateActionCancelTransaction,
} from './redux_store/action.generators';
import ErrorModalComponent from '../../app_components/ErrorModalComponent';
import {selectPublicAddress} from '../onboarding/redux_store/selectors';
import {
  constructEscrowCommentObject,
  EscrowTxComment,
  nashDecryptComment,
} from '../comment_encryption/sagas/comment.encryption.utils';
import {NextUserAction} from './transaction.user.actions.enum';
const ViewRequestScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const transaction = props.route.params.transaction;
  const rates = props.rates;
  const [amountFiat, setAmountFiat] = useState('-');
  const [feesFiat, setFeesFiat] = useState('-');
  const myAddress = useSelector(selectPublicAddress);
  const paymentInfo: EscrowTxComment = {
    mpesaNumber: '',
    payBill: '',
    accountNumber: '',
    paymentName: '',
  };
  const [nextUserAction, setNextUserAction] = useState(NextUserAction.NONE);
  const [paymentDetails, setPaymentDetails] = useState(paymentInfo);
  const [transactionStatus, setTransactionStatus] = useState('-');

  /**
   * Process transaction status.
   */
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let status = '';
      switch (transaction.status) {
        case 0:
          status = 'Awaiting Agent';
          setNextUserAction(NextUserAction.CANCEL);
          break;
        case 1:
          if (
            transaction.agentApproval &&
            transaction.agentAddress === myAddress
          ) {
            status = 'Awaiting Client Approval';
            setNextUserAction(NextUserAction.NONE);
          } else if (
            transaction.clientApproval &&
            transaction.clientAddress === myAddress
          ) {
            status = 'Awaiting Agent Approval';
            setNextUserAction(NextUserAction.NONE);
          } else {
            status = 'Awaiting Your Approval';
            if (transaction.agentAddress === myAddress) {
              setNextUserAction(NextUserAction.APPROVE);
            } else if (transaction.clientAddress === myAddress) {
              setNextUserAction(NextUserAction.APPROVE);
            }
          }
          break;
        case 3:
          status = 'Confirmed';
          break;
        default:
          status = 'Completed';
          break;
      }

      setTransactionStatus(status);
    });
  }, [myAddress, rates, transaction]);

  /**
   * Handle the activity header.
   */
  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let title = 'Withdraw Request';
      if (transaction.txType === 'DEPOSIT') {
        title = 'Deposit Request';
      }
      props.navigation.getParent()?.setOptions({headerShown: false});
      props.navigation.setOptions({
        title: title,
        headerTransparent: true,
      });
    });
  });

  /**
   * Handle currency coversion.
   */
  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let amount = 0;
      let fees = 0;

      if (rates?.KESUSD) {
        amount = transaction.netAmount / rates?.KESUSD;
      }

      if (rates?.KESUSD) {
        fees = transaction.agentFee / rates?.KESUSD;
      }

      setAmountFiat(Number(amount.toFixed(2)).toLocaleString());
      setFeesFiat(Number(fees.toFixed(2)).toLocaleString());
    });
  });

  /**
   * Handle comment decryption.
   */
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let comment = '';

      let privateKey = '';

      if (myAddress === '0xFf1A74330dd9e899E5a857E251F8880554F6A260') {
        privateKey =
          '99107ec34ccba22db14b416f73d26edb1db7c90ccca10de8d25e11a592391aa6';
      } else {
        privateKey =
          '59f8b7c417f05597e6b0e555629b1a2ca4ffdbd5f5253529e33c98f3fea4e032';
      }

      if (myAddress === transaction.agentAddress) {
        // TODO: Figure out where and how to get the private key.
        const plainText = nashDecryptComment(
          transaction.clientPaymentDetails,
          privateKey,
          false,
        );

        if (plainText.success) {
          comment = plainText.comment;
        }
      }

      if (myAddress === transaction.clientAddress) {
        const plainText = nashDecryptComment(
          transaction.agentPaymentDetails,
          privateKey,
          true,
        );

        if (plainText.success) {
          comment = plainText.comment;
        }
      }

      setPaymentDetails(constructEscrowCommentObject(comment));
    });
  }, [transaction]);

  /**
   * Display loading modal or prompt user for PIN.
   */
  const sendRequest = () => {
    if (
      NashCache.getPinCache() !== null &&
      NashCache.getPinCache()?.trim() !== ''
    ) {
      props.dispatchActionSetLoading(
        'Accepting request ...',
        '',
        'Send Request',
      );
    } else {
      props.promptForPIN();
    }
  };

  const onPinMatched = async (p: string) => {
    NashCache.setPinCache(p);
    props.dispatchActionSetLoading('Accepting request ...', '');
  };

  const onShowLoadingModal = () => {
    if (isFocused) {
      if (nextUserAction === NextUserAction.APPROVE) {
        // dispatch approval action
        props.dispatchApproval(transaction, NashCache.getPinCache() ?? '');
      } else if (nextUserAction === NextUserAction.CANCEL) {
        // dispatch agent approve action
        props.dispatchCancelation(transaction, NashCache.getPinCache() ?? '');
      }
    }
  };

  const onPressOkay = () => {
    props.navigation.goBack();
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <View>
          <View style={style.div}>
            <Text h2>Amount</Text>

            <Text h2>
              {Number(transaction.netAmount.toFixed(2)).toLocaleString()} cUSD
            </Text>
          </View>
          <View style={style.div}>
            <Text h2 />
            <Text h2>{amountFiat} Ksh</Text>
          </View>
          <View style={style.div}>
            <Text body1>Profit</Text>
            <Text body1>
              {Number(transaction.agentFee.toFixed(2)).toLocaleString()} cUSD
            </Text>
          </View>
          <View style={style.div}>
            <Text body1 />
            <Text body1>{feesFiat} Ksh</Text>
          </View>
        </View>

        <View style={style.paymentDetails}>
          <Text
            h2
            style={{
              alignSelf: 'center',
              marginBottom: hp('1%'),
            }}>
            Payment Details
          </Text>
          <View style={style.div}>
            <Text body1>Payment Mode: </Text>

            <Text h4>M-PESA</Text>
          </View>

          <View style={style.div}>
            <Text body1>Name: </Text>

            <Text h4>{paymentDetails.paymentName}</Text>
          </View>

          <View style={style.div}>
            <Text body1>Phone Number:</Text>

            <Text h4>{paymentDetails.mpesaNumber}</Text>
          </View>
        </View>
      </View>

      <View style={style.div}>
        <Text h3>{transactionStatus}</Text>
      </View>

      {nextUserAction === NextUserAction.NONE ? (
        <Text body3></Text>
      ) : (
        <Button
          label={nextUserAction}
          labelStyle={{
            ...FONTS.h4,
          }}
          secondary
          onPress={sendRequest}
          outline={true}
          outlineColor={AppColors.light_green}
        />
      )}

      <EnterPinModal
        target="privateKey"
        onPinMatched={onPinMatched}
        visible={props.ui_status === 'enter_pin' && isFocused}
      />

      <LoadingModalComponent
        onShowModal={onShowLoadingModal}
        visible={props.ui_status === 'loading' && isFocused}
      />

      <SuccessModalComponent
        visible={props.ui_status === 'success' && isFocused}
        onPressOkay={onPressOkay}
      />

      <ErrorModalComponent
        visible={props.ui_status === 'error' && isFocused}
        onRetry={sendRequest}
      />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    justifyContent: 'space-around',
    height: hp('60%'),
    alignContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    height: hp('30%'),
    width: wp('80%'),
    paddingHorizontal: wp('5%'),
  },
  div: {flexDirection: 'row', justifyContent: 'space-between'},
  paymentDetails: {
    backgroundColor: 'white',
    paddingHorizontal: hp('2%'),
    paddingVertical: wp('2%'),
    borderRadius: wp('3%'),
    marginVertical: hp('3%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  ui_status: state.ui_state.status,
  rates: state.currency_conversion_rates.rates,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchApproval: generateActionApproveTransaction,
  dispatchCancelation: generateActionCancelTransaction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'ViewRequestScreen'
>;
type Props = ReduxProps & StackProps;

export default connector(ViewRequestScreen);
