import { init as sentryInit } from '@sentry/nuxt';

sentryInit({
	// If set up, you can use your runtime config here
	// dsn: useRuntimeConfig().public.sentry.dsn,
	dsn: useRuntimeConfig().public.sentry.dsn,

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,

	release: useRuntimeConfig().public.sentry.release,

	environment: process.env.NODE_ENV === 'production' ? 'production' : 'localhost',
});
