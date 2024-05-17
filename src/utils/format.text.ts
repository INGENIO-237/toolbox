export function formatNotchPayError(error: string) {
  return error
    .split(".")[1]
    .split("")
    .map((letter, index) => {
      if (index === 0) return letter.toUpperCase();

      return letter;
    })
    .join("");
}
