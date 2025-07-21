// api/quiz.js
import OpenAI from "openai";

// Array com as 40 perguntas organizadas por nível
const questions = [
  // A1 (0–9)
  { id: 0, question: "Wie heißt du?", options: ["Ich heißen Maria","Ich heiße Maria","Ich heißt Maria"], answer: "B", level: "A1" },
  { id: 1, question: "Wo wohnst du?", options: ["Ich wohne in Berlin","Ich wohne aus Berlin","Ich wohnen in Berlin"], answer: "A", level: "A1" },
  { id: 2, question: "Was ist das?", options: ["Das ist Buch","Das sind ein Buch","Das ist ein Buch"], answer: "C", level: "A1" },
  { id: 3, question: "Wie alt bist du?", options: ["Ich bin zwanzig Jahre alt","Ich habe zwanzig","Ich werde zwanzig"], answer: "A", level: "A1" },
  { id: 4, question: "Woher kommst du?", options: ["Ich komme nach Deutschland","Ich komme aus Brasilien","Ich komme von Brasilien"], answer: "B", level: "A1" },
  { id: 5, question: "Was machst du beruflich?", options: ["Ich bin Lehrer","Ich bin Arbeiten Lehrer","Ich arbeite als Lehrer"], answer: "A", level: "A1" },
  { id: 6, question: "Wann stehst du auf?", options: ["Ich stehe um 7 Uhr auf","Ich stehe auf um 7 Uhr","Ich stehen um 7 Uhr auf"], answer: "A", level: "A1" },
  { id: 7, question: "Welche Farbe hat das Auto?", options: ["Das Auto hat rot","Das Auto ist rot","Das Auto ist rotes"], answer: "B", level: "A1" },
  { id: 8, question: "Wo ist der Schlüssel?", options: ["Der Schlüssel liegt auf dem Tisch","Der Schlüssel liegen auf dem Tisch","Der Schlüssel liegt aus dem Tisch"], answer: "A", level: "A1" },
  { id: 9, question: "Was kostet das Brot?", options: ["Das Brot kostet zwei Euro","Das Brot kostest zwei Euro","Das Brot hat zwei Euro"], answer: "A", level: "A1" },

  // A2 (10–19)
  { id: 10, question: "Was möchtest du kaufen?", options: ["Ich möchte einen Computer kaufen","Ich möchte ein Computer kaufen","Ich möchte eine Computer kaufen"], answer: "A", level: "A2" },
  { id: 11, question: "Wie ist das Wetter heute?", options: ["Das Wetter ist schön und sonnig","Das Wetter ist schöne und sonnige","Das Wetter scheint die Sonne"], answer: "A", level: "A2" },
  { id: 12, question: "Was hast du gestern gemacht?", options: ["Ich habe einen Film gesehen","Ich habe gesehen einen Film","Ich sehe einen Film"], answer: "A", level: "A2" },
  { id: 13, question: "Warum lernst du Deutsch?", options: ["Weil ich in Deutschland lebe","Weil ich in Deutschland leben","Wenn ich in Deutschland lebe"], answer: "A", level: "A2" },
  { id: 14, question: "Kannst du mir helfen?", options: ["Ja, natürlich kann ich dir helfen","Ja, natürlich ich kann dir helfen","Ja, ich kann helfen dir"], answer: "A", level: "A2" },
  { id: 15, question: "Wann fährt der nächste Zug?", options: ["Der nächste Zug fährt um 15:30","Der nächste Zug fährt am 15:30","Der nächste Zug fährt im 15:30"], answer: "A", level: "A2" },
  { id: 16, question: "Was für Musik hörst du gern?", options: ["Ich höre gern klassische Musik","Ich hör gern klassische Musik","Ich mag klassische Musik hören"], answer: "A", level: "A2" },
  { id: 17, question: "Wie lange lernst du schon Deutsch?", options: ["Ich lerne seit zwei Jahren Deutsch","Ich lerne vor zwei Jahren Deutsch","Ich lerne in zwei Jahren Deutsch"], answer: "A", level: "A2" },
  { id: 18, question: "Was würdest du gern machen?", options: ["Ich würde gern nach Deutschland reisen","Ich würden gern nach Deutschland reisen","Ich würde nach Deutschland gern reisen"], answer: "A", level: "A2" },
  { id: 19, question: "Wo warst du letztes Wochenende?", options: ["Ich war bei meinen Freunden","Ich war in meinen Freunden","Ich war zu meinen Freunden"], answer: "A", level: "A2" },

  // B1 (20–29)
  { id: 20, question: "Wenn ich Zeit hätte, _____ ich mehr reisen.", options: ["werde","würde","will"], answer: "B", level: "B1" },
  { id: 21, question: "Das ist der Mann, _____ das Auto gestohlen hat.", options: ["der","den","dem"], answer: "A", level: "B1" },
  { id: 22, question: "Obwohl es regnet, _____ wir spazieren.", options: ["gehen wir","wir gehen","sind wir"], answer: "A", level: "B1" },
  { id: 23, question: "Er tut so, _____ er alles wüsste.", options: ["als ob","wie","dass"], answer: "A", level: "B1" },
  { id: 24, question: "Das Buch, _____ ich dir empfohlen habe, ist sehr interessant.", options: ["das","den","dem"], answer: "A", level: "B1" },
  { id: 25, question: "_____ des schlechten Wetters sind wir gegangen.", options: ["Trotz","Wegen","Während"], answer: "A", level: "B1" },
  { id: 26, question: "Sie arbeitet hart, _____ erfolgreich zu sein.", options: ["um","damit","dass"], answer: "A", level: "B1" },
  { id: 27, question: "Nachdem er gegessen hatte, ging er schlafen.", options: ["hatte","hat","war"], answer: "A", level: "B1" },
  { id: 28, question: "Das Projekt _____ bis amanhã fertig sein.", options: ["muss","hat","braucht"], answer: "A", level: "B1" },
  { id: 29, question: "Je mais er lernt, _____ besser wird er.", options: ["desto","als","wie"], answer: "A", level: "B1" },

  // B2 (30–39)
  { id: 30, question: "Der Politiker, dessen Rede gestern gehalten wurde, ist sehr umstritten.", options: ["dessen","deren","dem"], answer: "A", level: "B2" },
  { id: 31, question: "Hätte ich das gewusst, _____ ich anders gehandelt.", options: ["hätte","würde","wäre"], answer: "A", level: "B2" },
  { id: 32, question: "Wer nicht übt, wird nie besser.", options: ["Wer","Wen","Wem"], answer: "A", level: "B2" },
  { id: 33, question: "Er sagt: \"Ich komme morgen.\" → \"Er sagt, er komme morgen.\"", options: ["kommt","komme","kommen"], answer: "B", level: "B2" },
  { id: 34, question: "Die Angelegenheit bedarf einer gründlichen Untersuchung.", options: ["bedarf","braucht","benötigt"], answer: "A", level: "B2" },
  { id: 35, question: "Der Mann, dem der Hund Gassi führt, ist mein Nachbar.", options: ["dem","dessen","der"], answer: "A", level: "B2" },
  { id: 36, question: "Das lässt sich kaum anders lösen.", options: ["lässt","kann","soll"], answer: "A", level: "B2" },
  { id: 37, question: "gestern / wegen der Arbeit / habe ich / zu Hause / viel gearbeitet.", options: ["ich habe gestern zu Hause...","ich habe...","ich..."], answer: "A", level: "B2" },
  { id: 38, question: "Nominalisierung: Die Entscheidung fällt mir schwer.", options: ["Entscheiden","Entscheidung","Entscheidend"], answer: "B", level: "B2" },
  { id: 39, question: "Er spricht sowohl Deutsch als auch Englisch fließend.", options: ["sowohl ... als auch","einerseits ... andererseits","entweder ... oder"], answer: "A", level: "B2" }
];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { phase, questionIndex, score } = req.body;

  if (phase === "quiz") {
    const q = questions[questionIndex];
    if (!q) return res.status(404).json({ error: "Pergunta não encontrada" });
    return res.json({ question: q.question, options: q.options });
  }

  if (phase === "feedback") {
    let nivel = score >= 31 ? "B2"
              : score >= 21 ? "B1"
              : score >= 11 ? "A2"
              : "A1";

    const dicas = {
      A1: "• Reforce artigos, Präsens de sein/haben e ordem S‑V‑O",
      A2: "• Pratique Perfekt vs Präteritum, casos acusativo/dativo e verbos modais",
      B1: "• Use Konjunktiv II e orações com weil/als ob",
      B2: "• Aplique voz passiva, Partizipialkonstruktionen e genitivo"
    };

    const feedback = 
      `Você acertou ${score} de 40 e seu nível estimado é **${nivel}**. Parabéns!\n\n` +
      `**Próximas etapas para ${nivel}:**\n${dicas[nivel]}\n\n` +
      `Quer ir além? Entre no meu WhatsApp com condição especial:\n` +
      `https://wa.me/message/B7UCVV3XCPANK1`;

    return res.json({ feedback });
  }

  return res.status(400).json({ error: "phase inválida" });
}
