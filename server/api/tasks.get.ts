// Note: More likely will be reused across the app in the near future
interface Response {
	tasks?: Array<object>;
	nextCursor?: string | null;
	error?: string;
}

export default defineEventHandler(async (): Promise<Response> => {
	try {
		console.log('aknowledged incoming request, trying to fetch external API');

		const response: Response = await $fetch('http://localhost:3073/api/tasks');

		console.log('response received', response.tasks);

		return {
			tasks: response.tasks,
		};
	} catch (error) {
		console.error(error);

		return {
			error: 'Failed to fetch data',
		};
	}
});
