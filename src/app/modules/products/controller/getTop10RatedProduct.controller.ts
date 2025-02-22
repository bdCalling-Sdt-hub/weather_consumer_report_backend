import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';

export const getTop10RatedProductController = myControllerHandler(
  async (req, res) => {
    const productData = await myProductModel.find();
    const arrayOfProductId: any = [];

    // Prepare an array of product ids
    for (let i = 0; i < productData.length; i++) {
      arrayOfProductId.push(productData[i].id);
    }

    // Fetch reviews for the products
    const reviewData = await reviewDataModelOfWeatherConsumerReport.find({
      productId: { $in: arrayOfProductId },
    });

    const allProductData: any = [];

    // Initialize all products with reviewCount and total rating as 0
    for (let i = 0; i < productData.length; i++) {
      const singleProductData = productData[i];
      const { id, ownerId, productImageUrl, name } = singleProductData;
      allProductData.push({
        id,
        ownerId,
        productImageUrl,
        name,
        reviewCount: 0,
        totalRating: 0, // To store the total of all ratings
      });
    }

    // Count the reviews for each product and sum the ratings
    for (let i = 0; i < reviewData.length; i++) {
      const { productId, rating } = reviewData[i];

      // Find the product and increment its review count and sum the ratings
      for (let j = 0; j < allProductData.length; j++) {
        const singleProductData = allProductData[j];
        if (singleProductData.id === productId) {
          singleProductData.reviewCount++;
          singleProductData.totalRating += rating; // Add the rating to the total
          break; // Stop searching once we find the matching product
        }
      }
    }

    // Calculate the average rating for each product
    for (let i = 0; i < allProductData.length; i++) {
      const singleProductData = allProductData[i];
      if (singleProductData.reviewCount > 0) {
        singleProductData.averageRating = (
          singleProductData.totalRating / singleProductData.reviewCount
        ).toFixed(2); // Limit the average rating to 2 decimal places
      } else {
        singleProductData.averageRating = '0'; // If no reviews, set average rating to 0
      }
    }

    // Sort the products based on reviewCount in descending order
    for (let i = 0; i < allProductData.length; i++) {
      for (let j = i + 1; j < allProductData.length; j++) {
        if (allProductData[i].reviewCount < allProductData[j].reviewCount) {
          const temp = allProductData[i];
          allProductData[i] = allProductData[j];
          allProductData[j] = temp;
        }
      }
    }

    // Return only the top 10 products
    const top10Products = allProductData.slice(0, 10);

    const myResponse = {
      message: 'Top 10 rated products retrieved successfully',
      success: true,
      data: top10Products,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
