const Spot = require('../models/Spot');
const Booking = require('../models/Booking');

module.exports = {
  async store(req, res) {
    const { userid } = req.headers;
    const { date } = req.body;
    const { spot_id } = req.params;

    const spot = await Spot.findById(spot_id);
    if (!spot) {
      return res.json({ error: 'Spot not found' });
    }
    const booking = await Booking.create({
      user: userid,
      spot: spot_id,
      date
    });

    await booking
      .populate('spot')
      .populate('user')
      .execPopulate();

    const ownerSocket = req.connectedUsers[booking.spot.user];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('booking_request', booking);
    }

    return res.json(booking);
  }
};
