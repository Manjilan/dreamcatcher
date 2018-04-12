$(document).ready(function(){
  $('.editButton').on('click', function(){
    $('.modal1').css('display', 'flex').hide().fadeIn();
  });
  $('.createPost').on('click', function(){
    $('.modal').css('display', 'flex').hide().fadeIn();
  });
  $('.close').on('click', function(){
      $('.modal').css('display', 'none');
      $('.modal2').css('display', 'none');
  });
  $('#deactivate').on('click', function(){
    $('.modal2').css('display', 'flex').hide().fadeIn();
  })
})
