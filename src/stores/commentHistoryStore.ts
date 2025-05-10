import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

export const useCommentHistoryStore = defineStore('commentHistory', () => {
  const comments = ref<Comment[]>([]);

  const handleAddComment = (comment: Comment): void => {
    comments.value.push(comment);
  };

  const handleGetComments = (): Comment[] => {
    return comments.value;
  };

  const handleClearHistory = (): void => {
    comments.value = [];
  };

  return {
    comments: computed(() => comments.value),
    handleAddComment,
    handleGetComments,
    handleClearHistory,
  };
});
