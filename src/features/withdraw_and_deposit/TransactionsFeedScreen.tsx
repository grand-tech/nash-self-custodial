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

interface NashTransactionData {
  escrowTransactions: NashTransaction[];
}

const TransactionsFeedHomeScreen: React.FC<Props> = (props: Props) => {
  const qry = gql`
    query GetLocations {
      escrowTransactions(first: 15, orderBy: index, orderDirection: desc) {
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

  const tx: NashEscrowTransaction[] = [];
  const [nashTransactions, setNashTransactions] = useState(tx);

  const {loading, error, data, fetchMore} = useQuery<NashTransactionData, {}>(
    qry,
  );

  useEffect(() => {
    const transactions = data?.escrowTransactions;
    if (typeof transactions !== 'undefined') {
      const tsx =
        ReadContractDataKit.getInstance()?.convertToNashTransactions(
          transactions,
        ) ?? nashTransactions;
      setNashTransactions(tsx);
    }
  }, [loading, error]);

  const onFulFillRequest = (item: NashEscrowTransaction) => {
    props.navigation.navigate('FulfillRequestScreen', {
      transaction: item,
    });
  };

  const queryData = () => {
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
          keyExtractor={item => item.id}
          onRefresh={queryData}
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
