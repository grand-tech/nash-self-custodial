/**
 * Transaction types.
 */
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',

  WITHDRAWAL = 'WITHDRAWAL',
}

/**
 * Status types.
 */
export enum Status {
  AWAITING_AGENT,

  AWAITING_CONFIRMATIONS,

  CONFIRMED,

  CANCELED,

  DONE,
}

/**
 * @typedef {Object} NashEscrowTransaction Nash escrow transaction object.
 * @property { number } id - the transaction id.
 * @property { TransactionType } txType - the transaction type.
 * @property { string } clientAddress - clientAddress the clients address.
 * @property { Status } status - the status of the transaction.
 * @property { number } amount - the amount of money being sent in the transaction.
 * @property { string } agentAddress - the agents address.
 * @property { number } nashFee - the amount of money retained by nash DAO.
 * @property { number } grossAmount - the summation of all the money/crypto involved in the transaction.
 * @property { number } agentFee - the amount of money/crypto levied by the agent.
 * @property { boolean } agentApproval - true on agents approval.
 * @property { boolean } clientApproval - true on clients approval.
 * @property { string } clientPaymentDetails - the client`s phone number.
 * @property { string } agentPaymentDetails - the agent`s phone number.
 */
export type NashEscrowTransaction = {
  id: number;
  txType: TransactionType;
  clientAddress: string;
  agentAddress: string;
  status: number;
  netAmount: number;
  agentFee: number;
  nashFee: number;
  grossAmount: number;
  agentApproval: string;
  clientApproval: string;
  clientPaymentDetails: string;
  agentPaymentDetails: string;
};

/**
 * @typedef {Object} NashEscrowTransaction Nash escrow transaction object.
 * @property { number } id - the transaction id.
 * @property { TransactionType } txType - the transaction type.
 * @property { string } clientAddress - clientAddress the clients address.
 * @property { Status } status - the status of the transaction.
 * @property { number } amount - the amount of money being sent in the transaction.
 * @property { string } agentAddress - the agents address.
 * @property { number } nashFee - the amount of money retained by nash DAO.
 * @property { number } grossAmount - the summation of all the money/crypto involved in the transaction.
 * @property { number } agentFee - the amount of money/crypto levied by the agent.
 * @property { boolean } agentApproval - true on agents approval.
 * @property { boolean } clientApproval - true on clients approval.
 * @property { string } clientPaymentDetails - the client`s phone number.
 * @property { string } agentPaymentDetails - the agent`s phone number.
 */
export interface NashTransaction {
  id: string;
  index: number;
  txType: TransactionType;
  clientAddress: string;
  agentAddress: string;
  status: number;
  netAmount: number;
  agentFee: number;
  nashFee: number;
  grossAmount: number;
  agentApproval: string;
  clientApproval: string;
  clientPaymentDetails: string;
  agentPaymentDetails: string;
}

/**
 * @typedef {Object} UserMetadata Summary of user information.
 * @property { string } phoneNumber - the users phone number.
 * @property { string } publicAddress - the users public address.
 */
export type UserMetadata = {
  phoneNumber?: string;
  publicAddress?: string;
};
