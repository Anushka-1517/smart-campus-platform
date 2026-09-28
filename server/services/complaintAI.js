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

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3.2:1b",
    prompt,
    stream: false,
  });

  const category = response.data.response.trim();

  const allowedCategories = [
    "Academic",
    "Infrastructure",
    "Electrical",
    "Security",
    "Cleanliness",
    "Other",
  ];

  if (allowedCategories.includes(category)) {
    return category;
  }

  return "Other";
};