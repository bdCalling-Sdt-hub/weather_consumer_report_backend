export const refineToken = (authString: string) => {
  if (!authString || typeof authString !== 'string') {
    return null; // Return null if input is invalid
  }

  // Remove all instances of "Bearer" (case-insensitive) and trim any extra whitespace
  const cleanedString = authString
    .replace(/bearer\s*/gi, '') // Remove "Bearer" and following spaces
    .trim();

  return cleanedString || null; // Return null if the cleaned string is empty
};
