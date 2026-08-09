// small wrappers so page.js isn't building Google URLs inline with template
// literals scattered everywhere — also makes it obvious where to swap in a
// different maps/search provider later if we ever need to
export function googleMapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
