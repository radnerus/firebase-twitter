import * as functions from 'firebase-functions';
// import Twitter from 'twitter-lite';
const Twitter = require('twitter-lite');
const twitterConfig =
	process.env.NODE_ENV === 'production'
		? {
				consumer_key: functions.config().twitter.consumer_key,
				consumer_secret: functions.config().twitter.consumer_secret,
				access_token_key: functions.config().twitter.access_token_key,
				access_token_secret: functions.config().twitter.access_token_secret
		  }
		: require('../twitter.json');

console.log(twitterConfig);

const client = new Twitter(twitterConfig);

let prevFollowerCount = 0;

const NUMBER_MAP: { [key: string]: string } = {
	'0': '0️⃣',
	'1': '1️⃣',
	'2': '2️⃣',
	'3': '3️⃣',
	'4': '4️⃣',
	'5': '5️⃣',
	'6': '6️⃣',
	'7': '7️⃣',
	'8': '8️⃣',
	'9': '9️⃣'
};

const getFormattedNumbers = (number: number) => {
	return String(number)
		.split('')
		.map((e) => NUMBER_MAP[e])
		.join('');
};

const login = async () => {
	try {
		await client.get('account/verify_credentials');
		console.log('Logged in successfully.');
	} catch (error) {
		console.error(error);
	}
};
export const updateUserName = async () => {
	try {
		// const followers = await client.get('followers/ids', {
		// 	screen_name: 'radnerus93'
		// });
		// const followersCount = followers.ids.length;
		const user = await client.get('account/verify_credentials');
		const followersCount = user.followers_count;

		if (prevFollowerCount === followersCount) {
			console.log(`No new followers still at ${prevFollowerCount}`);
			return;
		}

		prevFollowerCount = followersCount;
		const displayName = '🆂🆄🆁🅴🅽 | 👨🏻‍💻 ';

		const newUserName = `${displayName} \| ${getFormattedNumbers(
			followersCount
		)}`;

		console.log(
			`Current Username @ ${new Date()} is ${newUserName} ${followersCount}`
		);

		await client.post('account/update_profile', {
			name: newUserName
		});
	} catch (error) {
		console.error(error);
	}
};

const initScript = () => {
	login()
		.then(() => updateUserName())
		.catch((e) => console.error(e));
};

initScript();
