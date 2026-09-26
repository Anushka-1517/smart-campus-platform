// Simple AI-assisted complaint priority engine
// No API key or AI library required.

const highPriorityKeywords = [
  "fire",
  "smoke",
  "electric shock",
  "electricity",
  "electrical",
  "exposed wire",
  "short circuit",
  "accident",
  "injury",
  "danger",
  "dangerous",
  "unsafe",
  "security",
  "violence",
  "emergency",
  "flood",
  "gas leak"
];

const mediumPriorityKeywords = [
  "broken",
  "leak",
  "leaking",
  "water",
  "projector",
  "fan",
  "ac",
  "air conditioner",
  "computer",
  "internet",
  "wifi",
  "toilet",
  "washroom",
  "light",
  "door"
];

export const prioritizeComplaint = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();

  const highMatch = highPriorityKeywords.find((keyword) =>
    text.includes(keyword)
  );

  if (highMatch) {
    return {
      priority: "High",
      reason: `Potential safety or emergency issue detected: "${highMatch}".`
    };
  }

  const mediumMatch = mediumPriorityKeywords.find((keyword) =>
    text.includes(keyword)
  );

  if (mediumMatch) {
    return {
      priority: "Medium",
      reason: `Infrastructure or service issue detected: "${mediumMatch}".`
    };
  }

  return {
    priority: "Low",
    reason: "No urgent safety or infrastructure issue detected."
  };
};