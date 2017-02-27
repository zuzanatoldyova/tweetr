'use strict';

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  if ($('#nav-bar').data()) {
    createUser();
  }

  $('.new-tweet').toggle();

  $('.login').toggle();
  $('.register').toggle();
  $('.compose').toggle();
  $('.logout').toggle();

  $('#nav-bar .compose').click(function () {
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });

  $('.login-button').click(function () {
    $('.login').slideToggle();
  });

  $('.register-button').click(function () {
    $('.register').slideToggle();
  });

  function createUser(userData) {
    if (!userData) {
      $('#nav-bar').removeData();
      $('#nav-bar .buttons p').remove();
      return;
    }
    $('#nav-bar').data('user', userData.handle);
    let $loggedin = $('#nav-bar').data('user');
    $('#nav-bar .buttons').append($('<p>').text($loggedin));
    toggleButtons();
  }

  // function retrieveUser(){
  //   $.ajax({
  //     url: '/users'
  //     method: 'GET'
  //   }).then(function(data){
  //     createUser(data);
  //   }).catch(function(err){
  //     console.log(err.responseText);
  //   });
  // }

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

  function toggleButtons(){
    $('.logout').toggle();
    $('.compose').toggle();
    $('.register-button').toggle();
    $('.login-button').toggle();
  }

  function getUser(callback) {
    $.ajax({
      url: '/users',
      method: 'GET'
    }).then(function(data) {
      callback(data);
    }
  ).catch(function(err) {
      console.log(err);
    });
  }

  // event logging in of a user
  $('.container').on('submit', '.login', function() {
    event.preventDefault();
    let data = $('.login input').serialize();
    $('.login input').val('');
    $.ajax({
      url: '/login',
      method: 'POST',
      data: data
    }).then(function(data) {
      createUser(data);
      $('.login').toggle();
    }).catch(function(err) {
      console.log(err);
    });
  });

  // event of registration of a user
  $('.container').on('submit', '.register', function() {
    event.preventDefault();
    let data = $('.register input').serialize();
    console.log(data);
    $('.register input').val('');
    $.ajax({
      url: '/users',
      method: 'POST',
      data: data
    }).then(function(data) {
      toggleButtons();
      $('.register').toggle();
    }).catch(function(err) {
      console.log(err);
    });
  });

  // loggs out a user, clears cookie session
  $('.logout').on('click', function() {
    console.log('logging out');
    $.ajax({
      url:'/login',
      method: 'DELETE'
    }).then(function(data) {
      toggleButtons();
      $('#nav-bar').removeData();
      createUser(null);
      console.log('Logged out');
    }).catch(function(err) {
      console.log(err);
    })
  });

  // Validates a tweet text input and if it's valid creates an ajax request to post the tweet on the screen reloads all the tweets from database
  $('.new-tweet').on('submit', 'form', function() {
    event.preventDefault();
    let $counter = $(this).children('.counter');
    let $textarea = $(this).children('textarea');
    if ($counter.hasClass('red')) {
      alert('tweet is too long, maximum length is 140 characters');
    } else if($textarea.val().trim().length){
      let text = $('textarea').serialize();
      // clearing a form
      $textarea.val('');
      $counter.text('140');
      // only logged in users can post tweets, retrieving information about logged in user
      getUser(x => {
        let queryUser = {};
        queryUser.user = x;
        let user = jQuery.param(queryUser);
        let data = `${text}&${user}`;
        // request posting a tweet, send parameters user and text
        $.ajax({
          url: '/tweets',
          method: 'POST',
          data: data
        }).then(function(data) {
          $('#tweets-container').empty();
          loadTweets();
        }).catch(function(err) {
          console.log(err);
          alert('An error occured');
        });
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
      console.log(err);
      alert('An error occured: ' + err.responseText);
    });
  });

  // Initial load of the tweets and user
  loadTweets();
  getUser(createUser);

});
