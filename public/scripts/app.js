'use strict';

$(document).ready(function() {

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

  function toggleButtons(){
    $('.logout').toggle();
    $('.compose').toggle();
    $('.register-button').toggle();
    $('.login-button').toggle();
  }

  function loadUser(userData) {
    if (!userData) {
      $('#nav-bar .buttons p').remove();
      return;
    }
    $('#nav-bar .buttons').append($('<p>').text(userData.handle));
    toggleButtons();
  }

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
    $('#tweets-container').empty();
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
      alert('An error occured on loadTweets', err);
    });
  }

  function getUser(callback) {
    $.ajax({
      url: '/users',
      method: 'GET'
    }).then(function(data) {
      callback(data);
    }).catch(function(err) {
      console.log(err);
    });
  }

  $('.container').on('submit', '.login', function() {
    event.preventDefault();
    let data = $('.login input').serialize();
    $('.login input').val('');
    $.ajax({
      url: '/sessions',
      method: 'POST',
      data: data
    }).then(function(data) {
      $('.login').toggle();
      loadUser(data);
    }).catch(function(err) {
      console.log(err);
    });
  });

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
      $('.register').toggle();
      loadUser(data);
    }).catch(function(err) {
      console.log(err);
    });
  });

  $('.logout').on('click', function() {
    console.log('logging out');
    $.ajax({
      url: '/sessions',
      method: 'DELETE'
    }).then(function(data) {
      toggleButtons();
      $('#nav-bar').removeData();
      loadUser(null);
      console.log('Logged out');
    }).catch(function(err) {
      console.log(err);
    });
  });

  $('.new-tweet').on('submit', 'form', function() {
    event.preventDefault();
    let $counter = $(this).children('.counter');
    let $textarea = $(this).children('textarea');
    if ($counter.hasClass('red')) {
      alert('tweet is too long, maximum length is 140 characters');
    } else if($textarea.val().trim().length){
      let text = $('textarea').serialize();
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: text
      }).then(function(data) {
        $textarea.val('');
        $counter.text('140');
        loadTweets();
      }).catch(function(err) {
        console.log(err);
        alert('An error occured');
      });
    } else {
      alert('tweet is empty');
    }
  });

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

  loadTweets();
  getUser(loadUser);

});
