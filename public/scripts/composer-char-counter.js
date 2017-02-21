$(document).ready(function() {
  $('.new-tweet').on('keyup', 'textarea', function() {
    $('.counter').removeClass('red');
    var tweetLength = $(this).val().length;
    $('.counter').text(140 - tweetLength);
    if (Number($('.counter').text()) < 0) {
      console.log('here');
      $('.counter').addClass('red');
    }
  });
});
