/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import Screen from '../../app_components/Screen';
import {FlatList, StyleSheet} from 'react-native';
import {
  // widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {generateActionQueryPendingTransactions} from './redux_store/action.generators';
import {RootState} from '../../app-redux-store/store';
import RequestCardComponent from './components/RequestCardComponent';
import BottomMenu from './components/BottomMenu';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {NashEscrowTransaction} from './sagas/nash_escrow_types';
import {Text} from 'react-native-ui-lib';

const TransactionsFeedHomeScreen: React.FC<Props> = (props: Props) => {
  // props.dispatchFetchPendingTxs();

  const refetchTransaction = () => {
    props.dispatchFetchPendingTxs('refetch');
  };

  useEffect(() => {
    if (
      props.pendingTransactions === null ||
      props.pendingTransactions.length === 0
    ) {
      refetchTransaction();
    }
  }, []);

  const fetchMoreTransactions = () => {
    props.dispatchFetchPendingTxs('fetch-more');
  };

  const onFulFillRequest = (item: NashEscrowTransaction) => {
    props.navigation.navigate('FulfillRequestScreen', {
      transaction: item,
    });
  };

  return (
    <Screen style={style.screenContainer}>
      {props.pendingTransactions?.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={props.pendingTransactions}
          renderItem={({item}) => (
            <RequestCardComponent
              transaction={item}
              onFulFillRequest={onFulFillRequest}
            />
          )}
          keyExtractor={(item: NashEscrowTransaction) => {
            return item.id.toString();
          }}
          onRefresh={refetchTransaction}
          onEndReached={fetchMoreTransactions}
          refreshing={props.pendingTransactions?.length === 0}
          progressViewOffset={250}
          ListEmptyComponent={<Text>Loading...</Text>}
        />
      )}

      <BottomMenu parentProps={props} />
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('7%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  pendingTransactions: state.ramp.pending_transactions,
  ui_state: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchFetchPendingTxs: generateActionQueryPendingTransactions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

type StackProps = NativeStackScreenProps<
  WithdrawalAndDepositNavigationStackParamsList,
  'TransactionsFeedScreen'
>;

type Props = StackProps & ReduxProps;

export interface TransactionsFeedHomeScreenProps extends Props {}

export default connector(TransactionsFeedHomeScreen);
