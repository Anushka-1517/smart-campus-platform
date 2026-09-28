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
- - Physical campus facilities, classroom equipment, furniture, buildings, walls, doors, roofs, water seepage or other physical infrastructure problems = Infrastructure
- Electricity, wiring, switches, sockets, power problems = Electrical
- Unauthorized entry, unknown persons in restricted areas, suspicious activity,
  theft, violence, harassment, access-control problems, or threats to campus safety = Security
- Garbage, dirty washrooms, sanitation, cleaning or unhygienic conditions = Cleanliness
- Exams, teachers, attendance, assignments, classes, subjects or academic issues = Academic
- Anything else = Other

Examples:
- "Projector in classroom is broken" = Infrastructure
- "Power socket is sparking" = Electrical
- "Unknown person entered the equipment storage area without authorization" = Security
- "Someone is entering a restricted laboratory without permission" = Security
- "Washroom is dirty" = Cleanliness
- "Teacher has not uploaded marks" = Academic

Important:
Do not classify based only on individual keywords.
Understand the meaning of the complete complaint.

Complaint title: ${title}
Complaint description: ${description}

You MUST choose exactly ONE category.

Security has priority whenever the complaint involves:
- unauthorized entry
- an unknown person
- suspicious activity
- restricted-area access
- theft
- violence
- harassment
- threats
- campus safety

If any of these security situations are present, return:
Security

Return ONLY:
Academic
Infrastructure
Electrical
Security
Cleanliness
Other

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`,
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
    console.error("GEMINI FULL ERROR:", error.response?.data || error.message);

    // Backup classification if Gemini is temporarily unavailable
    const text = `${title} ${description}`.toLowerCase();

    if (
      text.includes("electric") ||
      text.includes("wire") ||
      text.includes("socket") ||
      text.includes("switch") ||
      text.includes("power") ||
      text.includes("voltage") ||
      text.includes("spark")
    ) {
      return "Electrical";
    }

    if (
  text.includes("unauthorized") ||
  text.includes("unknown person") ||
  text.includes("restricted area") ||
  text.includes("restricted") ||
  text.includes("suspicious") ||
  text.includes("theft") ||
  text.includes("violence") ||
  text.includes("harassment") ||
  text.includes("security") ||
  text.includes("without authorization") ||
  text.includes("without permission")
) {
  return "Security";
}

if (
  text.includes("projector") ||
  text.includes("fan") ||
  text.includes("ac") ||
  text.includes("furniture") ||
  text.includes("classroom") ||
  text.includes("building") ||
  text.includes("equipment") ||
  text.includes("seepage") ||
  text.includes("damp")
) {
  return "Infrastructure";
}

    if (
      text.includes("garbage") ||
      text.includes("dirty") ||
      text.includes("washroom") ||
      text.includes("cleaning") ||
      text.includes("sanitation") ||
      text.includes("hygiene") ||
      text.includes("unhygienic")
    ) {
      return "Cleanliness";
    }

    if (
      text.includes("exam") ||
      text.includes("teacher") ||
      text.includes("attendance") ||
      text.includes("assignment") ||
      text.includes("subject") ||
      text.includes("class") ||
      text.includes("marks")
    ) {
      return "Academic";
    }

    return "Other";
  }
};