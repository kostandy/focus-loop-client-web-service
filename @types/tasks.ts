export enum TaskStatuses {
	notStarted = 'not_started',
	inProgress = 'in_progress',
	completed = 'completed',
}

export interface Task {
	id: string;
	title: string;
	status: TaskStatuses;
	createdAt: string | Date;
	startedAt: string | Date;
	completedAt: string | Date;
	isImportant: boolean;
	isUrgent: boolean;
}
