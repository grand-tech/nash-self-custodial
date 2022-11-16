/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import Screen from '../../app_components/Screen';
import {FlatList, InteractionManager, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {generateActionQueryMyTransactions} from './redux_store/action.generators';
import {RootState} from '../../app-redux-store/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {NashEscrowTransaction} from './sagas/nash_escrow_types';
import {Text} from 'react-native-ui-lib';
import {useFocusEffect} from '@react-navigation/native';
import MyTransactionsCardComponent from './components/MyTransactionsCardComponent';
// import BottomMenu from './components/BottomMenu';

const MyTransactionsFeedScreen: React.FC<Props> = (props: Props) => {
  const refetchTransaction = () => {
    props.dispatchFetchMyTransactions('refetch', [0, 1, 2, 3]);
  };

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (props.transactions === null || props.transactions.length === 0) {
        props.dispatchFetchMyTransactions('refetch', [0, 1, 2, 3]);
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

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const fetchMoreTransactions = () => {
    props.dispatchFetchMyTransactions('fetch-more', [0, 1, 2, 3]);
  };

  return (
    <Screen style={style.screenContainer}>
      {props.transactions?.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={props.transactions}
          renderItem={({item}) => (
            <MyTransactionsCardComponent transaction={item} />
          )}
          keyExtractor={(item: NashEscrowTransaction) => {
            return item.id.toString();
          }}
          onRefresh={refetchTransaction}
          onEndReached={fetchMoreTransactions}
          refreshing={props.transactions?.length === 0}
          progressViewOffset={250}
          ListEmptyComponent={<Text>Loading...</Text>}
        />
      )}

      {/* <BottomMenu parentProps={props} /> */}
    </Screen>
  );
};

const style = StyleSheet.create({
  screenContainer: {
    paddingTop: hp('5.2%'),
  },
});

const mapStateToProps = (state: RootState) => ({
  transactions: state.ramp.my_transactions,
  ui_state: state.ui_state.status,
});

const mapDispatchToProps = {
  dispatchFetchMyTransactions: generateActionQueryMyTransactions,
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
