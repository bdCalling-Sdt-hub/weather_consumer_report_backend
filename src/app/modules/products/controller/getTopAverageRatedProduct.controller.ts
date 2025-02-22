import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';

export const getTopAverageRatedProductController = myControllerHandler(
  async (req, res) => {
    const productData = await myProductModel.find();
    const arrayOfProductId: any = [];

    // Prepare an array of product IDs
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
      allProductData.push({
        id: singleProductData.id,
        ownerId: singleProductData.ownerId,
        productImageUrl: singleProductData.productImageUrl,
        name: singleProductData.name,
        reviewCount: 0,
        totalRating: 0, // To store the total of all ratings
        averageRating: 0, // Default to 0
      });
    }

    // Count the reviews for each product and sum the ratings
    for (let i = 0; i < reviewData.length; i++) {
      const { productId, rating } = reviewData[i];

      // Find the product and increment its review count and sum the ratings
      for (let j = 0; j < allProductData.length; j++) {
        if (allProductData[j].id === productId) {
          allProductData[j].reviewCount++;
          allProductData[j].totalRating += rating; // Add the rating to the total
          break; // Stop searching once we find the matching product
        }
      }
    }

    // Calculate the average rating for each product
    for (let i = 0; i < allProductData.length; i++) {
      if (allProductData[i].reviewCount > 0) {
        allProductData[i].averageRating = parseFloat(
          (
            allProductData[i].totalRating / allProductData[i].reviewCount
          ).toFixed(2)
        );
      } else {
        allProductData[i].averageRating = 0; // If no reviews, set average rating to 0
      }
    }

    // Sort the products based on averageRating in descending order
    for (let i = 0; i < allProductData.length; i++) {
      for (let j = i + 1; j < allProductData.length; j++) {
        if (allProductData[i].averageRating < allProductData[j].averageRating) {
          const temp = allProductData[i];
          allProductData[i] = allProductData[j];
          allProductData[j] = temp;
        }
      }
    }

    // Return only the top 10 products based on highest average rating
    const top10Products = allProductData.slice(0, 10);

    const myResponse = {
      message: 'Top 10 highest average-rated products retrieved successfully',
      success: true,
      data: top10Products,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
