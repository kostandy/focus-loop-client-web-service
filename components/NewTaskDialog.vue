<script setup lang="ts">
export interface Props {
    isVisible: boolean,
    isLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['submit', 'close'])
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const form = useTemplateRef<HTMLFormElement>('form')
const title = ref('')

watch(() => props.isVisible, (newVal) => {
    if (newVal) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
});

const closeDialog = () => emit('close')

const submitForm = () => {
    const isValid = form.value?.checkValidity()

    if (isValid) {
        emit('submit', {
            id: generateId(),
            title: title.value
        } as Task)

        // Reset the modal's state, cause it's not getting destroyed when closed
        title.value = ''
    } else {
        form.value?.reportValidity()
    }
}

</script>

<template>
    <!-- TODO: Here's a bug when ESC is pressed -->
    <dialog class="modal" ref="dialog">
        <form class="form" ref="form" method="dialog" @submit.prevent="submitForm">
            <label class="label">
                <span class="label__text">Title</span>
                <input v-model="title" name="title" placeholder="Enter the title of a new task" type="text" required />
            </label>

            <div class="row">
                <button :disabled="isLoading" type="button" @click="submitForm">
                    <template v-if="isLoading">
                        Creating your task...
                    </template>

                    <template v-else>
                        Create a task
                    </template>
                </button>

                <button type="button" formnovalidate @click="closeDialog">Close</button>
            </div>
        </form>

    </dialog>
</template>

<style scoped>
.modal {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    border-radius: 16px;
    min-width: 300px;
}

.form {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
}

.label {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
}

.label__text {
    margin-bottom: 8px;
}
</style>