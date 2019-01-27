// function sortByAlphabetical() {
//   allReviews.data = allReviews.data.sort((a, b) => {
//     const shorterWord = a.length < b.length ? a.length : b.length;
//     for (let i = 0; i < shorterWord; i++) {
//       const aChar = a.gameName[i].toLowerCase();
//       const bChar = b.gameName[i].toLowerCase();
//       if (aChar !== bChar) {
//         return aChar.charCodeAt(0) - bChar.charCodeAt(0);
//       }
//     }
//   });
//   console.log("Brap");
//   renderReviews(allReviews);
// }

function sortByRating() {
  allReviews.data.sort((a,b)=> {
    return b.averageRating - a.averageRating;
  });
  renderReviews(allReviews);
}