"use strict";
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweetData) {
  const $avatar = $("<img>").attr("src", tweetData.user.avatars.small);
  const $name = $("<div>").addClass("name").text(tweetData.user.name);
  const $handle = $("<div>").addClass("handle").text(tweetData.user.handle);
  const $header = $("<header>").append($avatar, $name, $handle);
  const $p = $("<p>").text(tweetData.content.text);
  const $date = $("<div>").addClass("date").text(Math.floor((Date.now() - tweetData["created_at"]) / 86400000) + " days ago");
  const $icons = $("<div>").addClass("icons");
  const icons = ['flag', 'retweet', 'heart'];
  for (let icon of icons) {
    $icons.append($("<i>").addClass(`fa fa-${icon} fa-lg`).attr("aria-hidden", true));
  }
  const $footer = $("<footer>").append($date, $icons);
  const $tweet = $("<article>").addClass("tweet").append($header, $p, $footer);
  return $tweet;
}

function renderTweets(data) {
  for (let tweet in data) {
    $('#tweets-container').prepend(createTweetElement(data[tweet]));
  }
}

$(document).ready(function() {
  $('.new-tweet').toggle();

  $('#nav-bar button').click(function () {
    $('.new-tweet').slideToggle("slow");
    $('.new-tweet textarea').focus();
  });

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

  $('.new-tweet').on('submit', 'form', function() {
    event.preventDefault();
    let $counter = $(this).children('.counter');
    let $textarea = $(this).children('textarea');
    if ($counter.hasClass('red')) {
      alert('tweet is too long, maximum length is 140 characters');
    } else if($textarea.val().length){
      let data = $('textarea').serialize();
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

  loadTweets();

});