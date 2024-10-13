const fs = require("fs");
const path = require("path");
const INPUT_FILE = "words.csv";

function openFile() {
  const data = fs.readFileSync(path.resolve(__dirname, INPUT_FILE), {
    encoding: "utf-8",
  });
  return data.split("\n").map((line) => line.split(";"));
}

function letterCount() {
  const letters = {};
  const words = openFile();
  for (let i of words) {
    if (i.length > 2 && i[2]) {
      const targetWord = i[2];
      const currentWordLetters = new Set(i[1]);
      for (const letter of targetWord) {
        if (!currentWordLetters.has(letter)) {
          letters[letter] = (letters[letter] || 0) + 1;
        }
      }
    }
  }
  return letters;
}

function checkLetters(word, wholeWord, letters) {
  let attempts = 0;
  if (typeof word !== "string" || typeof wholeWord !== "string") {
    console.error("Invalid inputs:", { word, wholeWord });
    return attempts;
  }
  const sortedLetters = Object.entries(letters).sort((a, b) => b[1] - a[1]);
  for (const [letter] of sortedLetters) {
    if (wholeWord.includes(letter)) {
      if (!word.includes(letter)) {
        attempts++;
        const indices = [...wholeWord].reduce(
          (acc, lit, i) => (lit === letter ? [...acc, i] : acc),
          []
        );
        letters[letter] -= indices.length;
        indices.forEach((index) => {
          word = word.slice(0, index) + letter + word.slice(index + 1);
        });
      }
    } else if (!word.includes("*")) {
      break;
    } else {
      attempts++;
    }
  }
  return { attempts, word };
}

function hangman() {
  const words = openFile();
  let totalAttempts = 0;
  const letters = letterCount();
  for (const word of words) {
    if (word.length > 2) {
      let currentWord = word[1];
      const targetWord = word[2];
      const result = checkLetters(currentWord, targetWord, letters);
      totalAttempts += result.attempts;
      currentWord = result.word;
    } else {
      console.error("Invalid word structure:", word);
    }
  }
  console.log(`${totalAttempts} right + wrong attempts`);
}

hangman();
