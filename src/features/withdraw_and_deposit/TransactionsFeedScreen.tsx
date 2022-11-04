import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Screen from '../../app_components/Screen';
import {FlatList, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {generateActionQueryPendingTransactions} from './redux_store/action.generators';
import {RootState} from '../../app-redux-store/store';
import RequestCardComponent from './components/RequestCardComponent';
import BottomMenu from './components/BottomMenu';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';

const TransactionsFeedHomeScreen: React.FC<Props> = (props: Props) => {
  useFocusEffect(() => {
    props.dispatchFetchPendingTxs();
  });

  return (
    <Screen style={style.screenContainer}>
      <FlatList
        data={props.pendingTransactions}
        renderItem={({item}) => <RequestCardComponent transaction={item} />}
        keyExtractor={item => item.id}
        // onRefresh={onRefresh}
        // refreshing={isFetching}
        progressViewOffset={250}
        // ListEmptyComponent={<EmptyList />}
      />
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
