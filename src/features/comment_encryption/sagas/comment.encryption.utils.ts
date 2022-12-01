import {
  CommentEncryptionUtils,
  EncryptionStatus,
} from '@celo/cryptographic-utils';
import {hexToBuffer} from '@celo/utils/lib/address';
/**
 * Comments saved by the agent or client on the escrow transaction.
 * @typedef {Record<string, string>} EscrowTxComment properties crypto account.
 * @property { string} mpesaNumber the m-pesa phone number.
 * @property { string } payBill the m-pesa paybill number.
 * @property { string } accountNumber the m-pesa account number.
 * @property { string } paymentName the name expected to be seen after the payment is done off chain.
 */
export interface EscrowTxComment extends Record<string, string> {
  mpesaNumber: string;
  payBill: string;
  accountNumber: string;
  paymentName: string;
}

/**
 * Used to mark segments within comment.
 */
export const COMMENT_SEPARATOR = '*#*';

/**
 * Separates a key from its value in the comment.
 */
export const KEY_VALUE_SEPARATOR = ':#:';

/**
 * Encrypts escrow transactions comment.
 * @param escrowTxComment data to be encrypted.
 * @param sendersDEK the senders data encryption key.
 * @param receiversDEK the receivers data encryption key.
 * @returns data encryption status.
 */
export function encryptEscrowTXComment(
  escrowTxComment: EscrowTxComment,
  sendersDEK: string,
  receiversDEK: string,
) {
  const comment = constructEscrowCommentString(escrowTxComment);
  return encryptComment(sendersDEK, receiversDEK, comment);
}

/**
 * Encrypts a comment.
 * @param sendersDEK senders data encryption key.
 * @param receiversDEK receivers data encryption key.
 * @param comment the comment to be encrypted.
 * @returns the encryption process result.
 */
export function encryptComment(
  sendersDEK: string,
  receiversDEK: string,
  comment: string,
): EncryptionStatus {
  const rDEK = hexToBuffer(receiversDEK);
  const sDEK = hexToBuffer(sendersDEK);
  return CommentEncryptionUtils.encryptComment(comment, rDEK, sDEK);
}

/**
 * Constructs a comment from the values in the escrow tx comment obj.
 * @param escrowTxComment the comment to be encrypted.
 * @returns the constructed comment.
 */
export function constructEscrowCommentString(
  escrowTxComment: EscrowTxComment,
): string {
  let comment: string = '';

  const keyPairs = Object.entries(escrowTxComment);

  for (let index = 0; index < keyPairs.length; index++) {
    const key = keyPairs[index][0];
    const value = keyPairs[index][1].trim();
    if (value && value !== '') {
      const keyVal = key + KEY_VALUE_SEPARATOR + value;
      if (comment === '') {
        comment = keyVal;
      } else {
        comment = comment + COMMENT_SEPARATOR + keyVal;
      }
    }
  }

  return comment;
}

/**
 * Constructs a comment from the values in the escrow tx comment obj.
 * @param escrowTxComment the comment to be encrypted.
 * @returns the constructed comment.
 */
export function constructEscrowCommentObject(
  escrowTxComment: string,
): EscrowTxComment {
  let comment: string[] = escrowTxComment.split(COMMENT_SEPARATOR);

  const commentObj: EscrowTxComment = {
    mpesaNumber: '',
    payBill: '',
    accountNumber: '',
    paymentName: '',
  };

  const keys = Object.keys(commentObj);
  for (const commentSection in comment) {
    const keyValue = comment[commentSection].split(KEY_VALUE_SEPARATOR);

    if (keys.includes(keyValue[0])) {
      commentObj[keyValue[0]] = keyValue[1];
    }
  }

  return commentObj;
}

/**
 * Decrypts an encrypted comment.
 * @param comment the encrypted comment.
 * @param privateKey the private key use to decrypt the cypher text.
 * @param isSender if the private key belongs to the sender.
 * @returns status of the decryption process with the plain text.
 */
export function decryptComment(
  comment: string,
  privateKey: string,
  isSender: boolean,
): EncryptionStatus {
  const key = hexToBuffer(privateKey);
  return CommentEncryptionUtils.decryptComment(comment, key, isSender);
}
