export const formatNameCases = (name) => {
  if (!name) return [];

  // Bersihkan karakter non-alfabet dan non-spasi
  const cleaned = name.replace(/[^a-zA-Z\s]/g, "").trim();
  if (!cleaned) return [];

  const words = cleaned.split(" ").filter(Boolean);
  const variations = new Set();

  // Helper capitalisasi
  const toTitle = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  const addAllCases = (str) => {
    variations.add(encodeURIComponent(str.toLowerCase()));
    variations.add(encodeURIComponent(str.toUpperCase()));
    variations.add(encodeURIComponent(str.split(/[^a-zA-Z]/).map(toTitle).join(str.match(/[^a-zA-Z]/)?.[0] || "")));
  };

  // Kombinasi penuh
  const baseFull = words.join(" ");
  addAllCases(baseFull);             // spasi
  addAllCases(words.join(""));       // tanpa spasi
  addAllCases(words.join("."));      // titik
  addAllCases(words.join("-"));      // strip
  addAllCases(words.join("_"));      // underscore

  // Kombinasi per kata
  words.forEach(word => addAllCases(word));

  // Kombinasi 2 dari 3 kata (kalau ada lebih dari 2)
  if (words.length >= 3) {
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        const pair = [words[i], words[j]];
        addAllCases(pair.join(" "));
        addAllCases(pair.join(""));
        addAllCases(pair.join("."));
        addAllCases(pair.join("-"));
        addAllCases(pair.join("_"));
      }
    }
  }

  return Array.from(variations);
};
