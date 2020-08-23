import * as functions from 'firebase-functions';
import { updateUserName } from './twitter.js';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const twitterCron = functions.pubsub
	.schedule('*/1 * * * *')
	.onRun(async (_) => {
		await updateUserName();
		return null;
	});

export const twitterCronTest = functions.https.onRequest(async (req, res) => {
	await updateUserName();
	res.sendStatus(200);
});
