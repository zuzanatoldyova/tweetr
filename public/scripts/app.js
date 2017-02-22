"use strict";
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {


  var tweetData = {
    "user": {
      "name": "Newton",
      "avatars": {
        "small": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  };

  var data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];


  function createTweetElement(tweetData) {
    const $avatar = $("<img>").attr("src", tweetData.user.avatars.small);
    const $name = $("<div>").addClass("name").text(tweetData.user.name);
    const $handle = $("<div>").addClass("handle").text(tweetData.user.handle);
    const $header = $("<header>").append($avatar, $name, $handle);
    const $p = $("<p>").text(tweetData.content.text);
    console.log(tweetData["created_at"]);
    const $date = $("<div>").addClass("date").text(Math.floor((Date.now() - tweetData["created_at"]) / 86400000) + " days ago");
    const $icons = $("<div>").addClass("icons");
    const icons = ['flag', 'retweet', 'heart'];
    for (let icon of icons) {
      $icons.append($("<i>").addClass(`fa fa-${icon} fa-lg`).attr("aria-hidden", true));
    }
    const $footer = $("<footer>").append($date, $icons);
    console.log($footer.children());
    const $tweet = $("<article>").addClass("tweet").append($header, $p, $footer);
    return $tweet;
  }

  function renderTweets(data) {
    for (let tweet in data) {
      $('#tweets-container').prepend(createTweetElement(data[tweet]));
    }
  }

  var $tweet = createTweetElement(tweetData);
  console.log($tweet);
  $('#tweets-container').prepend($tweet);
  renderTweets(data);


  $('input').on('click', function() {
    event.preventDefault();
    let data = $( "textarea, input" ).serialize();
    console.log(data);
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: data,
      success: function (data) {
        console.log('hello');
        // $button.replaceWith(morePostsHtml);
      }
    });
  });
});