import {Contract, EventData} from 'web3-eth-contract';
import Web3 from 'web3';
import {EventOptions} from '@celo/contractkit/lib/generated/types';
import {AbiItem} from 'web3-utils';
import {NashEscrowAbi} from '../smart_contract_abis/NashEscrowAbi';
import {
  generateActionTransactionInitializationContractEvent,
  generateActionAgentPairingContractEvent,
  generateActionAgentConfirmationContractEvent,
  generateActionClientConfirmationContractEvent,
  generateActionConfirmationCompletedContractEvent,
  generateActionSavedClientCommentContractEvent,
  generateActionTransactionCanceledContractEvent,
  generateActionTransactionCompletionEvent,
} from '../../features/withdraw_and_deposit/redux_store/action.generators';
import ReadContractDataKit from '../../features/withdraw_and_deposit/sagas/ReadContractDataKit';
import {store} from '../../app-redux-store/store';
import {generateActionQueryBalance} from '../../features/account_balance/redux_store/action.generators';
import {NashEscrowTransaction} from '../../features/withdraw_and_deposit/sagas/nash_escrow_types';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

/**
 * Contains nash event listener logic.
 */
export class NashContractEventsKit {
  private static contractsEventListenerKit: NashContractEventsKit;

  /**
   * Creates a new instance of contract kit event listeners.
   */
  static createInstance() {
    if (this.contractsEventListenerKit) {
      console.log('Event listener running!!');
    } else {
      this.contractsEventListenerKit = new NashContractEventsKit();
    }
  }

  /**
   * Gets a running instance of nash contract kit utils.
   * @returns instance of nash contract kit.
   */
  static getInstance() {
    return this.contractsEventListenerKit;
  }

  /**
   * Instance of nash escrow smart contract.
   */
  public nashEscrowContract?: Contract;

  /**
   * Instance of websocket provider.
   */
  public provider = new Web3.providers.WebsocketProvider(
    Config.CELO_WEBSOCKET_NETWORK_URL ?? '',
  );
  // .WebsocketProvider(configs.CONTRACT_KIT_LISTENER!);

  /**
   * Instance of web 3.
   */
  public web3?: Web3;

  /**
   * Class constructor.
   */
  private constructor() {
    this.setupProviderAndSubscriptions();
    this.listenToNashEscrowContract();
  }

  /**
   * Listen for events and update the data on redux.
   */
  listenToNashEscrowContract() {
    this.addContractEventListener(
      'TransactionInitEvent',
      this.transactionEventHandler,
    );

    this.addContractEventListener(
      'AgentPairingEvent',
      this.transactionEventHandler,
    );

    this.addContractEventListener(
      'TransactionCanceledEvent',
      this.transactionEventHandler,
    );

    this.setFilteredEventListener('ClientConfirmationEvent');
    this.setFilteredEventListener('AgentConfirmationEvent');
    this.setFilteredEventListener('ConfirmationCompletedEvent');
    this.setFilteredEventListener('SavedClientCommentEvent');
    this.setFilteredEventListener('TransactionCompletionEvent');
  }

  setFilteredEventListener(eventName: string) {
    const publicAddress = store.getState().onboarding.publicAddress;
    const agentFilter = {
      agentAddress: publicAddress,
    };

    const clientFilter = {
      clientAddress: publicAddress,
    };

    this.addContractEventListener(
      eventName,
      this.transactionEventHandler,
      eventName,
      {filter: clientFilter},
    );

    this.addContractEventListener(
      eventName,
      this.transactionEventHandler,
      eventName,
      {filter: agentFilter},
    );
  }

  fetchBalance(tx: NashEscrowTransaction) {
    const publicAddress = store.getState().onboarding.publicAddress;
    if (
      tx.agentAddress === publicAddress ||
      tx.clientAddress === publicAddress
    ) {
      store.dispatch(generateActionQueryBalance());
    }
  }

  transactionEventHandler = async (event: EventData) => {
    const tx = ReadContractDataKit.getInstance()?.convertToNashTransactionObj(
      event.returnValues[0],
    );
    console.log(
      'Event NashEscrow data [ ' +
        event.event +
        ' ] ' +
        (await DeviceInfo.getDeviceName()) +
        ' tx ' +
        tx?.id,
      tx,
    );
    if (tx) {
      switch (event.event) {
        case 'TransactionInitEvent':
          store.dispatch(
            generateActionTransactionInitializationContractEvent(tx),
          );
          break;
        case 'AgentPairingEvent':
          store.dispatch(generateActionAgentPairingContractEvent(tx));
          break;
        case 'ClientConfirmationEvent':
          store.dispatch(generateActionClientConfirmationContractEvent(tx));
          break;
        case 'AgentConfirmationEvent':
          store.dispatch(generateActionAgentConfirmationContractEvent(tx));
          break;
        case 'SavedClientCommentEvent':
          store.dispatch(generateActionSavedClientCommentContractEvent(tx));
          break;
        case 'ConfirmationCompletedEvent':
          store.dispatch(generateActionConfirmationCompletedContractEvent(tx));
          break;
        case 'TransactionCompletionEvent':
          store.dispatch(generateActionTransactionCompletionEvent(tx));

          break;
        case 'TransactionCanceledEvent':
          store.dispatch(generateActionTransactionCanceledContractEvent(tx));
          break;
        default:
          // TODO: register this to crash-litics.
          console.error('Unknown event', event.event);
          break;
      }
    }
  };

  /**
   * Set up provider and subscription.
   */
  setupProviderAndSubscriptions() {
    let setupNewProvider = false;

    // Keeps track of the number of times we've retried to set up a new provider
    // and subs without a successful header
    let sequentialRetryCount = 0;

    this.provider = new Web3.providers.WebsocketProvider(
      Config.CELO_WEBSOCKET_NETWORK_URL ?? '',
    );

    this.web3 = new Web3(this.provider);

    this.nashEscrowContract = new this.web3.eth.Contract(
      NashEscrowAbi as AbiItem[],
      Config.NASH_CONTRACT_ADDRESS,
    );

    // logic to reset the connection.
    const setupNewProviderAndSubs = async () => {
      // To prevent us from retrying too aggressively, wait a little if
      // we try setting up multiple times in a row
      const sleepTimeMs = sequentialRetryCount * 100;
      console.log('sleeping', sleepTimeMs);
      await this.sleep(sleepTimeMs);
      sequentialRetryCount++;

      // To avoid a situation where multiple error events are triggered
      if (!setupNewProvider) {
        setupNewProvider = true;
        this.setupProviderAndSubscriptions();
        // re-set the event listeners for the contracts
        this.listenToNashEscrowContract();
      }
    };

    /**
     * Reconnect on error.
     */
    this.provider.on('error', async () => {
      console.log('WebsocketProvider encountered an error');
      await setupNewProviderAndSubs();
    });

    /**
     * Reconnect on connection expiry.
     */
    this.provider.on('end', async () => {
      console.log('WebsocketProvider has ended, will restart');
      await setupNewProviderAndSubs();
    });
  }

  /**
   * Create a delay in code execution for x number of milliseconds.
   * @param ms number of milliseconds to delay.
   * @param onSleep what to do on sleeping.
   * @returns a promise create a delay.
   */
  sleep(ms: number, onSleep?: () => void): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
      if (onSleep) {
        onSleep();
      }
    });
  }

  /**
   * Add contract event listeners.
   * @param event the name of the event to listen to.
   * @param callback what to do with the event data.
   * @param tag (optional) logging label for debugging purposes.
   * @param options (optional) options for the event listener.
   */
  addContractEventListener(
    event: string,
    callback: (eventData: EventData) => void,
    tag?: string,
    options?: EventOptions,
  ) {
    // use params options if not null.
    if (!options) {
      options = {
        filter: {
          value: [],
        },
        fromBlock: 'latest',
      };
    }

    this.nashEscrowContract?.events[event](options)
      .on('data', (eventData: EventData) => {
        //data – Will fire each time an event of the type you are listening for has been emitted
        // console.log(`[ ${this.TAG} ] [ ${tag} ] data`);
        // Act on the event data.
        callback(eventData);
      })
      .on('changed', (_changed: any) => {
        //  changed – Will fire for each event of the type you are
        //  listening for that has been removed from the blockchain.
        // console.log(
        //   `[ ${this.TAG} ] [ ${tag} ] ${event} changed { ${changed} }`,
        // );
      })
      .on('error', (err: any) => {
        //error – Will fire if an error in the event subscription occurs.
        console.log(event + ' error ', err);
      })
      .on('connected', (_str: any) => {
        //  connected – Will fire when the subscription has successfully established a connection.
        //  It will return a subscription id. This event only fires once.
        // console.log(event + ' connected ', str);
      });
  }
}
