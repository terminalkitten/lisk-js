/*
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
/**
 * Transaction module provides functions for creating balance transfer transactions.
 * @class transaction
 */
import crypto from './crypto';
import constants from '../constants';
import slots from '../time/slots';
import { prepareTransaction } from './utils';
import jschardet from "jschardet";

/**
 * @method createTransaction
 * @param recipientId
 * @param amount
 * @param secret
 * @param secondSecret
 * @param data
 * @param timeOffset
 *
 * @return {Object}
 */


function createTransaction(recipientId, amount, secret, secondSecret, data, timeOffset) {
	const keys = crypto.getKeys(secret);
	const fee = data ? (constants.fees.send + constants.fees.data) : constants.fees.send;
	const transaction = {
		type: 0,
		amount,
		fee,
		recipientId,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTimeWithOffset(timeOffset),
		asset: {},
	};

	if (data && data.length > 0) {
		const encoding = jschardet.detect(data).encoding;
		if(encoding !== 'ascii' && encoding !== 'UTF-8') throw new Error(`invalid encoding ${encoding} in transaction data`);
		transaction.asset.data = data;
	}

	return prepareTransaction(transaction, keys, secondSecret);
}

module.exports = {
	createTransaction,
};
