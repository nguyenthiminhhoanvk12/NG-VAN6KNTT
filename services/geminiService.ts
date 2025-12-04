import { GoogleGenAI, Type, Content } from "@google/genai";
import { QuizData, LitNews, QuizQuestion } from "../types";

let genAIInstance: GoogleGenAI | null = null;

const getApiKey = (): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {}
  return "";
};

const getAI = () => {
  if (genAIInstance) return genAIInstance;
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("CRITICAL ERROR: API Key is missing.");
    throw new Error("Chưa cấu hình API Key. Vui lòng kiểm tra biến môi trường VITE_API_KEY.");
  }
  genAIInstance = new GoogleGenAI({ apiKey });
  return genAIInstance;
};

// Fallback data
const FALLBACK_NEWS_ITEMS: LitNews[] = [
  {
    title: "Vẻ đẹp của Tiếng Việt",
    content: "Tiếng Việt có thanh điệu phong phú, tạo nên nhạc tính trầm bổng. Đó là lý do thơ ca Việt Nam rất phát triển và giàu cảm xúc.",
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80"
  },
  {
    title: "Tô Hoài và Dế Mèn",
    content: "Nhà văn Tô Hoài viết 'Dế Mèn phiêu lưu ký' khi còn rất trẻ. Tác phẩm đã được dịch ra nhiều thứ tiếng và là người bạn của bao thế hệ thiếu nhi.",
    imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80"
  },
  {
    title: "Ca dao - Hồn quê",
    content: "Ca dao là những bài thơ dân gian được truyền miệng, phản ánh đời sống tâm hồn, tình cảm của người bình dân Việt Nam xưa.",
    imageUrl: "https://images.unsplash.com/photo-1464660756002-e05458892ebf?w=800&q=80"
  }
];

const cleanJsonString = (str: string): string => {
  if (!str) return "{}";
  const firstOpen = str.indexOf('{');
  const lastClose = str.lastIndexOf('}');
  const firstArray = str.indexOf('[');
  const lastArray = str.lastIndexOf(']');
  
  // Check if it's an array or object and extract accordingly
  if (firstArray !== -1 && lastArray !== -1 && (firstOpen === -1 || firstArray < firstOpen)) {
      return str.substring(firstArray, lastArray + 1);
  }
  
  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    return str.substring(firstOpen, lastClose + 1);
  }
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateQuiz = async (topic: string, description: string): Promise<QuizData> => {
  try {
    const ai = getAI();
    const prompt = `
      Tạo đề kiểm tra Ngữ Văn 6 (Sách Kết nối tri thức) cho bài: "${topic} - ${description}".
      
      Cấu trúc đề (Tổng 10 điểm):
      
      1. Phần 1: Trắc nghiệm (3.0 điểm). 
         - 12 câu hỏi (0.25đ/câu).
         - Nội dung: Tác giả, tác phẩm, thể loại, ý nghĩa chi tiết, biện pháp tu từ (so sánh, nhân hóa, ẩn dụ...).
         - 4 đáp án A,B,C,D.
         
      2. Phần 2: Đúng/Sai (4.0 điểm).
         - 4 câu hỏi lớn. Mỗi câu gồm 1 đoạn văn bản ngắn (Stem) và 4 nhận định (a,b,c,d).
         - Stem: Trích dẫn một đoạn thơ hoặc đoạn văn ngắn liên quan đến bài học.
         - Nhận định về: Nội dung, nghệ thuật, tình cảm nhân vật, từ loại.
         
      3. Phần 3: Trả lời ngắn / Điền từ (3.0 điểm).
         - 6 câu hỏi (0.5đ/câu).
         - Dạng: Tìm từ láy, tìm biện pháp tu từ, điền từ còn thiếu vào câu thơ, hoặc xác định ngôi kể.
         - QUAN TRỌNG: Đáp án (correctAnswer) phải ngắn gọn (1-3 từ).
         
      Yêu cầu chung:
      - Văn phong phù hợp học sinh lớp 6.
      - Trả về JSON thuần túy.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Bạn là giáo viên Ngữ Văn 6 tâm huyết. Trả về JSON hợp lệ.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            part1: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctAnswerIndex"]
              }
            },
            part2: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  stem: { type: Type.STRING },
                  statements: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.INTEGER },
                        statement: { type: Type.STRING },
                        isTrue: { type: Type.BOOLEAN },
                        explanation: { type: Type.STRING }
                      },
                      required: ["id", "statement", "isTrue"]
                    }
                  }
                },
                required: ["id", "stem", "statements"]
              }
            },
            part3: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "correctAnswer"]
              }
            }
          },
          required: ["topic", "part1", "part2", "part3"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(cleanJsonString(response.text)) as QuizData;
    }
    throw new Error("Empty Response");
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    if (error.message && (error.message.includes("API Key") || error.message.includes("403"))) {
       throw new Error("Lỗi API Key: Vui lòng kiểm tra cấu hình VITE_API_KEY.");
    }
    throw error;
  }
};

export const generateLitNews = async (): Promise<LitNews> => {
  try {
    const ai = getAI();
    const textPrompt = `
      Viết một bản tin ngắn (Trivia) thú vị về Văn học hoặc Tiếng Việt cho học sinh lớp 6.
      Chủ đề: Sự giàu đẹp của Tiếng Việt, Các nhà văn nổi tiếng (Tô Hoài, Xuân Quỳnh, Andersen...), hoặc mẹo viết văn hay.
      
      Trả về JSON: title, content (ngắn gọn, cảm xúc), imagePrompt (mô tả tranh minh họa phong cách artstation, ấm áp).
    `;

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "content", "imagePrompt"]
        }
      }
    });

    const newsData = JSON.parse(cleanJsonString(textResponse.text || "{}"));
    
    let imageUrl: string | undefined = undefined;
    try {
      const imageResponse = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: { parts: [{ text: newsData.imagePrompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (e) {}

    return {
      title: newsData.title,
      content: newsData.content,
      imageUrl: imageUrl
    };

  } catch (error) {
    const randomIndex = Math.floor(Math.random() * FALLBACK_NEWS_ITEMS.length);
    return FALLBACK_NEWS_ITEMS[randomIndex];
  }
};

export const suggestWritingIdeas = async (topic: string, type: string): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Học sinh lớp 6 cần viết bài văn: "${topic}". Thể loại: ${type}.
      Hãy gợi ý một Dàn ý chi tiết (Mở bài, Thân bài, Kết bài) thật hay, sáng tạo và phù hợp lứa tuổi.
      Đưa ra các ý tưởng (key points) để em phát triển, không viết bài văn mẫu hoàn chỉnh.
      Định dạng văn bản rõ ràng, dễ đọc.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Thầy chưa nghĩ ra ý tưởng nào, em thử đề tài khác xem sao nhé.";
  } catch (e) {
    return "Hệ thống đang bận, em thử lại sau nhé.";
  }
};

export const getChatResponse = async (history: Content[], newMessage: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `
          Bạn là "Gia Sư Văn Học" - một người bạn đồng hành tâm lý, sâu sắc dành cho học sinh lớp 6.
          Phong cách: Nhẹ nhàng, dùng từ ngữ gợi cảm, giàu hình ảnh, khuyến khích sự sáng tạo.
          Nhiệm vụ: Giải thích ý nghĩa tác phẩm, hướng dẫn cách làm văn, sửa lỗi chính tả/ngữ pháp.
          Lưu ý: Không làm bài hộ, chỉ gợi ý phương pháp và ý tưởng.
        `
      },
      history: history
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Thầy chưa hiểu rõ ý em, em nói lại nhé?";
  } catch (error) {
    return "Kết nối bị gián đoạn, em chờ một chút nhé.";
  }
};

export const sendMessageToGemini = async (message: string, history: {role: string, text: string}[], context?: string): Promise<string> => {
  try {
    const ai = getAI();
    
    const formattedHistory: Content[] = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `
          Bạn là trợ lý văn học cho học sinh lớp 6.
          ${context ? `Bối cảnh hiện tại: ${context}` : ''}
          Hãy trả lời ngắn gọn, dễ hiểu, khích lệ học sinh.
        `
      },
      history: formattedHistory
    });

    const result = await chat.sendMessage({ message: message });
    return result.text || "Thầy đang suy nghĩ, em đợi chút nhé.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateQuizForLesson = async (lessonTitle: string): Promise<QuizQuestion[]> => {
  try {
    const ai = getAI();
    const prompt = `
      Tạo 5 câu hỏi trắc nghiệm (3 lựa chọn A, B, C) về bài học: "${lessonTitle}" (Ngữ Văn 6).
      Trả về định dạng JSON mảng các đối tượng:
      [{ "id": 1, "question": "...", "options": ["...", "...", "..."], "correctAnswer": 0, "explanation": "..." }]
      Lưu ý: correctAnswer là index của đáp án đúng (0, 1, hoặc 2).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(cleanJsonString(response.text)) as QuizQuestion[];
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
