import { type Task, TaskStatuses } from '@/@types/tasks';

export interface Response {
	tasks?: Array<Task>;
	nextCursor?: string | null;
	error?: string;
}

export interface taskState {
	tasks: Task[];
	isLoading: boolean;
	fetchError: string;
}

const STORE_NAME = 'tasks';

export const useTaskStore = defineStore('taskStore', {
	state: (): taskState => ({
		tasks: [] as Task[],
		isLoading: false,
		fetchError: '',
	}),

	getters: {
		getTaskById:
			({ tasks }: taskState) =>
			(id: Task['id']): Task | undefined =>
				tasks.find((task) => task.id === id),
		hasActiveTask: ({ tasks }: taskState) => !!tasks.find((task) => task.status === TaskStatuses.inProgress),
		getActiveAndWaitingTasks: ({ tasks }: taskState) =>
			tasks.filter((task) => task.status === TaskStatuses.notStarted || task.status === TaskStatuses.inProgress),
		getCompletedTasks: ({ tasks }: taskState) => tasks.filter((task) => task.status === TaskStatuses.completed),
		getImportantAndUrgentTasks: ({ tasks }: taskState) =>
			tasks.filter((task) => task.status !== TaskStatuses.completed && task.isImportant && task.isUrgent),
		getImportantAndNotUrgentTasks: ({ tasks }: taskState) =>
			tasks.filter((task) => task.status !== TaskStatuses.completed && task.isImportant && !task.isUrgent),
		getUrgentAndNotImportantTasks: ({ tasks }: taskState) =>
			tasks.filter((task) => task.status !== TaskStatuses.completed && task.isUrgent && !task.isImportant),
		getNotImportantAndNotUrgentTasks: ({ tasks }: taskState) =>
			tasks.filter((task) => task.status !== TaskStatuses.completed && !task.isImportant && !task.isUrgent),
		getSortedTasks: ({ tasks }: taskState) => {
			const inProgress: Task[] = [];
			const notStarted: Task[] = [];
			const completed: Task[] = [];

			// Categorize tasks
			tasks.forEach((task) => {
				if (task.status === TaskStatuses.inProgress) {
					inProgress.push(task);
				} else if (task.status === TaskStatuses.notStarted) {
					notStarted.push(task);
				} else if (task.status === TaskStatuses.completed) {
					completed.push(task);
				}
			});

			// TODO: Sort by urgency and importance as well

			// Sort each category
			notStarted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			completed.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

			// Combine sorted categories
			return [...inProgress, ...notStarted, ...completed];
		},
	},

	actions: {
		async fetch() {
			try {
				this.isLoading = true;

				const storedTasks = loadFromLocalStorage(STORE_NAME) ?? [];
				const parsedTasks: Task[] = storedTasks.map(
					(task: Task): Task => ({
						...task,
						// Ensure all fields are present, defaulting to appropriate values if missing
						id: task.id || generateId(),
						title: task.title || '',
						createdAt: task.createdAt || new Date(),
						status: task.status || TaskStatuses.notStarted,
						startedAt: task.startedAt || '',
						completedAt: task.completedAt || '',
						isUrgent: task.isUrgent || false,
						isImportant: task.isImportant || false,
					}),
				);
				this.tasks = parsedTasks.sort((a, b) => (new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1));
			} catch (error) {
				this.fetchError = error as string;
			} finally {
				this.isLoading = false;
			}
		},
		async create(newTask: Task) {
			// For remote tasks adding
			try {
				this.isLoading = true;
				const data = await $fetch<Response>('/api/task/create', {
					method: 'post',
					body: newTask,
				});

				this.tasks = data?.tasks || [];

				if (data?.error) {
					this.fetchError = data?.error;
				}
			} catch (error) {
				this.fetchError = error as string;
			} finally {
				this.isLoading = false;
			}
		},
		add(newTask: Task) {
			// For local tasks adding
			this.tasks = [newTask, ...this.tasks];
			saveToLocalStorage(STORE_NAME, this.tasks);
		},
		update(id: Task['id'], newTask: Task) {
			const index = this.tasks.findIndex((task) => task.id === id);

			if (index !== -1) {
				this.tasks[index] = newTask;
				saveToLocalStorage(STORE_NAME, this.tasks);
			}
		},
		remove(id: Task['id']) {
			this.tasks = this.tasks.filter((task) => task.id !== id);
			saveToLocalStorage(STORE_NAME, this.tasks);
		},
		updateStatusWithDates(id: Task['id'], newStatus: TaskStatuses) {
			const task = this.getTaskById(id);
			if (!task) return;

			const updatedTask = { ...task, status: newStatus };

			if (newStatus === TaskStatuses.inProgress) {
				updatedTask.startedAt = new Date();
			} else if (newStatus === TaskStatuses.completed) {
				updatedTask.completedAt = new Date();
			}

			this.update(id, updatedTask);
		},
	},
});
