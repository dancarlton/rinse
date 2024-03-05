import { Review } from '../models/reviewModel.js';

const reviewController = {
  /********************************************************************************
   * @description get all reviews in db
   * @route /api/reviews
   * @method GET
   * @returns {Review[]}an array of all review objects from DB
   *******************************************************************************/
  getAllReviews: async (req, res) => {
    const reviews = await Review.find({});
    return res.status(200).json(reviews);
  },

  /********************************************************************************
   * @description get one review by _id
   * @route /api/reviews/:id
   * @method GET
   * @returns {Review}, review. currently gets all info
   *******************************************************************************/
  getReviewById: async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).send('review not found');
    }
    return res.status(200).json(review);
  },

  /********************************************************************************
   * @description edit one review by _id
   * @route /api/reviews/:id
   * @method PUT
   * @returns {Review}, review. the updated review
   *******************************************************************************/
  updateReviewById: async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(review);
  },

  /********************************************************************************
   * @description delete one review by _id
   * @route /api/reviews/:id
   * @method DELETE
   * @returns {Review}, review. the deleted review
   *******************************************************************************/
  deleteReviewById: async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    return res.status(200).json(review);
  },
};

export default reviewController;
