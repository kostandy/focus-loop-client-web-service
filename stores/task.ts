export interface Task {
    title: string
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
        async fetch() {
            try {
                this.isLoading = true
                const data = await $fetch<Response>('/api/tasks')

                this.tasks = data?.tasks || []
                    
                if (data?.error) {
                    this.fetchError = data?.error
                }
            } catch (error) {
                this.fetchError = error as string
            } finally {
                this.isLoading = false
            }
        }
    }
})