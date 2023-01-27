import {
  encryptEscrowTXComment,
  nashDecryptComment,
} from '../comment.encryption.utils';
import {constructEscrowCommentObject} from '../comment.encryption.utils';
import {
  TEST_ACC_1,
  TEST_ACC_2,
} from '../../../../utils/test_utils/test.accounts';
import {
  constructEscrowCommentString,
  EscrowTxComment,
} from '../comment.encryption.utils';

describe('Construct comment string tests', () => {
  it('Test empty strings', () => {
    const commentObj: EscrowTxComment = {
      mpesaNumber: '',
      payBill: '',
      accountNumber: '',
      paymentName: '',
    };

    const commentStr = constructEscrowCommentString(commentObj);
    expect(commentStr).toEqual('');
  });

  it('Test empty spaces', () => {
    const commentObj: EscrowTxComment = {
      mpesaNumber: '    ',
      payBill: '    ',
      accountNumber: '    ',
      paymentName: ' ',
    };

    const commentStr = constructEscrowCommentString(commentObj);
    expect(commentStr).toEqual('');
  });

  it('Test partially empty strings', () => {
    const commentObj: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: '',
      paymentName: '     ',
    };

    const commentStr = constructEscrowCommentString(commentObj);
    expect(commentStr).toEqual('mpesaNumber:#:+254700000000*#*payBill:#:2022');
  });

  it('Test partially full strings', () => {
    const commentObj: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: 'XSDWECS',
      paymentName: 'John Done',
    };

    const commentStr = constructEscrowCommentString(commentObj);
    expect(commentStr).toEqual(
      'mpesaNumber:#:+254700000000*#*payBill:#:2022*#*accountNumber:#:XSDWECS*#*paymentName:#:John Done',
    );
  });
});

describe('Construct comment object tests', () => {
  it('Test empty strings', () => {
    const commentStr = '';

    const commentObj = constructEscrowCommentObject(commentStr);
    const poto: EscrowTxComment = {
      mpesaNumber: '',
      payBill: '',
      accountNumber: '',
      paymentName: '',
    };
    expect(commentObj).toEqual(poto);
  });

  it('Test empty spaces', () => {
    const commentStr = '       ';

    const commentObj = constructEscrowCommentObject(commentStr);
    const poto: EscrowTxComment = {
      mpesaNumber: '',
      payBill: '',
      accountNumber: '',
      paymentName: '',
    };
    expect(commentObj).toEqual(poto);
  });

  it('Test partially empty strings', () => {
    const poto: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: '',
      paymentName: '',
    };

    const commentStr = 'mpesaNumber:#:+254700000000*#*payBill:#:2022';
    const commentObj = constructEscrowCommentObject(commentStr);
    expect(commentObj).toEqual(poto);
  });

  it('Test partially full strings', () => {
    const poto: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: 'XSDWECS',
      paymentName: 'John Done',
    };
    const commentStr =
      'mpesaNumber:#:+254700000000*#*payBill:#:2022*#*accountNumber:#:XSDWECS*#*paymentName:#:John Done';
    const commentObj = constructEscrowCommentObject(commentStr);
    expect(commentObj).toEqual(poto);
  });
});

describe('Encrypt and decrypt comment.', () => {
  it('Happy path', async () => {
    const comment: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: 'XSDWECS',
      paymentName: 'John Done',
    };
    const encryptionResult = encryptEscrowTXComment(
      comment,
      TEST_ACC_1.publicKey,
      TEST_ACC_2.publicKey,
    );
    expect(encryptionResult.success).toBe(true);

    let decryptionResult1 = nashDecryptComment(
      encryptionResult.comment,
      TEST_ACC_1.privateKey,
      true,
    );

    const commentStr = constructEscrowCommentString(comment);
    expect(decryptionResult1.success).toBe(true);
    expect(commentStr).toEqual(decryptionResult1.comment);

    let decryptionResult2 = nashDecryptComment(
      encryptionResult.comment,
      TEST_ACC_2.privateKey,
      false,
    );

    expect(decryptionResult2.success).toBe(true);
    expect(commentStr).toEqual(decryptionResult2.comment);
  });

  it('Wrong private key', async () => {
    const comment: EscrowTxComment = {
      mpesaNumber: '+254700000000',
      payBill: '2022',
      accountNumber: 'XSDWECS',
      paymentName: 'John Done',
    };
    const encryptionResult = encryptEscrowTXComment(
      comment,
      TEST_ACC_1.publicKey,
      TEST_ACC_2.publicKey,
    );
    expect(encryptionResult.success).toBe(true);

    let decryptionResult1 = nashDecryptComment(
      encryptionResult.comment,
      TEST_ACC_1.privateKey,
      false,
    );

    const commentStr = constructEscrowCommentString(comment);
    expect(decryptionResult1.success).toBe(false);
    expect(commentStr).not.toEqual(decryptionResult1.comment);

    let decryptionResult2 = nashDecryptComment(
      encryptionResult.comment,
      TEST_ACC_2.privateKey,
      true,
    );

    expect(decryptionResult2.success).toBe(false);
    expect(commentStr).not.toEqual(decryptionResult2.comment);
  });
});
