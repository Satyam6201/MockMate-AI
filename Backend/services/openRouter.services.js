import axios from 'axios';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1 second base delay for exponential backoff

/**
 * Senior-grade AI caller with:
 * - Exponential backoff retries (3 attempts)
 * - 30s per-request timeout
 * - Proper error classification (rate limit, network, empty response)
 * - Fallback-friendly error messages
 */
export const askAi = async (messages, retryCount = 0) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        throw new Error("AI_INVALID_INPUT: messages array is empty or invalid");
    }

    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("AI_CONFIG_ERROR: OPENROUTER_API_KEY is not set in environment");
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-4o-mini',
                messages: messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:8080',
                    'X-Title': 'MockMate AI',
                },
                timeout: 30000, // 30 second timeout per request
            }
        );

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
            throw new Error("AI_EMPTY_RESPONSE: AI returned an empty or null response");
        }

        return content.trim();

    } catch (error) {
        const status = error.response?.status;
        const errData = error.response?.data;

        // Log detailed error for debugging
        console.error(`[OpenRouter] Error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, {
            status,
            message: error.message,
            data: errData,
        });

        // === Determine if we should retry ===

        // Rate limit (429) — wait and retry
        if (status === 429 && retryCount < MAX_RETRIES - 1) {
            const delay = BASE_DELAY_MS * Math.pow(2, retryCount); // 1s, 2s, 4s
            console.warn(`[OpenRouter] Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return askAi(messages, retryCount + 1);
        }

        // Transient server errors (500, 502, 503) — retry
        if ([500, 502, 503].includes(status) && retryCount < MAX_RETRIES - 1) {
            const delay = BASE_DELAY_MS * Math.pow(2, retryCount);
            console.warn(`[OpenRouter] Server error ${status}. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return askAi(messages, retryCount + 1);
        }

        // Network timeout — retry once
        if (error.code === 'ECONNABORTED' && retryCount < MAX_RETRIES - 1) {
            console.warn(`[OpenRouter] Request timed out. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, BASE_DELAY_MS));
            return askAi(messages, retryCount + 1);
        }

        // === Non-retryable errors — throw with clear message ===
        if (status === 401) {
            throw new Error("AI_AUTH_ERROR: Invalid OpenRouter API key. Check your OPENROUTER_API_KEY.");
        }
        if (status === 402) {
            throw new Error("AI_QUOTA_EXCEEDED: OpenRouter account quota exceeded. Top up credits.");
        }
        if (status === 400) {
            throw new Error(`AI_BAD_REQUEST: ${errData?.error?.message || "Invalid request to AI"}`);
        }

        // Fallback — throw with the original message
        throw new Error(`AI_REQUEST_FAILED: ${error.message}`);
    }
};