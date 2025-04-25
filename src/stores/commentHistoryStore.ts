import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommentHistoryStore = defineStore('commentHistory', () => {
  const commentHistory = ref<string[]>([])

  function addComment(comment: string) {
    if (!comment.trim()) return

    // Remove the comment if it already exists to avoid duplicates
    const index = commentHistory.value.indexOf(comment)
    if (index !== -1) {
      commentHistory.value.splice(index, 1)
    }

    // Add the comment to the beginning of the array
    commentHistory.value.unshift(comment)

    // Keep only the last 10 comments
    if (commentHistory.value.length > 10) {
      commentHistory.value.pop()
    }
  }

  function getComments() {
    return commentHistory.value
  }

  function clearHistory() {
    commentHistory.value = []
  }

  return {
    commentHistory,
    addComment,
    getComments,
    clearHistory
  }
})
