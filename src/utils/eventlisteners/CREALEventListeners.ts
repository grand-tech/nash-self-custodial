import {Contract, EventData} from 'web3-eth-contract';
import Web3 from 'web3';
import {EventOptions} from '@celo/contractkit/lib/generated/types';
import {AbiItem} from 'web3-utils';

import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import {store} from '../../app-redux-store/store';
import {generateActionQueryBalance} from '../../features/account_balance/redux_store/action.generators';
import {ECR20_ABI} from '../smart_contract_abis/ERC20.abi';

/**
 * Contains nash event listener logic.
 */
export class CREALEventListeners {
  private static contractsEventListenerKit: CREALEventListeners;

  /**
   * Creates a new instance of contract kit event listeners.
   */
  static createInstance(cREALAddress: string) {
    if (this.contractsEventListenerKit) {
      console.log('Event listener running!!');
    } else {
      this.contractsEventListenerKit = new CREALEventListeners(cREALAddress);
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
  public cUSDEscrowContract?: Contract;

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
  private constructor(cREALAddress: string) {
    this.setupProviderAndSubscriptions(cREALAddress);
    this.listenToCUSDContractEvents();
  }

  /**
   * Listen for events and update the data on redux.
   */
  listenToCUSDContractEvents() {
    this.setFilteredEventListener('Transfer');
  }

  setFilteredEventListener(eventName: string) {
    const publicAddress = store.getState().onboarding.publicAddress;
    const agentFilter = {
      to: publicAddress,
    };

    const clientFilter = {
      from: publicAddress,
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

  transactionEventHandler = async (event: EventData) => {
    console.log(
      'Event cREAL data [ ' +
        event.event +
        ' ] ' +
        (await DeviceInfo.getDeviceName()),
    );

    store.dispatch(generateActionQueryBalance());
  };

  /**
   * Set up provider and subscription.
   */
  setupProviderAndSubscriptions(cREALAddress: string) {
    let setupNewProvider = false;

    // Keeps track of the number of times we've retried to set up a new provider
    // and subs without a successful header
    let sequentialRetryCount = 0;

    this.provider = new Web3.providers.WebsocketProvider(
      Config.CELO_WEBSOCKET_NETWORK_URL ?? '',
    );

    this.web3 = new Web3(this.provider);

    this.cUSDEscrowContract = new this.web3.eth.Contract(
      ECR20_ABI as AbiItem[],
      cREALAddress,
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
        this.setupProviderAndSubscriptions(cREALAddress);
        // re-set the event listeners for the contracts
        this.listenToCUSDContractEvents();
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

    this.cUSDEscrowContract?.events[event](options)
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
