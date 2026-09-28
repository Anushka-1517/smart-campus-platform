import axios from "axios";

export const classifyComplaint = async (title, description) => {
  const prompt = `
You are a college complaint classifier.

Classify the complaint into EXACTLY ONE of these categories:

Academic
Infrastructure
Electrical
Security
Cleanliness
Other

Rules:
- Classroom projector, fan, AC, furniture, building or equipment problems = Infrastructure
- Electricity, wiring, switches, sockets, power problems = Electrical
- Theft, violence, harassment, unsafe situations = Security
- Garbage, dirty washrooms, sanitation, cleaning = Cleanliness
- Exams, teachers, attendance, assignments, classes, subjects = Academic
- Anything else = Other

Complaint title: ${title}
Complaint description: ${description}

Return ONLY ONE category name from the list.
Do not explain your answer.
`;

  const allowedCategories = [
    "Academic",
    "Infrastructure",
    "Electrical",
    "Security",
    "Cleanliness",
    "Other",
  ];

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const category =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (allowedCategories.includes(category)) {
      return category;
    }

    return "Other";
  } catch (error) {
    console.error(
      "Gemini classification unavailable:",
      error.response?.data?.error?.message || error.message
    );

    // Fallback classification if Gemini is temporarily unavailable
    const text = `${title} ${description}`.toLowerCase();

    if (
      text.includes("electric") ||
      text.includes("wire") ||
      text.includes("socket") ||
      text.includes("switch") ||
      text.includes("power")
    ) {
      return "Electrical";
    }

    if (
      text.includes("projector") ||
      text.includes("fan") ||
      text.includes("ac") ||
      text.includes("furniture") ||
      text.includes("classroom") ||
      text.includes("building")
    ) {
      return "Infrastructure";
    }

    if (
      text.includes("theft") ||
      text.includes("violence") ||
      text.includes("harassment") ||
      text.includes("security")
    ) {
      return "Security";
    }

    if (
      text.includes("garbage") ||
      text.includes("dirty") ||
      text.includes("washroom") ||
      text.includes("cleaning") ||
      text.includes("sanitation")
    ) {
      return "Cleanliness";
    }

    if (
      text.includes("exam") ||
      text.includes("teacher") ||
      text.includes("attendance") ||
      text.includes("assignment") ||
      text.includes("subject") ||
      text.includes("class")
    ) {
      return "Academic";
    }

    return "Other";
  }
};