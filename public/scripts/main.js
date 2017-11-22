
$(function(){

  // VARIABLES & PAGE ELEMENTS

  var $loadButton = $('#load');
  var $gameLoadButton = $('#gameLoad');
  var $gameBoard = $('#gameBoard');
  var $playerCard = $('.playerCard');
  var $submit = $('#submit');
  var $compCard = $('.compCard');
  var $artistsList = $('#artistsList');

  var $addForm = $('#addForm');
  var $inputArtistName = $('#inputArtistName');
  var $inputImg = $('#inputImg');
  var $inputFavSong = $('#inputFavSong');
  var $inputSubGenre = $('#inputSubGenre');
  var $inputNoAlbums = $('#inputNoAlbums');
  var $inputNoCollabs = $('#inputNoCollabs');
  var $inputNoAlterEgos = $('#inputNoAlterEgos');
  var $inputNoRecordsSold = $('#inputNoRecordsSold');
  var $inputAge = $('#inputAge');

  var $inputs = [
    $inputArtistName,
    $inputImg,
    $inputFavSong,
    $inputSubGenre,
    $inputNoAlbums,
    $inputNoCollabs,
    $inputNoAlterEgos,
    $inputNoRecordsSold,
    $inputAge
  ];

  var playerCard = null;
  var compCard = null;
  var playerCardCompare = null;
  var getCompVal = null;
  var compCardCompare = null;

  // GENERATED ELEMENTS

  var $spinner = $('<i class="fa fa-refresh" aria-hidden="true"></i>');

  // HELPER FUNCTION

  function errorHandler(error){ //just to show you how to error catch
    console.error(error);
  }

  // WATCH OUT THEY ARE SYNCHRONOUS

  function pickTwo() {
    console.log('Picked Two');
    $.ajax({
      url: '/artists'
    }).done(function (response){
      var cardOne = Math.round(Math.random()*(response.length - 1));
      var cardTwo = Math.round(Math.random()*(response.length - 1));
      while (cardOne === cardTwo) {
        cardTwo = Math.round(Math.random()*(response.length - 1));
      }
      playerCard = response[cardOne];
      compCard = response[cardTwo];
      console.log(playerCard, compCard);
      dealCards();
      }).fail(errorHandler);
  };

  function repickTwo() {
    console.log('Repicked Two');
    $.ajax({
      url: '/artists'
    }).done(function (response){
      var cardOne = Math.round(Math.random()*(response.length - 1));
      var cardTwo = Math.round(Math.random()*(response.length - 1));
      while (cardOne === cardTwo) {
        cardTwo = Math.round(Math.random()*(response.length - 1));
      }
      playerCard = response[cardOne];
      compCard = response[cardTwo];
      console.log(playerCard, compCard);
      dealCards();
      }).fail(errorHandler);
  }

  function dealCards() {
    $playerCard.html('');
    $compCard.html('');
    $playerCard.append(
      '<h2>' + playerCard.name + '</h2><p><img src="' + playerCard.img + '" height="200px" /></p><label>Favourite Song</label><p>'
       + playerCard.favSong + '</p><label>Sub Genre</label><p>'
       + playerCard.subGenre + '</p><label>Age</label><input name="choices" value="' + playerCard.age + '" id="1" type="radio">'
       + playerCard.age + '</input><label>No Albums</label><input name="choices" value="' + playerCard.noAlbums + '" id="2" type="radio">'
       + playerCard.noAlbums + '</input><label>No Collabs</label><input name="choices" value="' + playerCard.noCollabs + '" id="3" type="radio">'
       + playerCard.noCollabs + '</input><label>No Alter Egos</label><input name="choices" value="' + playerCard.noAlterEgos + '" id="4" type="radio">'
       + playerCard.noAlterEgos + '</input><label>No Records Sold</label><input name="choices" value="' + playerCard.noRecordsSold + '" id="5" type="radio">'
       + playerCard.noRecordsSold + '</input>'
    );
    $compCard.append(
      '<h2>' + compCard.name + '</h2><p><img src="' + compCard.img + '" height="200px" /></p><label>Favourite Song</label><p>'
       + compCard.favSong + '</p><label>Sub Genre</label><p>'
       + compCard.subGenre + '</p><label>Age</label><input name="match" value="' + compCard.age + '" id="1" type="hidden">???'
       + '</input><label>No Albums</label><input name="match" value="' + compCard.noAlbums + '" id="2" type="hidden">???'
       + '</input><label>No Collabs</label><input name="match" value="' + compCard.noCollabs + '" id="3" type="hidden">???'
       + '</input><label>No Alter Egos</label><input name="match" value="' + compCard.noAlterEgos + '" id="4" type="hidden">???'
       + '</input><label>No Records Sold</label><input name="match" value="' + compCard.noRecordsSold + '" id="5" type="hidden">???'
       + '</input>'
    );
    // console.log(playerCard.name);
    Submit();
  }

  function Submit() {
    if ($('input[name="choices"]:checked')) {
      $('#submit').on('submit', function(e) {
        e.preventDefault();
        playerCardCompare = $('input[name="choices"]:checked').val();
        getCompVal = $('input[name="choices"]:checked').attr('id');
        compCardCompare = $('input[name="match"][id="' + getCompVal + '"]').val();
        console.log(playerCardCompare, compCardCompare);
        gameOfTwenty();
      });
    } else {
      alert('Please choose an option!');
    }
  }

  var noPlays = null;
  var playerPoints = null;
  var compPoints = null;

  function gameOfTwenty() {
    if (noPlays < 20) {
      noPlays += 1;
      compareValues();
    } else {
      noPlays = null;
      playerPoints = null;
      compPoints = null;
      $gameBoard.html('<h1>That\'s all folks! Highest scorer wins!')
    }
  }

  function compareValues() {
    if (playerCardCompare > compCardCompare) {
      playerPoints += 1;
      console.log('Player:', playerPoints, 'Computer:', compPoints);
      clearChecks();
    } else if (playerCardCompare === compCardCompare) {
      console.log('Player:', playerPoints, 'Computer:', compPoints);
      clearChecks();
    } else {
      console.log('Player:', playerPoints, 'Computer:', compPoints);
      compPoints += 1;
      clearChecks();
    }
  }

  function clearChecks() {
    $('input:radio').removeAttr('checked');
    playerCard = null;
    compCard = null;
    playerCardCompare = null;
    getCompVal = null;
    compCardCompare = null;
    repickTwo();
  }

  function getArtists() {
    // $artistsList.html($spinner);
    $.ajax({
      url: '/artists'
    }).done(function(response) {
      console.log(response);
      writeArtists(response)
    }).fail(errorHandler);
  }

  function writeArtists(artists) {
    $artistsList.html('');
    artists.forEach(function(artist) {
      $artistsList.append(
        // '<table border="1px solid black"><tr><td width="150px">' + artist.name + '</td><td width="66px">' + artist.img + '</td><td width="100px">' + artist.favSong + '</td><td width="100px">' + artist.age + '</td><td width="100px">' + artist.noAlbums + '</td><td width="100px">' + artist.noCollabs + '</td><td width="100px">' + artist.noAlterEgos + '<td width="61px"><button type="button" class="delete-button" data-id="' + artist.noRecordsSold + '">&times</button></td></tr></table>'
        '<div><p>' + artist.name + '</p><p><img src="' + artist.img + '" height="200px" /></p><p>'
         + artist.favSong + '</p><p>'
         + artist.subGenre + '</p><p>'
         + artist.age + '</p><p>'
         + artist.noAlbums + '</p><p>'
         + artist.noCollabs + '</p><p>'
         + artist.noAlterEgos + '</p><p>'
         + artist.noRecordsSold + '</p></div>'
      );
    });
  }

  function addArtist(artist) {
    console.log('Add G', artist);
    $.ajax({
      method: 'POST',
      url: '/artists',
      data: artist
    }).done(function(response) {
        getArtists();
    }).fail(errorHandler);
  }

  function clearForm() {
    // Equivalent below
    // $inputs.forEach(function($input) {
    //   $input.val('');
    // });
    $inputs.forEach($input => {
      $input.val('');
    });
  }

  // EVENT BINDINGS

  $gameLoadButton.on('click', pickTwo);
  $loadButton.on('click.load', getArtists);
  $addForm.on('submit.addArtist', function() {
    var newArtist = {
      name: $inputArtistName.val(),
      img: $inputImg.val(),
      favSong: $inputFavSong.val(),
      subGenre: $inputSubGenre.val(),
      noAlbums: $inputNoAlbums.val(),
      noCollabs: $inputNoCollabs.val(),
      noAlterEgos: $inputNoAlterEgos.val(),
      noRecordsSold: $inputNoRecordsSold.val(),
      age: $inputAge.val()
    }
    console.log('New Artist', newArtist);
    addArtist(newArtist);
    clearForm();
    return false;
  });

});
