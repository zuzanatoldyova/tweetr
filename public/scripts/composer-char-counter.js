$(document).ready(function() {
  const MAX_LENGTH = 140;
  // let flagCounterError = false;
  $('.new-tweet').on('input', 'textarea', function() {
    let $counter = $(this).siblings('.counter');
    $counter.removeClass('red');
    let tweetLength = $(this).val().length;
    let remainingCharacters = MAX_LENGTH - tweetLength;
    $counter.text(remainingCharacters);
    // $counter.css('color', remainingCharacters < 0 ? 'red' : 'black');
    if (remainingCharacters < 0) {
      $counter.addClass('red');
    }
  });
});
