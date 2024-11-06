import Room from '../models/Room.js';

export const generateRoomCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code already exists
    const existingRoom = await Room.findOne({ code });
    if (!existingRoom) {
      isUnique = true;
    }
  }

  return code;
}; 