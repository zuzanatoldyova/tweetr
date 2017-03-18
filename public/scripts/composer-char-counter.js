$(document).ready(function() {
  const MAX_LENGTH = 140;
  $('.new-tweet').on('input', 'textarea', function() {
    let $counter = $(this).siblings('.counter'); // closest tweet find
    $counter.removeClass('red');
    let tweetLength = $(this).val().trim().length;
    let remainingCharacters = MAX_LENGTH - tweetLength;
    $counter.text(remainingCharacters);
    if (remainingCharacters < 0) {
      $counter.addClass('red');
    }
  });
});
