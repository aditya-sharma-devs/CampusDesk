/**
 * Block Identification Utility
 * Extracts the Academic Block name dynamically from classroom numbers.
 * 
 * Rules:
 * T106  -> T Block
 * LT303 -> LT Block
 * F201  -> F Block
 * E104  -> E Block
 * L302  -> L Block
 * LP109 -> LP Block
 * 
 * Logic: Matches leading alphabetic characters of the room number string.
 */

function extractBlockFromRoom(roomNumber) {
  if (!roomNumber || typeof roomNumber !== 'string') {
    return 'Other Block';
  }

  const cleanedRoom = roomNumber.trim().toUpperCase();
  const match = cleanedRoom.match(/^([A-Z]+)/);

  if (match && match[1]) {
    const prefix = match[1];
    return `${prefix} Block`;
  }

  return 'General Block';
}

/**
 * Standardized block list for ordering or filtering defaults
 */
const KNOWN_BLOCKS = [
  'T Block',
  'LT Block',
  'F Block',
  'E Block',
  'L Block',
  'LP Block'
];

module.exports = {
  extractBlockFromRoom,
  KNOWN_BLOCKS
};
