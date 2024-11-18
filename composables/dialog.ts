export const useDialog = (key = 'default') => {
    return useState(`${key}-dialog`, () => ({
        isVisible: false,
        isLoading: false
    }))
}