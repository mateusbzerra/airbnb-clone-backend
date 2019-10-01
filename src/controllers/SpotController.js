const Spot = require("../models/Spot");
const User = require("../models/User");

class SpotController {
  async index(req, res) {
    const { tech } = req.query;
    const spots = await Spot.find({ techs: tech });
    return res.json(spots);
  }
  async store(req, res) {
    const { filename } = req.file;
    const { company, price, techs } = req.body;
    const { userid } = req.headers;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const spot = await Spot.create({
      user: userid,
      thumbnail: filename,
      company,
      price,
      techs: techs.split(",").map(tech => tech.trim())
    });
    return res.json(spot);
  }
}

module.exports = new SpotController();
