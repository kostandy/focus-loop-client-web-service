import { DB_NAME, STORE_NAME } from "~/constants/dbConstants";

export enum TaskStatuses {
    notStarted = "not_started",
    inProgress = "in_progress",
    completed = "completed"
}

export interface Task {
    id: string,
    title: string,
    status: TaskStatuses,
    createdAt: string | Date,
}

export interface Response {
    tasks?: Array<Task>,
    nextCursor?: string | null,
    error?: string
}

export interface taskState {
    tasks: Task[],
    isLoading: boolean,
    fetchError: string
}

export const useTaskStore = defineStore('taskStore', {
    state: (): taskState => ({
        tasks: [] as Task[],
        isLoading: false,
        fetchError: ''
    }),
    getters: {
        getTaskById: ({ tasks }: taskState) => (id: Task['id']): Task | undefined => tasks.find(task => task.id === id)
    },
    actions: {
        async fetch() {
            try {
                this.isLoading = true
                // const data = await $fetch<Response>('/api/tasks')

                // this.tasks = data?.tasks || []

                // if (data?.error) {
                //     this.fetchError = data?.error
                // }

                // Load tasks from LocalStorage
                const storedTasks = localStorage.getItem(STORE_NAME);
                const parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : []
                this.tasks =  parsedTasks.sort((a, b) => new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1)
            } catch (error) {
                this.fetchError = error as string
            } finally {
                this.isLoading = false
            }
        },
        async create(newTask: Task) { // For remote tasks adding
            try {
                this.isLoading = true
                const data = await $fetch<Response>('/api/task/create', {
                    method: "post",
                    body: newTask
                })

                this.tasks = data?.tasks || []

                if (data?.error) {
                    this.fetchError = data?.error
                }
            } catch (error) {
                this.fetchError = error as string
            } finally {
                this.isLoading = false
            }
        },
        add(newTask: Task) { // For local tasks adding
            this.tasks = [newTask, ...this.tasks];
            // Save tasks to LocalStorage
            localStorage.setItem(STORE_NAME, JSON.stringify(this.tasks));
        },
        update(id: Task['id'], newTask: Task) {
            const index = this.tasks.findIndex(task => task.id === id);
            
            if (index !== -1) {
                this.tasks[index] = newTask;
                // Save updated tasks to LocalStorage
                localStorage.setItem(STORE_NAME, JSON.stringify(this.tasks));
            }
        }
    }
})