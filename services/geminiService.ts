
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamConfig, GeneratedQuestion } from "../types";
import { getApiKey } from "../lib/apiKeyStorage";

// Get API key from localStorage (runtime) or env (build time)
const getApiKeyValue = (): string => {
  // Try localStorage first (for runtime)
  if (typeof window !== 'undefined') {
    const storedKey = getApiKey();
    if (storedKey) return storedKey;
  }
  // Fallback to env variable (for build time / server-side)
  return (process.env.API_KEY || process.env.GEMINI_API_KEY || '');
};

const apiKey = getApiKeyValue();
const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    type: { type: Type.STRING, enum: ["mcq", "short", "essay"] },
    chapter: { type: Type.STRING },
    lesson: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ["Biết", "Hiểu", "Vận dụng"] },
    question: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      nullable: true,
      description: "Only for type 'mcq'. Must have exactly 4 options."
    },
    answer: { type: Type.STRING },
    solution: { type: Type.STRING, description: "Detailed step-by-step solution." },
    points: { type: Type.NUMBER, nullable: true },
  },
  required: ["type", "question", "answer", "solution", "chapter", "difficulty"],
};

const examResponseSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema
};

export const generateExamQuestions = async (config: ExamConfig): Promise<GeneratedQuestion[]> => {
  const totalQuestions = config.counts.mcq + config.counts.short + config.counts.essay;
  
  // Format topic list for prompt
  const topicListStr = config.topics.map(t => 
    `- Chương "${t.chapterName}": ${t.lessons.join(", ")}`
  ).join("\n");

  // Format Difficulty Instruction
  let difficultyInstruction = "";
  if (config.difficultyConfig.mode === 'fixed') {
    difficultyInstruction = `Tất cả câu hỏi phải ở mức độ: ${config.difficultyConfig.fixedLevel}.`;
  } else {
    const { biet, hieu, vandung } = config.difficultyConfig.ratio;
    difficultyInstruction = `Phân bố mức độ khó theo tỷ lệ: ${biet}% Biết, ${hieu}% Hiểu, ${vandung}% Vận dụng.`;
  }

  const prompt = `
    Bạn là hệ thống sinh câu hỏi trắc nghiệm và tự luận chuyên nghiệp cho môn ${config.subject} lớp ${config.grade}.

    NHIỆM VỤ:
    Tạo một danh sách gồm ${totalQuestions} câu hỏi kiểm tra dựa trên phạm vi kiến thức được cung cấp.

    PHẠM VI KIẾN THỨC (Chỉ được chọn bài học trong danh sách này):
    ${topicListStr}

    CẤU TRÚC ĐỀ YÊU CẦU:
    1. ${config.counts.mcq} câu Trắc nghiệm (type: 'mcq').
    2. ${config.counts.short} câu Trả lời ngắn (type: 'short').
    3. ${config.counts.essay} câu Tự luận (type: 'essay').

    YÊU CẦU VỀ ĐỘ KHÓ:
    ${difficultyInstruction}
    Hãy cố gắng tuân thủ chính xác tỷ lệ phân bố mức độ khó này.

    QUY TẮC SINH CÂU HỎI:
    - field 'lesson': Phải ghi chính xác tên bài học mà câu hỏi thuộc về (lấy từ danh sách trên).
    - field 'chapter': Ghi tên chương tương ứng.
    - field 'difficulty': Ghi rõ "Biết", "Hiểu", hoặc "Vận dụng".
    
    - Với type = 'mcq': 
      * 4 phương án A,B,C,D. Chỉ 1 đúng.
    - Với type = 'short':
      * Học sinh chỉ cần điền kết quả (số/biểu thức/từ khóa). Đáp án duy nhất.
    - Với type = 'essay':
      * Câu tự luận, kèm điểm số gợi ý (points).
    
    YÊU CẦU CHUNG:
    - Nội dung bám sát Chương trình Giáo dục phổ thông 2018 hiện hành.
    - Ngôn ngữ tiếng Việt chuẩn mực.
    - Sử dụng LaTeX cho công thức Toán/Lý/Hóa (ví dụ: $x^2$, $H_2O$, $F = ma$).

    Output JSON Array only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: examResponseSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text received");

    const data = JSON.parse(text) as GeneratedQuestion[];
    
    return data.map((q, index) => ({
        ...q,
        id: q.id || `q-${Date.now()}-${index}`,
        options: q.type === 'mcq' && (!q.options || q.options.length === 0) 
          ? ["A", "B", "C", "D"]
          : q.options
    }));

  } catch (error) {
    console.error("Error generating exam:", error);
    throw error;
  }
};
