import { apiClient } from "@/api/client";

export const aiService = {
    async suggestCode(code, language) {
        const { data } = await apiClient.post("/ai/suggest", { code, language });
        return data?.suggestion || "";
    },
};
