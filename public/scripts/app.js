'use strict';
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  $('.new-tweet').toggle();

  $('#nav-bar button').click(function () {
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });

  // Creates an html element class tweet
  function createTweetElement(tweetData) {
    const $avatar = $('<img>').attr('src', tweetData.user.avatars.small);
    const $name = $('<div>').addClass('name').text(tweetData.user.name);
    const $handle = $('<div>').addClass('handle').text(tweetData.user.handle);
    const $header = $('<header>').append($avatar, $name, $handle);
    const $p = $('<p>').text(tweetData.content.text);
    const $date = $('<div>').addClass('date').text(Math.floor((Date.now() - tweetData['created_at']) / 86400000) + ' days ago');
    const $counter = $('<span>').addClass('likes-counter').text(tweetData.likes);
    const $icons = $('<div>').addClass('icons');
    const icons = ['flag', 'retweet', 'heart'];
    for (let icon of icons) {
      $icons.append($('<i>').addClass(`fa fa-${icon} fa-lg`).attr('aria-hidden', true));
    }
    $icons.append($counter);
    const $footer = $('<footer>').append($date, $icons);
    const $tweet = $('<article>').addClass('tweet').data('id', tweetData._id).append($header, $p, $footer);
    return $tweet;
  }

  function renderTweets(data) {
    for (let tweet in data) {
      $('#tweets-container').prepend(createTweetElement(data[tweet]));
    }
  }

  function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    }).then(function (data) {
      renderTweets(data);
    }).catch(function(err) {
      alert('An error occured', err);
    });
  }

  // Validates a tweet text input and if it's valid creates an ajax request to post the tweet on the screen reloads all the tweets from database
  $('.new-tweet').on('submit', 'form', function() {
    event.preventDefault();
    let $counter = $(this).children('.counter');
    let $textarea = $(this).children('textarea');
    if ($counter.hasClass('red')) {
      alert('tweet is too long, maximum length is 140 characters');
    } else if($textarea.val().trim().length){
      let data = $('textarea, .tweet-counter').serialize();
      $textarea.val('');
      $counter.text('140');
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: data
      }).then(function(data) {
        $('#tweets-container').empty();
        loadTweets();
      }).catch(function(err) {
        alert('An error occured', err);
      });
    } else {
      alert('tweet is empty');
    }
  });

  // Creates an ajax request to update the database after like button was clicked, reloads the tweeets database
  $('#tweets-container').on('click', '.fa-heart', function() {
    event.preventDefault();
    let id = $(this).parents('.tweet').data('id');
    $.ajax({
      url: `/tweets/${id}/likes`,
      method: 'POST',
      data: `id=${id}`
    }).then(function (data) {
      $('#tweets-container').empty();
      loadTweets();
    }).catch(function(err) {
      alert('An error occured', err);
    });
  });

  // Initial load of the tweets
  loadTweets();
});