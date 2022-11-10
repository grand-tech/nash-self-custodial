/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
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
import {
  NashEscrowTransaction,
  NashTransaction,
} from './sagas/nash_escrow_types';
import {gql, useQuery} from '@apollo/client';
import {Text} from 'react-native-ui-lib';
import ReadContractDataKit from './sagas/ReadContractDataKit';
import {useFocusEffect} from '@react-navigation/native';

interface NashTransactionData {
  escrowTransactions: NashTransaction[];
}

const TransactionsFeedHomeScreen: React.FC<Props> = (props: Props) => {
  const qry = gql`
    query GetLocations {
      escrowTransactions(
        first: 15
        orderBy: index
        orderDirection: desc
        where: {status: 0}
      ) {
        id
        index
        txType
        clientAddress
        agentAddress
        status
        netAmount
        agentFee
        nashFee
        grossAmount
        agentApproval
        clientApproval
        clientPhoneNumber
        agentPhoneNumber
      }
    }
  `;

  const {loading, data, fetchMore, refetch, startPolling, stopPolling} =
    useQuery<NashTransactionData, {}>(qry);

  const tx: NashEscrowTransaction[] = [];
  const [nashTransactions, setNashTransactions] = useState(tx);
  const [pollingInterval, setPollingInterval] = useState(false);

  useFocusEffect(() => {
    // TODO: fine tune this time interval to one thats more suitable.
    // TODO: find out how fast the graph self updates based on the timelines.
    startPolling(100);
    // setPollingInterval(true);
    return () => {
      // setPollingInterval(false);
      stopPolling();
    };
  });

  useEffect(() => {
    const transactions = data?.escrowTransactions;
    if (typeof transactions !== 'undefined') {
      const kit = ReadContractDataKit.getInstance();
      const tsx =
        kit?.convertToNashTransactions(transactions) ?? nashTransactions;
      setNashTransactions(tsx);
    }
  }, [loading, data]);

  const onFulFillRequest = (item: NashEscrowTransaction) => {
    props.navigation.navigate('FulfillRequestScreen', {
      transaction: item,
    });
  };

  const refetchTransaction = () => {
    refetch({});
  };

  const fetchMoreTransactions = () => {
    fetchMore({});
  };

  return (
    <Screen style={style.screenContainer}>
      {loading && nashTransactions.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={nashTransactions}
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
          refreshing={loading}
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
