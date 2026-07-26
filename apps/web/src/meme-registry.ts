export const TAGS = [
	'agreement',
	'alert',
	'all-time-high',
	'batman',
	'bear',
	'bear-trap',
	'bid',
	'blown-account',
	'breakout',
	'bull',
	'bull-trend',
	'buy-low',
	'cartman',
	'chad',
	'chart-pattern',
	'chat',
	'chop',
	'citadel',
	'cobd',
	'community',
	'conviction',
	'copium',
	'correlation',
	'debt',
	'disappointment',
	'disbelief',
	'discipline',
	'discount',
	'double-top',
	'drake-and-josh',
	'draw-25',
	'drawdown',
	'early-entry',
	'elmo',
	'emotions',
	'enthusiast',
	'entry',
	'es',
	'execution',
	'fade',
	'fakeout',
	'fire',
	'friday',
	'frustration',
	'ftv-friday',
	'funded-trader',
	'fvg',
	'hector',
	'help',
	'ict',
	'joke',
	'loss',
	'margin-call',
	'market-mood',
	'market-vibe',
	'markets-closed',
	'mean-reversion',
	'memes',
	'momentum',
	'namaste',
	'nq',
	'overtrading',
	'paul-revere',
	'permabear',
	'permabull',
	'price-action',
	'profit',
	'programmer',
	'prop-firm',
	'pullback',
	'range',
	'reaction',
	'recovery',
	'repeat',
	'request',
	'return',
	'risk',
	'rithmic',
	'routine',
	'setup',
	'shorting',
	'shorting-lows',
	'sierra-chart',
	'sign',
	'skill-issue',
	'slippage',
	'slow-grind',
	'slow-market',
	'spongebob',
	'stop-run',
	'streaming',
	'success',
	'timing',
	'tradester',
	'trading-plan',
	'trailer-park-boys',
	'trend',
	'trend-day',
	'uppies',
	'vwap',
	'waiting',
	'weekdays',
	'wick-test',
	'ym',
	'yoda'
] as const;

type MemeTag = (typeof TAGS)[number];

export type Meme = {
	readonly path: string;
	readonly tags: readonly MemeTag[];
	readonly title: string;
};

export const MEMES = {
	'acting-weak-programmer-getting-rich': {
		path: '/acting-weak-programmer-getting-rich.png',
		tags: ['profit', 'programmer', 'reaction'],
		title: 'NQ Acting Weak'
	},
	'another-all-time-high-day': {
		path: '/another-all-time-high-day.png',
		tags: ['all-time-high', 'bull', 'trend-day'],
		title: 'Casual New High'
	},
	'bear-day-chat-none-of-my-business': {
		path: '/bear-day-chat-none-of-my-business.png',
		tags: ['bear', 'chat', 'reaction'],
		title: 'Not My Bear Day'
	},
	'breakout-chart-pattern-emotions': {
		path: '/breakout-chart-pattern-emotions.png',
		tags: ['breakout', 'chart-pattern', 'emotions'],
		title: 'Breakout Therapy Session'
	},
	'bro-vwap': {
		path: '/bro-vwap.png',
		tags: ['ftv-friday', 'friday', 'disappointment'],
		title: 'Friday, Not FTV'
	},
	'bulls-bears-just-keep-swimming': {
		path: '/bulls-bears-just-keep-swimming.png',
		tags: ['bull', 'bear', 'trend'],
		title: 'Just Keep Trading'
	},
	'cartman-four-point-sierra-plan': {
		path: '/cartman-four-point-sierra-plan.png',
		tags: ['sierra-chart', 'trading-plan', 'cartman'],
		title: 'Sierra Speedrun'
	},
	'cartman-four-point-tradester-plan': {
		path: '/cartman-four-point-tradester-plan.png',
		tags: ['tradester', 'trading-plan', 'cartman'],
		title: 'Tradester Speedrun'
	},
	'chop-for-dummies-buy-low-sell-high': {
		path: '/chop-for-dummies-buy-low-sell-high.png',
		tags: ['chop', 'range', 'buy-low'],
		title: 'Chop for Dummies'
	},
	'chop-for-dummies-dont-trade-all-time': {
		path: '/chop-for-dummies-dont-trade-all-time.png',
		tags: ['chop', 'discipline', 'overtrading'],
		title: 'Maybe Just Sit Out'
	},
	'cobd-till-i-die': {
		path: '/cobd-till-i-die.png',
		tags: ['cobd', 'setup', 'conviction'],
		title: 'COBD Till I Die'
	},
	'diagnosis-skill-issue-pa-sucks': {
		path: '/diagnosis-skill-issue-pa-sucks.png',
		tags: ['trend-day', 'fade', 'discipline'],
		title: 'Quit Fading It'
	},
	'dont-short-the-hole-market-vibe': {
		path: '/dont-short-the-hole-market-vibe.png',
		tags: ['shorting-lows', 'bear', 'market-vibe'],
		title: 'Hands Off the Lows'
	},
	'drake-and-josh-vwap': {
		path: '/drake-and-josh-vwap.png',
		tags: ['vwap', 'drake-and-josh', 'reaction'],
		title: 'VWAP? Interesting'
	},
	'drake-and-josh-wick-test': {
		path: '/drake-and-josh-wick-test.png',
		tags: ['wick-test', 'drake-and-josh', 'setup'],
		title: 'Wick Test? Interesting'
	},
	'eat-sleep-vwap-repeat': {
		path: '/eat-sleep-vwap-repeat.png',
		tags: ['vwap', 'routine', 'repeat'],
		title: 'Eat Sleep VWAP'
	},
	'enter-before-the-stop-run': {
		path: '/enter-before-the-stop-run.png',
		tags: ['stop-run', 'entry', 'timing'],
		title: 'One Tick Too Soon'
	},
	'enter-on-stop-run-enthusiast': {
		path: '/enter-on-stop-run-enthusiast.png',
		tags: ['stop-run', 'entry', 'enthusiast'],
		title: 'Stop Run Enjoyer'
	},
	'es-taking-it-easy-today': {
		path: '/es-taking-it-easy-today.png',
		tags: ['es', 'slow-market', 'chop'],
		title: 'ES on Vacation'
	},
	'fakeout-bear-short-the-low-bear': {
		path: '/fakeout-bear-short-the-low-bear.png',
		tags: ['fakeout', 'bear', 'shorting-lows'],
		title: 'The Low Looked Shortable'
	},
	'favorite-prop-firm-urinal-joke': {
		path: '/favorite-prop-firm-urinal-joke.png',
		tags: ['prop-firm', 'funded-trader', 'joke'],
		title: 'Prop Firm Evangelist'
	},
	'feel-that-thats-friday': {
		path: '/feel-that-thats-friday.png',
		tags: ['friday', 'reaction', 'market-mood'],
		title: 'Feel That? Friday'
	},
	'feel-that-thats-vwap': {
		path: '/feel-that-thats-vwap.png',
		tags: ['vwap', 'reaction', 'market-mood'],
		title: 'Feel That? VWAP'
	},
	'for-the-love-of-god-pullback': {
		path: '/for-the-love-of-god-pullback.png',
		tags: ['pullback', 'trend', 'waiting'],
		title: 'Please Just Pull Back'
	},
	'friday-but-not-ftv-friday': {
		path: '/friday-but-not-ftv-friday.png',
		tags: ['prop-firm', 'blown-account', 'markets-closed'],
		title: 'Post-Close Productivity'
	},
	'ftv-friday-screaming': {
		path: '/ftv-friday-screaming.png',
		tags: ['ftv-friday', 'friday', 'reaction'],
		title: 'FTV Friday!'
	},
	'funded-trader-credit-card-debt': {
		path: '/funded-trader-credit-card-debt.png',
		tags: ['funded-trader', 'prop-firm', 'debt'],
		title: 'Funded, Technically'
	},
	'got-any-ftv-friday-today': {
		path: '/got-any-ftv-friday-today.png',
		tags: ['ftv-friday', 'friday', 'request'],
		title: 'Got Any FTV?'
	},
	'got-any-more-of-those-vwaps': {
		path: '/got-any-more-of-those-vwaps.png',
		tags: ['vwap', 'request', 'reaction'],
		title: 'Got Any VWAP?'
	},
	'holey-moley-chopamoley': {
		path: '/holey-moley-chopamoley.png',
		tags: ['chop', 'range', 'reaction'],
		title: 'Holey Moley, Chopamoley'
	},
	'i-shorted-the-hole-dad': {
		path: '/i-shorted-the-hole-dad.png',
		tags: ['shorting-lows', 'discipline', 'bull-trend'],
		title: 'Stop Shorting Above ONH'
	},
	'ict-simp-vwap-chad': {
		path: '/ict-simp-vwap-chad.png',
		tags: ['ict', 'vwap', 'chad'],
		title: 'VWAP Chad'
	},
	'lured-into-shorting-lows-again': {
		path: '/lured-into-shorting-lows-again.png',
		tags: ['shorting-lows', 'bear-trap', 'loss'],
		title: 'Lured In Again'
	},
	'made-back-losses-off-stream': {
		path: '/made-back-losses-off-stream.png',
		tags: ['loss', 'recovery', 'streaming'],
		title: 'Off-Stream Recovery Arc'
	},
	'margin-department-is-calling': {
		path: '/margin-department-is-calling.png',
		tags: ['margin-call', 'loss', 'risk'],
		title: 'Margin Is Calling'
	},
	'markets-closed-blew-sixteen-pas': {
		path: '/markets-closed-blew-sixteen-pas.png',
		tags: ['nq', 'vwap', 'alert'],
		title: 'NQ at VWAP'
	},
	'me-and-the-drawdown-reaper': {
		path: '/me-and-the-drawdown-reaper.png',
		tags: ['drawdown', 'loss', 'risk'],
		title: 'My Drawdown Reaper'
	},
	'memes-are-like-my-family': {
		path: '/memes-are-like-my-family.png',
		tags: ['memes', 'community', 'reaction'],
		title: 'Memes Are Family'
	},
	'my-trading-plan-vs-actual-trades': {
		path: '/my-trading-plan-vs-actual-trades.png',
		tags: ['permabull', 'permabear', 'bull', 'bear'],
		title: 'Dual Mandate'
	},
	'namaste-today-is-chop-day': {
		path: '/namaste-today-is-chop-day.png',
		tags: ['chop', 'range', 'namaste'],
		title: 'Namaste, It Is Chop'
	},
	'never-ask-trader-if-they-faded-trend-day': {
		path: '/never-ask-trader-if-they-faded-trend-day.png',
		tags: ['trading-plan', 'discipline', 'execution'],
		title: 'The Plan vs Me'
	},
	'never-wrong-just-early-yoda': {
		path: '/never-wrong-just-early-yoda.png',
		tags: ['early-entry', 'yoda', 'copium'],
		title: 'Early, Never Wrong'
	},
	'nq-trader-vs-ym-trader-yoda': {
		path: '/nq-trader-vs-ym-trader-yoda.png',
		tags: ['nq', 'ym', 'yoda'],
		title: 'NQ Meets YM'
	},
	'once-again-returning-to-vwap': {
		path: '/once-again-returning-to-vwap.png',
		tags: ['vwap', 'mean-reversion', 'return'],
		title: 'Back to VWAP'
	},
	'one-does-not-short-the-hole': {
		path: '/one-does-not-short-the-hole.png',
		tags: ['shorting-lows', 'bear', 'discipline'],
		title: 'One Does Not Short'
	},
	'permabull-vs-permabear-work-rules': {
		path: '/permabull-vs-permabear-work-rules.png',
		tags: ['double-top', 'shorting', 'success'],
		title: 'Wake Up, It Worked'
	},
	'please-stop-shorting-double-top': {
		path: '/please-stop-shorting-double-top.png',
		tags: ['double-top', 'shorting', 'discipline'],
		title: 'Please Stop Shorting'
	},
	'presidential-alert-nq-at-vwap': {
		path: '/presidential-alert-nq-at-vwap.png',
		tags: ['shorting-lows', 'bear', 'loss'],
		title: 'I Shorted the Hole'
	},
	'print-vwap-dont-say-the-f-word': {
		path: '/print-vwap-dont-say-the-f-word.png',
		tags: ['vwap', 'ftv-friday', 'reaction'],
		title: 'Print VWAP, Stay Clean'
	},
	'prop-firm-discount-isnt-a-good-deal': {
		path: '/prop-firm-discount-isnt-a-good-deal.png',
		tags: ['prop-firm', 'discount', 'funded-trader'],
		title: 'The Discount Trap'
	},
	'range-trading-sucks-actually': {
		path: '/range-trading-sucks-actually.png',
		tags: ['range', 'chop', 'frustration'],
		title: 'Range Trading Enjoyer'
	},
	'rithmic-slippage-citadel-career': {
		path: '/rithmic-slippage-citadel-career.png',
		tags: ['rithmic', 'slippage', 'citadel'],
		title: 'Thanks, Rithmic'
	},
	'short-another-day-or-draw-25': {
		path: '/short-another-day-or-draw-25.png',
		tags: ['shorting', 'draw-25', 'discipline'],
		title: 'Draw 25'
	},
	'short-the-lows-entering-cc-info': {
		path: '/short-the-lows-entering-cc-info.png',
		tags: ['shorting-lows', 'bear', 'entry'],
		title: 'Entering Card Details'
	},
	'shut-up-hector': {
		path: '/shut-up-hector.png',
		tags: ['hector', 'reaction', 'chat'],
		title: 'Shut Up, Hector'
	},
	'sierra-chart-help-batman': {
		path: '/sierra-chart-help-batman.png',
		tags: ['sierra-chart', 'help', 'batman'],
		title: 'Sierra Needs a Hero'
	},
	'slow-grind-ftv-friday': {
		path: '/slow-grind-ftv-friday.png',
		tags: ['ftv-friday', 'slow-grind', 'friday'],
		title: 'Friday Crawl'
	},
	'slow-grind-here-we-go-again': {
		path: '/slow-grind-here-we-go-again.png',
		tags: ['slow-grind', 'trend', 'reaction'],
		title: 'The Grind Returns'
	},
	'spongebob-going-up-on-ftv-friday': {
		path: '/spongebob-going-up-on-ftv-friday.png',
		tags: ['ftv-friday', 'spongebob', 'bull'],
		title: 'Friday Uppies'
	},
	'stop-fading-trend-days': {
		path: '/stop-fading-trend-days.png',
		tags: ['double-top', 'shorting', 'reaction'],
		title: 'Babe, Double Top'
	},
	'stop-shorting-the-lows-toughest-battle': {
		path: '/stop-shorting-the-lows-toughest-battle.png',
		tags: ['shorting-lows', 'discipline', 'bear'],
		title: 'Lows Are Lava'
	},
	'stop-trying-to-short-the-low': {
		path: '/stop-trying-to-short-the-low.png',
		tags: ['trend-day', 'fade', 'loss'],
		title: 'Did You Fade It?'
	},
	'take-fvg-with-correlation': {
		path: '/take-fvg-with-correlation.png',
		tags: ['fvg', 'correlation', 'ict'],
		title: 'Correlated FVG Enjoyer'
	},
	'that-chop-was-really-choppy': {
		path: '/that-chop-was-really-choppy.png',
		tags: ['chop', 'range', 'reaction'],
		title: 'Premium Grade Chop'
	},
	'that-vwap-feeling': {
		path: '/that-vwap-feeling.png',
		tags: ['vwap', 'market-mood', 'reaction'],
		title: 'That VWAP Feeling'
	},
	'the-uppies-are-coming-paul-revere': {
		path: '/the-uppies-are-coming-paul-revere.png',
		tags: ['bull', 'uppies', 'paul-revere'],
		title: 'The Uppies Are Coming'
	},
	'this-price-action-is-not-real': {
		path: '/this-price-action-is-not-real.png',
		tags: ['price-action', 'disbelief', 'reaction'],
		title: 'This Tape Is Fake'
	},
	'trailer-park-boys-handshake': {
		path: '/trailer-park-boys-handshake.png',
		tags: ['trailer-park-boys', 'reaction', 'agreement'],
		title: 'A Fair Trade'
	},
	'turbo-bid-engaged': {
		path: '/turbo-bid-engaged.png',
		tags: ['bull', 'bid', 'momentum'],
		title: 'Turbo Bid Engaged'
	},
	'vwap-chop-doesnt-exist-down-here': {
		path: '/vwap-chop-doesnt-exist-down-here.png',
		tags: ['vwap', 'chop', 'bear'],
		title: 'No VWAP Down Here'
	},
	'vwap-elmo-fire': {
		path: '/vwap-elmo-fire.png',
		tags: ['vwap', 'elmo', 'fire'],
		title: 'VWAP Is Lit'
	},
	'vwap-is-beautiful-five-hours': {
		path: '/vwap-is-beautiful-five-hours.png',
		tags: ['vwap', 'waiting', 'reaction'],
		title: 'VWAP Is Beautiful'
	},
	'wake-up-double-top-finally-worked': {
		path: '/wake-up-double-top-finally-worked.png',
		tags: ['skill-issue', 'price-action', 'loss'],
		title: 'Diagnosis: Skill Issue'
	},
	'we-no-fool-sign': {
		path: '/we-no-fool-sign.png',
		tags: ['discipline', 'sign', 'reaction'],
		title: 'We No Fool'
	},
	'weekdays-then-ftv-friday': {
		path: '/weekdays-then-ftv-friday.png',
		tags: ['ftv-friday', 'weekdays', 'friday'],
		title: 'Then Comes FTV Friday'
	}
} as const satisfies Record<string, Meme>;
