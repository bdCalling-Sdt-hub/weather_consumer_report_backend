export const calculateRatingPercentage = (
  ratingStats: Record<string, number>
): Record<string, number> => {
  // Get the total number of ratings
  let totalRatings = 0;
  for (const key in ratingStats) {
    totalRatings += ratingStats[key];
  }

  // If no ratings exist, return all as 0
  if (totalRatings === 0) {
    return {
      oneStar: 0,
      twoStar: 0,
      threeStar: 0,
      fourStar: 0,
      fiveStar: 0,
    };
  }

  // Calculate percentage for each category (without % symbol)
  const percentageStats: Record<string, number> = {};
  for (const key in ratingStats) {
    percentageStats[key] = parseFloat(
      ((ratingStats[key] / totalRatings) * 100).toFixed(2)
    );
  }

  return percentageStats;
};

export const refineStars1 = (ratingDistribution: any) => {
  const ratingStats = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };

  for (let i = 0; i < ratingDistribution.length; i++) {
    const { _id, count } = ratingDistribution[i];
    if (_id >= 1 && _id < 2) ratingStats.oneStar = count;
    else if (_id >= 2 && _id < 3) ratingStats.twoStar = count;
    else if (_id >= 3 && _id < 4) ratingStats.threeStar = count;
    else if (_id >= 4 && _id < 5) ratingStats.fourStar = count;
    else if (_id === 5) ratingStats.fiveStar = count;
  }

  const ratingStats2 = calculateRatingPercentage(ratingStats);
  return ratingStats2;
};
