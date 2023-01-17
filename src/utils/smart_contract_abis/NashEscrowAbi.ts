export const NashEscrowAbi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'AgentConfirmationEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'AgentPairingEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'ClientConfirmationEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'ConfirmationCompletedEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'SavedClientCommentEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'TransactionCompletionEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
    ],
    name: 'TransactionInitEvent',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_paymentDetails',
        type: 'string',
      },
    ],
    name: 'agentAcceptDepositTransaction',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_paymentDetails',
        type: 'string',
      },
    ],
    name: 'agentAcceptWithdrawalTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
    ],
    name: 'agentConfirmPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
    ],
    name: 'clientConfirmPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_comment',
        type: 'string',
      },
    ],
    name: 'clientWritePaymentInformation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'countSuccessfulTransactions',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionid',
        type: 'uint256',
      },
    ],
    name: 'finalizeTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAgentFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_paginationCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_startingPoint',
        type: 'uint256',
      },
      {
        internalType: 'enum NashEscrow.Status[]',
        name: '_status',
        type: 'uint8[]',
      },
      {
        internalType: 'address',
        name: 'myAddress',
        type: 'address',
      },
    ],
    name: 'getMyTransactions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        internalType: 'struct NashEscrow.NashTransaction[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNashFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNextTransactionIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionID',
        type: 'uint256',
      },
    ],
    name: 'getNextUnpairedTransaction',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        internalType: 'struct NashEscrow.NashTransaction',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_transactionID',
        type: 'uint256',
      },
    ],
    name: 'getTransactionByIndex',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        internalType: 'struct NashEscrow.NashTransaction',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_paginationCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_startingPoint',
        type: 'uint256',
      },
      {
        internalType: 'enum NashEscrow.Status',
        name: '_status',
        type: 'uint8',
      },
    ],
    name: 'getTransactions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        internalType: 'struct NashEscrow.NashTransaction[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_nashTreasuryAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_nashFees',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_agentFees',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_exchangeToken',
        type: 'address',
      },
    ],
    name: 'initializeDepositTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_exchangeToken',
        type: 'address',
      },
    ],
    name: 'initializeWithdrawalTransaction',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'enum NashEscrow.TransactionType',
            name: 'txType',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'clientAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'agentAddress',
            type: 'address',
          },
          {
            internalType: 'enum NashEscrow.Status',
            name: 'status',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'netAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'agentFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'nashFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'grossAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'agentApproval',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'clientApproval',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'agentPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'clientPaymentDetails',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'exchangeToken',
            type: 'address',
          },
        ],
        internalType: 'struct NashEscrow.NashTransaction',
        name: 'wtx',
        type: 'tuple',
      },
      {
        internalType: 'enum NashEscrow.Status[]',
        name: '_status',
        type: 'uint8[]',
      },
    ],
    name: 'isTxInStatus',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newTreasuryAddress',
        type: 'address',
      },
    ],
    name: 'setNashTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_agentFees',
        type: 'uint256',
      },
    ],
    name: 'updateAgentFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_nashFees',
        type: 'uint256',
      },
    ],
    name: 'updateNashFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
