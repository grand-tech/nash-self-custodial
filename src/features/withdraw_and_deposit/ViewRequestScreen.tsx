import React, {useEffect, useState} from 'react';
import Screen from '../../app_components/Screen';
import {
  BackHandler,
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {Button} from 'react-native-ui-lib';
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
  generateActionUpdateSelectedTransaction,
} from './redux_store/action.generators';
import ErrorModalComponent from '../../app_components/ErrorModalComponent';
import {selectPublicAddress} from '../onboarding/redux_store/selectors';
import {
  constructEscrowCommentObject,
  EscrowTxComment,
  nashDecryptComment,
} from '../../utils/comment.encryption.utils';
import {NextUserAction} from './transaction.user.actions.enum';
import {HR} from '../../app_components/HRComponent';
import {TransactionType} from './sagas/nash_escrow_types';
import {EncryptionStatus} from '@celo/cryptographic-utils';

const ViewRequestScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const rates = props.rates;
  const [amountFiat, setAmountFiat] = useState('-');
  const myAddress = useSelector(selectPublicAddress);
  const paymentInfo: EscrowTxComment = {
    mpesaNumber: '',
    payBill: '',
    accountNumber: '',
    paymentName: '',
  };
  const [nextUserAction, setNextUserAction] = useState(NextUserAction.NONE);
  const [nextActionDescription, setNextActionDescription] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(paymentInfo);
  const [transactionStatus, setTransactionStatus] = useState('-');
  const [privateKey, setPrivateKey] = useState(NashCache.getPrivateKey());

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.dispatchActionUpdateSelectedTx(undefined);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  /**
   * Process transaction status.
   */
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let status = '';
      const fiatAmount = computerFiatAmount();
      setAmountFiat(fiatAmount);
      console.log('use effect status', props.transaction);
      switch (props.transaction?.status) {
        case 0:
          status = 'Awaiting Agent';
          setNextUserAction(NextUserAction.CANCEL);
          setNextActionDescription(
            'Waiting for someone to fulfill your transaction.',
          );
          break;
        case 1:
          if (
            props.transaction?.agentApproval &&
            props.transaction?.agentAddress === myAddress
          ) {
            status = 'Awaiting Client`s Confirmation';
            setNextUserAction(NextUserAction.NONE);
          } else if (
            props.transaction?.clientApproval &&
            props.transaction?.clientAddress === myAddress
          ) {
            status = 'Awaiting Agent Confirmation';
            setNextUserAction(NextUserAction.NONE);
          } else {
            status = 'Awaiting Your Confirmation';
            setNextUserAction(NextUserAction.APPROVE);
            const isReceivingEnd =
              (props.transaction?.agentAddress === myAddress &&
                props.transaction?.txType === TransactionType.DEPOSIT) ||
              (props.transaction?.clientAddress === myAddress &&
                props.transaction?.txType === TransactionType.WITHDRAWAL);

            if (isReceivingEnd) {
              setNextActionDescription(
                'Confirm that you have received ' +
                  fiatAmount +
                  ' ksh from an account with the above details.',
              );
            } else {
              setNextActionDescription(
                'Confirm that you have sent ' +
                  fiatAmount +
                  ' ksh to the above details.',
              );
            }
          }
          break;
        case 2:
          status = 'Confirmed';
          setNextActionDescription('');
          break;
        case 3:
          status = 'Canceled';
          setNextActionDescription('');
          break;
        default:
          status = 'Completed';
          setNextActionDescription('');
          break;
      }

      setTransactionStatus(status);
    });
  }, [myAddress, rates, props.transaction]);

  /**
   * Handle the activity header.
   */
  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      let title = 'Withdraw Request';
      if (props.transaction?.txType === 'DEPOSIT') {
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
   * Handle currency conversion.
   */
  const computerFiatAmount = () => {
    if (rates) {
      let amount = 0;

      let rate = rates?.KESUSD;
      if (props.transaction?.exchangeTokenLabel === 'cUSD') {
        rate = rates.KESUSD;
      }

      if (props.transaction?.exchangeTokenLabel === 'cEUR') {
        rate = rates.KESEUR;
      }

      if (props.transaction?.exchangeTokenLabel === 'cREAL') {
        rate = rates.KESBRL;
      }

      amount = props.transaction?.amount ?? 0 / rate;
      return Number(amount.toFixed(2)).toLocaleString();
    } else {
      return '-';
    }
  };

  /**
   * Handle comment decryption.
   */
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (
        props.transaction?.clientPaymentDetails === '' ||
        props.transaction?.agentPaymentDetails === ''
      ) {
        // TODO: Error handling for missing comment.
        console.log('Error: Missing comments await comment');
      } else if (privateKey === '') {
        // Retrieve and decrypt the private
        //  key for comment decryption.
        props.promptForPIN();
      } else {
        let comment = '';
        let plainText: EncryptionStatus = {
          success: false,
          comment: '',
        };

        if (myAddress === props.transaction?.agentAddress) {
          // TODO: Figure out where and how to get the private key.
          plainText = nashDecryptComment(
            props.transaction?.clientPaymentDetails,
            privateKey,
            false,
          );

          if (plainText.success) {
            comment = plainText.comment;
          }
        } else if (myAddress === props.transaction?.clientAddress) {
          plainText = nashDecryptComment(
            props.transaction?.agentPaymentDetails,
            privateKey,
            true,
          );
        }

        if (plainText.success) {
          comment = plainText.comment;
        }

        // TODO: Decryption Error handling
        setPaymentDetails(constructEscrowCommentObject(comment));
      }
    });
  }, [props.transaction, privateKey]);

  /**
   * Display loading modal or prompt user for PIN.
   */
  const sendRequest = () => {
    if (
      NashCache.getPinCache() !== null &&
      NashCache.getPinCache()?.trim() !== ''
    ) {
      props.dispatchActionSetLoading('Send request...', '');
    } else {
      props.promptForPIN();
    }
  };

  const onPinMatched = async (p: string) => {
    await NashCache.setPinCache(p);
    setPrivateKey(NashCache.getPrivateKey());
    props.dispatchActionSetNormal();
  };

  const onShowLoadingModal = () => {
    if (isFocused && props.transaction) {
      if (nextUserAction === NextUserAction.APPROVE) {
        // dispatch approval action
        props.dispatchApproval(
          props.transaction,
          NashCache.getPinCache() ?? '',
        );
      } else if (nextUserAction === NextUserAction.CANCEL) {
        // dispatch agent approve action
        props.dispatchCancelation(
          props.transaction,
          NashCache.getPinCache() ?? 'Cancel request',
        );
      }
    }
  };

  const onPressOkay = () => {
    // props.navigation.goBack();
  };

  return (
    <Screen style={style.screenContainer}>
      <View style={style.contentContainer}>
        <View style={style.paymentDetails}>
          <View style={style.div}>
            <Text style={style.amountLabel}>Amount</Text>
            <Text style={style.amountValue}>
              {Number(props.transaction?.amount.toFixed(2)).toLocaleString()}{' '}
              {props.transaction?.exchangeTokenLabel}
            </Text>
          </View>
          <View style={style.div}>
            <Text />
            <Text style={style.amountFiatValue}>{amountFiat} Ksh</Text>
          </View>

          <HR weight={1} additionalContainerStyling={style.hrSpacing} />

          {/* The payment details section */}
          {props.transaction?.clientPaymentDetails !== '' &&
            props.transaction?.agentPaymentDetails !== '' && (
              <>
                <Text style={style.paymentDetailsTitle}>Payment Details</Text>
                <View style={style.div}>
                  <Text style={style.paymentDetailLabel}>Name: </Text>

                  <Text style={style.paymentDetail}>
                    {paymentDetails.paymentName}
                  </Text>
                </View>
                <View style={style.div}>
                  <Text style={style.paymentDetailLabel}>Payment Mode: </Text>

                  <Text style={style.paymentDetail}>M-PESA</Text>
                </View>
                <View style={style.div}>
                  <Text style={style.paymentDetailLabel}>Phone Number:</Text>

                  <Text style={style.paymentDetail}>
                    {paymentDetails.mpesaNumber}
                  </Text>
                </View>
                <HR weight={3} additionalContainerStyling={style.hrSpacing} />
              </>
            )}

          <View style={[style.div]}>
            <Text style={[style.paymentDetailLabel, style.greenText]}>
              Status:
            </Text>
            <Text style={[style.paymentDetail, style.greenText]}>
              {transactionStatus}
            </Text>
          </View>
        </View>
      </View>

      <View style={style.div}>
        <Text style={style.nextActionDescription}>{nextActionDescription}</Text>
      </View>

      {nextUserAction === NextUserAction.NONE ||
      props.transaction?.status === 3 ? (
        <Text></Text>
      ) : (
        <Button
          label={nextUserAction}
          size={'small'}
          labelStyle={{
            ...FONTS.body1,
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
        TAG="ViewRequestScreen"
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
    width: wp('95%'),
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
  paymentDetailsTitle: {
    ...FONTS.body1,
    alignSelf: 'center',
    marginBottom: hp('1%'),
    fontWeight: 'bold',
    color: AppColors.black,
  },
  paymentDetailLabel: {
    ...FONTS.body1,
    color: AppColors.black,
  },
  paymentDetail: {
    ...FONTS.body1,
    color: AppColors.black,
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
  greenText: {
    color: AppColors.green,
  },
  nextActionDescription: {
    ...FONTS.body1,
    color: AppColors.brown,
    width: wp('78%'),
    textAlign: 'center',
  },
  hrSpacing: {
    marginVertical: hp('2%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  ui_status: state.ui_state.status,
  rates: state.currency_conversion_rates.rates,
  transaction: state.ramp.selected_request,
});

const mapDispatchToProps = {
  promptForPIN: generateActionSetEnterPIN,
  returnToNormal: generateActionSetNormal,
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchApproval: generateActionApproveTransaction,
  dispatchCancelation: generateActionCancelTransaction,
  dispatchActionSetNormal: generateActionSetNormal,
  dispatchActionUpdateSelectedTx: generateActionUpdateSelectedTransaction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'ViewRequestScreen'
>;
type Props = ReduxProps & StackProps;

export default connector(ViewRequestScreen);
