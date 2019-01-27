let leftPanelShowing = true;
let allReviews;

$( document ).ready(function() {
  // Fill main part of the page with all the reviews in database
  $.get('/allReviews', _reviews => {
    // Store data in this variable so that we can sort without another get request
    allReviews = _reviews;
    // Sort by putting most reviewed game at top
    _reviews.data.sort((a, b) => b.reviews.length - a.reviews.length);
    renderReviews(_reviews);
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
    resizeMenu();
  });
  
  // Hamburger Menu
  const menu = $("#menu");
  menu.hide();
  let menuShowing = false;
  let hidingTimeout;
  $("#hamburger").click(() => {
    clearTimeout(hidingTimeout);
    resizeMenu();
    // Toggle animation
    for (let i = 0; i < 3; i++) {
      const choices = ["line_"+i+"toCross", "line_"+i+"toBurger"];
      $("#line_"+i)
        .removeClass(choices[Number(!menuShowing)])
        .addClass(choices[Number(menuShowing)]);
    }
    menuShowing = !menuShowing;
    // Toggle Menu
    const menuChoices = ["showMenu", "hideMenu"];
    menuShowing ? menu.show() : hidingTimeout = setTimeout(() => { menu.hide() }, 500);
    menu
      .removeClass(menuChoices[Number(menuShowing)])
      .addClass(menuChoices[Number(!menuShowing)]);    
  });
  
  // Make meu fit the right panel's width, activate upon showing menu and open / closing left panel
  function resizeMenu() {
    const rightPanel = $(".rightPanel");
    menu.width(rightPanel.width());
  }
  
});
