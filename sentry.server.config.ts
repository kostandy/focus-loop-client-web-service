import * as Sentry from '@sentry/nuxt';

Sentry.init({
	dsn: 'https://1a7538b318614e03f9b00146fcd95f23@o4508404952530944.ingest.de.sentry.io/4508404954628176',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
