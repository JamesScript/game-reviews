function renderReviews(reviews) {
  // All reviews for all games go in container
  const container = $("#reviewContainer");
  // Iterate through all games 
  reviews.data.map(datum => {
    // Everything about a particular game goes into reviewDiv
    const reviewDiv = $("<div>").addClass("game");
    const heading = $("<h2>").addClass("gameName").text(datum.gameName);
    let ratings = [];
    // Iterate through individual reviews
    datum.reviews.map(reviewObj => {
      const review = $("<div>").addClass("review");
      // Give stars
      const stars = $("<div>").addClass("stars");
      let starsText = "";
      // add emoji for stars to string above
      const ratingNum = Number(reviewObj.rating);
      for (let i = 0; i < 5; i++) {
        starsText += ratingNum > i ? "&#11088;" : "&#9733;";
      }
      ratings.push(ratingNum);
      stars.html(starsText);
      // Main body of the review, the review itself
      const mainText = $("<p>").text(reviewObj.review);
      // Name of reviewer
      const author = $("<p>").addClass("smallerWriting").text("-- "+reviewObj.author);
      // Append all elements to div called 'review'
      review.append(stars);
      review.append(mainText);
      review.append(author);
      // Append this particular review to the parent div
      reviewDiv.append(review);
    });
    // Find average rating
    let averageRating = ratings.reduce((acc, current, index) => {
      const sum = acc + current;
      return index < ratings.length-1 ? sum : sum / ratings.length;
    });
    // If there's more than 2 decimal places, cap it there
    if (averageRating * 100 !== Math.floor(averageRating) * 100) {
        averageRating = averageRating.toFixed(2);
    }
    // Prepend average rating then heading last for simplicity
    const avgRatingText = $("<p>").addClass("smallerWriting").text("Average Rating: "+averageRating+" / 5");
    reviewDiv.prepend(avgRatingText);
    reviewDiv.prepend(heading);
    // Append all reviews of particular game to the parent div containing all reviews of all games
    container.append(reviewDiv);
  });
}