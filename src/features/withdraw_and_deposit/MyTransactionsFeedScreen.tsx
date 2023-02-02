/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import Screen from '../../app_components/Screen';
import {FlatList, InteractionManager, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {
  generateActionApproveTransaction,
  generateActionCancelTransaction,
  generateActionQueryMyTransactions,
} from './redux_store/action.generators';
import {RootState} from '../../app-redux-store/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {
  NashEscrowTransaction,
  TransactionType,
} from './sagas/nash_escrow_types';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MyTransactionsCardComponent from './components/MyTransactionsCardComponent';
import {
  generateActionSetEnterPIN,
  generateActionSetLoading,
} from '../ui_state_manager/action.generators';
import EnterPinModal from '../../app_components/EnterPinModal';
import ErrorModalComponent from '../../app_components/ErrorModalComponent';
import LoadingModalComponent from '../../app_components/LoadingModalComponent';
import SuccessModalComponent from '../../app_components/SuccessModalComponent';
import {NashCache} from '../../utils/cache';
import BottomMenu from './components/BottomMenu';
import FeedEmptyListComponent from '../../app_components/FeedEmptyListComponent';
import ComingSoonModalComponent from '../../app_components/ComingSoonModalComponent';
import {NextUserAction} from './transaction.user.actions.enum';

const MyTransactionsFeedScreen: React.FC<Props> = (props: Props) => {
  const isFocused = useIsFocused();
  const [comingSoonModalVisible, setComingSoonModalVisible] = useState(false);

  let tx: NashEscrowTransaction = {
    id: -1,
    txType: TransactionType.DEPOSIT,
    clientAddress: '',
    agentAddress: '',
    status: 0,
    amount: 0,
    agentApproval: '',
    clientApproval: '',
    clientPaymentDetails: '',
    agentPaymentDetails: '',
    enxchangeToken: '',
    exchangeTokenLable: '',
  };

  const [nextUserAction, setNextUserAction] = useState(NextUserAction.NONE);
  const [transaction, setTransaction] = useState(tx);

  const refetchTransaction = () => {
    props.dispatchFetchMyTransactions('refetch', [0, 1, 2, 3], 'ui');
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (props.transactions === null || props.transactions.length === 0) {
        props.dispatchFetchMyTransactions('refetch', [0, 1, 2, 3], 'ui');
      }
    });
  }, []);

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // manipulate the header section after all animations are done
      props.navigation.getParent()?.setOptions({
        headerShown: false,
      });
      props.navigation.setOptions({
        headerTitle: 'My Transactions',
        headerTransparent: true,
      });
    });
  });

  const fetchMoreTransactions = () => {
    if (props.transactions?.length > 10) {
      props.dispatchFetchMyTransactions('fetch-more', [0, 1, 2, 3], 'ui');
    } else {
      props.dispatchFetchMyTransactions('refetch', [0, 1, 2, 3], 'ui');
    }
  };

  const onPinMatched = (_p: string) => {
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

  const performNextUserAction = (
    _nextUserAction: NextUserAction,
    _transaction: NashEscrowTransaction,
  ) => {
    setNextUserAction(_nextUserAction);
    setTransaction(_transaction);
    if (_nextUserAction === NextUserAction.CANCEL) {
      setComingSoonModalVisible(true);
    } else if (_transaction.id >= 0 && nextUserAction !== NextUserAction.NONE) {
      if (
        NashCache.getPinCache() !== null &&
        NashCache.getPinCache()?.trim() !== ''
      ) {
        props.dispatchActionSetLoading('Approving ...', '');
      } else {
        props.promptForPIN();
      }
    }
  };

  return (
    <Screen style={style.screenContainer}>
      <FlatList
        data={props.transactions}
        renderItem={({item}) => (
          <MyTransactionsCardComponent
            transaction={item}
            performNextUserAction={performNextUserAction}
            navigation={props.navigation}
          />
        )}
        keyExtractor={(item: NashEscrowTransaction) => {
          return item.id.toString();
        }}
        onRefresh={refetchTransaction}
        onEndReached={fetchMoreTransactions}
        refreshing={props.flats_list_state === 'loading'}
        progressViewOffset={250}
        ListEmptyComponent={<FeedEmptyListComponent visible={true} />}
      />

      <EnterPinModal
        target="privateKey"
        onPinMatched={onPinMatched}
        visible={props.ui_state === 'enter_pin' && isFocused}
      />

      <LoadingModalComponent
        onShowModal={onShowLoadingModal}
        visible={props.ui_state === 'loading' && isFocused}
      />

      <SuccessModalComponent
        visible={props.ui_state === 'success' && isFocused}
        onPressOkay={() => {}}
      />

      <ErrorModalComponent
        visible={props.ui_state === 'error' && isFocused}
        onRetry={performNextUserAction}
      />
      <ComingSoonModalComponent
        visible={comingSoonModalVisible}
        onCloseModal={() => {
          setComingSoonModalVisible(false);
        }}
      />
      <BottomMenu navigation={props.navigation} />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('5.3%'),
    flex: 1,
    paddingBottom: hp('2.5%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  transactions: state.ramp.my_transactions,
  ui_state: state.ui_state.status,
  flats_list_state: state.ui_state.flat_list_status,
});

const mapDispatchToProps = {
  dispatchFetchMyTransactions: generateActionQueryMyTransactions,
  dispatchActionSetLoading: generateActionSetLoading,
  dispatchApproval: generateActionApproveTransaction,
  dispatchCancelation: generateActionCancelTransaction,
  promptForPIN: generateActionSetEnterPIN,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'MyTransactionsFeedScreen'
>;

type Props = StackProps & ReduxProps;

export interface TransactionsFeedHomeScreenProps extends Props {}

export default connector(MyTransactionsFeedScreen);
