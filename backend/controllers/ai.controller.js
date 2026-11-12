const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const suggestCode = async (req, res) => {
    const { code, language } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: "GROQ_API_KEY is not set on the server" });
    }
    if (!code || !code.trim()) {
        return res.status(400).json({ message: "Write some code first" });
    }

    try {
        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
                temperature: 0.2,
                messages: [
                    {
                        role: "system",
                        content: "You complete code. Reply with only the full completed code, no explanation.",
                    },
                    {
                        role: "user",
                        content: `Language: ${language || "javascript"}\nComplete this code:\n\n${code}`,
                    },
                ],
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ message: data?.error?.message || "AI request failed" });
        }

        res.json({ suggestion: data?.choices?.[0]?.message?.content || "" });
    } catch (error) {
        console.error("Error in suggestCode:", error);
        res.status(500).json({ message: "AI request failed" });
    }
};
