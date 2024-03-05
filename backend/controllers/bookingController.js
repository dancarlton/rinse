import { Booking } from '../models/bookingModel.js';

const bookingController = {
  /********************************************************************************
   * @description get all bookings in db
   * @route /api/bookings
   * @method GET
   * @returns {Booking[]}an array of all booking objects from DB
   *******************************************************************************/
  getAllBookings: async (req, res) => {
    const bookings = await Booking.find({});
    return res.status(200).json(bookings);
  },

  /********************************************************************************
   * @description get one booking by _id
   * @route /api/bookings/:id
   * @method GET
   * @returns {Booking}, booking. currently gets all info
   *******************************************************************************/
  getBookingById: async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }
    return res.status(200).json(booking);
  },

  /********************************************************************************
   * @description edit one booking by _id
   * @route /api/bookings/:id
   * @method PUT
   * @returns {Booking}, booking. the updated booking
   *******************************************************************************/
  updateBookingById: async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(booking);
  },

  /********************************************************************************
   * @description delete one booking by _id
   * @route /api/bookings/:id
   * @method DELETE
   * @returns {Booking}, booking. the deleted booking
   *******************************************************************************/
  deleteBookingById: async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    return res.status(200).json(booking);
  },
};

export default bookingController;
