let leftPanelShowing = true;

$( document ).ready(function() {
  // Fill main part of the page with all the reviews in database
  $.get('/allReviews', data => {
    // console.log(data);
    renderReviews(data);
  });
   
  // Form submittion with new message in field with id 'm'
  $('#submitReview').click(function(){
    const gameName = $('#gameName').val();
    const rating = $('#rating').val();
    const review = $('#reviewField').val();
    const infoPackage = {gameName: gameName, rating: rating, review: review};
    $.post("/submitReview/", infoPackage, data => {
      console.log(data);
    });
    // return false; // prevent form submit from refreshing page
  });
  
  $('#closeOpenPanel').click(() => {
    if (leftPanelShowing) {
      $('.leftPanel').hide();
      leftPanelShowing = false;
      $('#closeOpenPanel').html(">>");
    } else {
      $('.leftPanel').show();
      leftPanelShowing = true;
      $('#closeOpenPanel').html("<<");
    }
  });
  
});
