export const bengaliToEnglishNumber = (
  value: string | number
): number => {
  if (typeof value === "number") {
    return value;
  }

  const bengaliDigits = "০১২৩৪৫৬৭৮৯";
  const englishDigits = "0123456789";

  const normalized = value
    .split("")
    .map((char) => {
      const index = bengaliDigits.indexOf(char);

      return index !== -1
        ? englishDigits[index]
        : char;
    })
    .join("");

  return Number(
    normalized.replace(/,/g, "").trim()
  );
};