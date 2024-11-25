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
    actions: {
        async initializeDB() {
            await initializeDatabase();
        },
        async fetch() {
            await this.initializeDB();

            const { loadTasks } = useIndexedDB(DB_NAME, STORE_NAME)

            try {
                this.isLoading = true
                // const data = await $fetch<Response>('/api/tasks')

                // this.tasks = data?.tasks || []
                    
                // if (data?.error) {
                //     this.fetchError = data?.error
                // }

                // Important note: This is a workaround unless remote API is implemented
                const data = await loadTasks();

                console.log('data', data);

                this.tasks = data;
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
            this.tasks.push(newTask);

            const { saveTasks } = useIndexedDB('TaskDB', 'tasks')

            saveTasks(toRaw(this.tasks))
        }
    }
})