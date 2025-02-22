import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myProductModel } from '../model/products.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import { assetCategoryModel } from '../../category/model/category.model';

export const getTopCategoriesController = myControllerHandler(
  async (req, res) => {
    const productData: any = await myProductModel.find();
    const arrayOfProductId: any = [];

    // Get category data (categoryName, categoryImageUrl, categoryId)
    const categoryData = await assetCategoryModel.find();

    // Create a mapping of categoryName -> categoryId for easy lookup
    const categoryNameMap: { [key: string]: string } = {};
    for (let i = 0; i < categoryData.length; i++) {
      categoryNameMap[categoryData[i].categoryName] = categoryData[i].id;
    }

    // Create a mapping of categoryId -> ratedProductCount and total ratings for average calculation
    const categoryRatingsMap: { [key: string]: number } = {}; // To count the total number of ratings for each category
    const categoryRatingSumMap: { [key: string]: number } = {}; // To sum the ratings for each category
    const categoryProductCountMap: { [key: string]: number } = {}; // To count the products in each category

    // Get the list of product ids
    for (let i = 0; i < productData.length; i++) {
      arrayOfProductId.push(productData[i].id);
    }

    // Fetch reviews for the products
    const reviewData = await reviewDataModelOfWeatherConsumerReport.find({
      productId: { $in: arrayOfProductId },
    });

    // Calculate the review count, sum of ratings, and map to categoryId
    const allProductData: any = [];
    for (let i = 0; i < productData.length; i++) {
      const singleProductData = productData[i];
      const { id, ownerId, productImageUrl, name, category } =
        singleProductData;
      allProductData.push({ id, ownerId, productImageUrl, name, category });

      // Increment review count for the product
      let reviewCount = 0;
      let totalRating = 0;
      for (let j = 0; j < reviewData.length; j++) {
        if (reviewData[j].productId === id) {
          reviewCount++;
          totalRating += reviewData[j].rating; // Sum up the ratings
        }
      }

      singleProductData.reviewCount = reviewCount;

      // Check if the product's category matches any categoryName
      const categoryId = categoryNameMap[category];

      // Update the category review count, sum of ratings, and product count
      if (reviewCount > 0 && categoryId) {
        if (categoryRatingsMap[categoryId]) {
          categoryRatingsMap[categoryId] += reviewCount; // Increment total ratings for the category
        } else {
          categoryRatingsMap[categoryId] = reviewCount; // Initialize if it's the first review for this category
        }

        // Sum the ratings for each product in the category
        if (categoryRatingSumMap[categoryId]) {
          categoryRatingSumMap[categoryId] += totalRating; // Add the total ratings of this product
        } else {
          categoryRatingSumMap[categoryId] = totalRating; // Initialize if it's the first rating
        }

        // Increment the product count for this category
        if (categoryProductCountMap[categoryId]) {
          categoryProductCountMap[categoryId] += 1; // Increment the product count for this category
        } else {
          categoryProductCountMap[categoryId] = 1; // Initialize if it's the first product in this category
        }
      }
    }

    // Create an array of category names, their respective ratings count, average rating, and category image URL
    const sortedCategories: any[] = [];
    for (let i = 0; i < categoryData.length; i++) {
      const category = categoryData[i];
      const categoryId = category.id;

      if (categoryRatingsMap[categoryId] > 0) {
        // Calculate the average rating for the category by dividing the sum of ratings by the total number of ratings
        const averageRating =
          categoryRatingSumMap[categoryId] / categoryRatingsMap[categoryId]; // Use the total number of ratings here for average calculation

        sortedCategories.push({
          categoryName: category.categoryName,
          ratedProductCount: categoryRatingsMap[categoryId],
          averageRating: averageRating.toFixed(2), // Limit to 2 decimal places
          categoryImageUrl: category.categoryImageUrl,
          categoryId: category.id,
        });
      }
    }

    // Sort the categories manually in descending order based on ratedProductCount
    for (let i = 0; i < sortedCategories.length; i++) {
      for (let j = i + 1; j < sortedCategories.length; j++) {
        if (
          sortedCategories[i].ratedProductCount <
          sortedCategories[j].ratedProductCount
        ) {
          const temp = sortedCategories[i];
          sortedCategories[i] = sortedCategories[j];
          sortedCategories[j] = temp;
        }
      }
    }

    const myResponse = {
      message: 'Categories with most rated products retrieved successfully',
      success: true,
      data: sortedCategories,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
