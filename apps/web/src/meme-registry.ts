const BEAR_TAGS = ['bear', 'loss', 'short', 'short-hole', 'short-low', 'ss'] as const;

const BULL_TAGS = ['ath', 'bid', 'bull', 'slow-grind', 'trend', 'uppies'] as const;

const DOUBLE_TOP_TAGS = ['double', 'double-top', 'dt'] as const;

const FTV_TAGS = ['friday', 'ftv'] as const;

const MARKET_TAGS = [
	'chop',
	'margin',
	'margin-call',
	'pa',
	'pa-sucks',
	'pullback',
	'range',
	'slow',
	'volatile'
] as const;

const MISC_TAGS = [
	'awchutally',
	'chad',
	'cobd',
	'debt',
	'fakeout',
	'farley',
	'feel',
	'fool',
	'kermit',
	'namaste',
	'plan',
	'skill-issue',
	'slippage',
	'stream',
	'tea',
	'tilt',
	'trades',
	'yoda'
] as const;

const PLATFORM_TAGS = ['rithmic', 'sierra', 'tradester'] as const;

const PROP_TAGS = ['funded', 'prop'] as const;

const STRATEGY_TAGS = [
	'fvg',
	'ict',
	'onh-fakeout',
	'pattern',
	'stop-run',
	'vwap',
	'wick',
	'wick-test'
] as const;

const SYMBOL_TAGS = ['es', 'nq', 'ym'] as const;

export const TAGS = [
	...BEAR_TAGS,
	...BULL_TAGS,
	...DOUBLE_TOP_TAGS,
	...FTV_TAGS,
	...MARKET_TAGS,
	...MISC_TAGS,
	...PLATFORM_TAGS,
	...PROP_TAGS,
	...STRATEGY_TAGS,
	...SYMBOL_TAGS
] as const;

type MemeTag = (typeof TAGS)[number];

export type Meme = {
	readonly filename: string;
	readonly tags: readonly MemeTag[];
	readonly title: string;
};

export const MEMES = {
	'ahh-shit-ftv-friday': {
		filename: 'ahh-shit-ftv-friday.png',
		tags: ['slow-grind', 'trend', 'ftv', 'friday'],
		title: 'Ahh Shit. FTV.'
	},
	'ahh-shit-the-slow-grind': {
		filename: 'ahh-shit-the-slow-grind.png',
		tags: ['slow-grind', 'trend'],
		title: 'Ahh Shit. The slow grind.'
	},
	'awchutally-prop-deals': {
		filename: 'awchutally-prop-deals.png',
		tags: ['awchutally', 'prop'],
		title: 'Awchutally Prop Deals'
	},
	'cobd-gang': {
		filename: 'cobd-gang.png',
		tags: ['cobd'],
		title: 'C.O.B.D GANG'
	},
	'cobd-sierra': {
		filename: 'cobd-sierra.png',
		tags: ['cobd', 'sierra'],
		title: 'C.O.B.D Sierra'
	},
	'cobd-tradester': {
		filename: 'cobd-tradester.png',
		tags: ['cobd', 'tradester'],
		title: 'C.O.B.D Tradester'
	},
	'double-top': {
		filename: 'double-top.png',
		tags: ['double', 'double-top', 'dt'],
		title: 'Double Top'
	},
	'es-on-vacay': {
		filename: 'es-on-vacay.png',
		tags: ['chop', 'es', 'range', 'slow'],
		title: 'ES on Vacay'
	},
	'feel-aths': {
		filename: 'feel-aths.png',
		tags: ['ath', 'feel'],
		title: 'Feel ATHs'
	},
	'friday-not-ftv': {
		filename: 'friday-not-ftv.png',
		tags: ['friday', 'ftv'],
		title: 'Friday, Not FTV'
	},
	'ftv-friday-with-a-side-of-snow': {
		filename: 'ftv-friday-with-a-side-of-snow.png',
		tags: ['friday', 'ftv'],
		title: 'FTV Friday with a side of snow'
	},
	'ftv-hype': {
		filename: 'ftv-hype.png',
		tags: ['friday', 'ftv'],
		title: 'FTV Hype'
	},
	funded: {
		filename: 'funded.png',
		tags: ['debt', 'funded', 'prop'],
		title: '"Funded"'
	},
	'got-any-ftv': {
		filename: 'got-any-ftv.png',
		tags: ['friday', 'ftv'],
		title: 'Got Any FTV?'
	},
	'got-any-vwap': {
		filename: 'got-any-vwap.png',
		tags: ['vwap'],
		title: 'Got Any VWAP?'
	},
	'i-need-a-beer': {
		filename: 'i-need-a-beer.png',
		tags: ['prop', 'tilt'],
		title: 'I need a beer.'
	},
	'just-keep-trending-swimming': {
		filename: 'just-keep-trending-swimming.png',
		tags: ['bull', 'trend'],
		title: 'Just Keep Trending (Swimming)'
	},
	'lured-in-again': {
		filename: 'lured-in-again.png',
		tags: ['short', 'short-hole', 'short-low', 'ss'],
		title: 'Lured In Again'
	},
	'margin-call': {
		filename: 'margin-call.png',
		tags: ['farley', 'margin', 'margin-call', 'tilt'],
		title: 'Margin Call'
	},
	namaste: {
		filename: 'namaste.png',
		tags: ['chop', 'namaste', 'range'],
		title: 'Namaste'
	},
	'never-wrong-just-early': {
		filename: 'never-wrong-just-early.png',
		tags: ['yoda'],
		title: 'Never Wrong, Just Early'
	},
	'not-so-fast-nq': {
		filename: 'not-so-fast-nq.png',
		tags: ['nq'],
		title: 'Not so fast NQ'
	},
	'nq-meets-ym': {
		filename: 'nq-meets-ym.png',
		tags: ['nq', 'ym', 'yoda'],
		title: 'NQ Meets YM'
	},
	'off-stream-recovery-arc': {
		filename: 'off-stream-recovery-arc.png',
		tags: ['loss', 'stream'],
		title: 'Off-Stream Recovery Arc'
	},
	'ol-reliable': {
		filename: 'ol-reliable.png',
		tags: ['friday', 'ftv'],
		title: "Ol' Reliable"
	},
	'one-simply-waits-for-stop-run': {
		filename: 'one-simply-waits-for-stop-run.png',
		tags: ['stop-run'],
		title: 'One simply waits for stop-run'
	},
	'patterns-work-trust-me-bro': {
		filename: 'patterns-work-trust-me-bro.png',
		tags: ['fvg', 'ict', 'pattern', 'tilt'],
		title: 'Patterns Work...Trust me bro'
	},
	'price-action-is-not-real': {
		filename: 'price-action-is-not-real.png',
		tags: ['pa', 'volatile'],
		title: 'Price Action is NOT Real'
	},
	'prop-firm-evangelist': {
		filename: 'prop-firm-evangelist.png',
		tags: ['prop'],
		title: 'Prop Firm Evangelist'
	},
	'pullback-for-the-love-of-god': {
		filename: 'pullback-for-the-love-of-god.png',
		tags: ['farley', 'pullback'],
		title: 'Pullback...FOR THE LOVE OF GOD'
	},
	'self-sabotage': {
		filename: 'self-sabotage.png',
		tags: ['short', 'short-hole', 'short-low', 'ss'],
		title: 'Self Sabotage'
	},
	'sierra-hero': {
		filename: 'sierra-hero.png',
		tags: ['sierra'],
		title: 'Sierra Hero'
	},
	'sippin-tea': {
		filename: 'sippin-tea.png',
		tags: ['bear', 'kermit', 'tea'],
		title: 'Sippin Tea'
	},
	'smart-vs-dumb-bear': {
		filename: 'smart-vs-dumb-bear.png',
		tags: ['bear', 'fakeout', 'onh-fakeout', 'short', 'short-low', 'ss'],
		title: 'Smart vs Dumb Bear'
	},
	'thanks-rithmic': {
		filename: 'thanks-rithmic.png',
		tags: ['rithmic', 'slippage'],
		title: 'Thanks, Rithmic'
	},
	'that-friday-feeling': {
		filename: 'that-friday-feeling.png',
		tags: ['feel', 'friday'],
		title: 'That Friday Feeling'
	},
	'that-vwap-feeling': {
		filename: 'that-vwap-feeling.png',
		tags: ['feel', 'vwap'],
		title: 'That VWAP Feeling'
	},
	'the-most-interesting-hole-shorter': {
		filename: 'the-most-interesting-hole-shorter.png',
		tags: ['short', 'short-hole', 'short-low', 'ss'],
		title: 'The most interesting hole-shorter'
	},
	'the-return-of-the-vwap': {
		filename: 'the-return-of-the-vwap.png',
		tags: ['vwap'],
		title: 'The Return of The VWAP'
	},
	'the-uppies-are-coming': {
		filename: 'the-uppies-are-coming.png',
		tags: ['bull', 'trend', 'uppies'],
		title: 'The Uppies Are Coming'
	},
	'turbo-bid-engaged': {
		filename: 'turbo-bid-engaged.png',
		tags: ['bid', 'bull'],
		title: 'Turbo Bid...Engaged'
	},
	'v-w-a-p': {
		filename: 'v-w-a-p.png',
		tags: ['vwap'],
		title: 'V W A P !'
	},
	vwap: {
		filename: 'vwap.png',
		tags: ['vwap'],
		title: 'VWAP.'
	},
	'vwap-chad': {
		filename: 'vwap-chad.png',
		tags: ['chad', 'ict', 'vwap'],
		title: 'VWAP Chad'
	},
	'vwap-maxxer': {
		filename: 'vwap-maxxer.png',
		tags: ['chad', 'fvg', 'ict', 'vwap'],
		title: 'VWAP Maxxer'
	},
	'we-no-fool': {
		filename: 'we-no-fool.png',
		tags: ['fool'],
		title: 'We No Fool'
	},
	'wick-test': {
		filename: 'wick-test.png',
		tags: ['wick', 'wick-test'],
		title: 'Wick Test.'
	}
} as const satisfies Record<string, Meme>;
