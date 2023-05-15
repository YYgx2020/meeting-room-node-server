const RoomAppoint = require("../model/room.appoint.model");

class RoomAppointService {
  async getOne({ room_id, date }) {
    const res = await RoomAppoint.findAndCountAll({
      where: {
        room_id,
        date,
      },
    });
    return res ? res : null;
  }
}

module.exports = new RoomAppointService();
