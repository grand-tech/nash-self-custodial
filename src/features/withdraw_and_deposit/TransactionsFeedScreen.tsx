/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import Screen from '../../app_components/Screen';
import {
  FlatList,
  InteractionManager,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect, ConnectedProps} from 'react-redux';
import {generateActionQueryPendingTransactions} from './redux_store/action.generators';
import {RootState} from '../../app-redux-store/store';
import RequestCardComponent from './components/RequestCardComponent';
import BottomMenu from './components/BottomMenu';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WithdrawalAndDepositNavigationStackParamsList} from './navigation/navigation.params.type';
import {NashEscrowTransaction} from './sagas/nash_escrow_types';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FeedEmptyListComponent from '../../app_components/FeedEmptyListComponent';
import {AppColors} from '../../ui_lib_configs/colors';

const TransactionsFeedHomeScreen: React.FC<Props> = (props: Props) => {
  // props.dispatchFetchPendingTxs();

  const refetchTransaction = () => {
    props.dispatchFetchPendingTxs('refetch', 'ui');
  };

  useEffect(() => {
    if (
      props.pendingTransactions === null ||
      props.pendingTransactions.length === 0
    ) {
      refetchTransaction();
    }
  }, []);

  useFocusEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // manipulate the header section after all animations are done
      props.navigation.getParent()?.setOptions({
        headerShown: true,
        headerRight: () => {
          return (
            <Pressable
              style={{paddingRight: wp('3%')}}
              onPress={() => {
                props.navigation.navigate('MyTransactionsFeedScreen');
              }}>
              <Icon name="arrow-right" size={20} color={AppColors.black} />
            </Pressable>
          );
        },
      });
    });

    return () => {
      props.navigation.getParent()?.setOptions({headerShown: true});
    };
  });

  const fetchMoreTransactions = () => {
    if (props.pendingTransactions?.length > 10) {
      props.dispatchFetchPendingTxs('fetch-more', 'ui');
    } else {
      props.dispatchFetchPendingTxs('refetch', 'ui');
    }
  };

  const onFulFillRequest = (item: NashEscrowTransaction) => {
    if (props.ui_state !== 'loading') {
      props.navigation.navigate('FulfillRequestScreen', {
        transaction: item,
      });
    }
  };

  return (
    <Screen style={style.screenContainer}>
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
        refreshing={props.flats_list_state === 'loading'}
        ListEmptyComponent={<FeedEmptyListComponent visible={true} />}
        // style={{marginBottom: hp('1%')}}
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
  pendingTransactions: state.ramp.pending_transactions,
  ui_state: state.ui_state.status,
  flats_list_state: state.ui_state.flat_list_status,
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

export default connector(TransactionsFeedHomeScreen);
