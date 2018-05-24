/*
 * Ensconce
 * (c) 2013, Web factory Ltd
 */
 
$(function() {
  // animate image when it comes into view
  $('.animate').parents('section').one('inview', function (event, visible) {
      $('.animate', this).delay(300).fadeIn(2000);
  });
  
  // smooth scrolling
  $('.smoothscroll').click(function(e) {
    el = $(this).attr('href');
    $('html, body').animate({scrollTop: $(el).offset().top - 190}, 'slow');
    e.preventDefault();
    
    return false;
  });

  // main dropdown menu
  $('ul#main-navigation li').hover(function(){
      $(this).children('ul').delay(20).fadeIn(200);
    }, function(){
      $(this).children('ul').delay(20).fadeOut(200);
  });
  
  // generate mobile menu
  if ($('#main-menu-select').length && $('#main-menu-select').attr('data-autogenerate') == 'true') {
    var mobile_menu = $('#main-menu-select');
    $('#main-navigation li a').each(function(index, elem) {
      if ($(elem).parents('ul.drop').length) {
        tmp = '&nbsp;&nbsp;-&nbsp;' + $(elem).html();
      } else {
        tmp = $(elem).html();
      }
      
      if ($(elem).parent('li').hasClass('current-menu-item')) {
        mobile_menu.append($('<option></option>').val($(elem).attr('href')).html(tmp).attr('selected', 'selected'));
      } else {
        mobile_menu.append($('<option></option>').val($(elem).attr('href')).html(tmp));
      }
    });
  }
  
  // mobile menu click
  $('#main-menu-select').change(function() { 
    link = $(this).val();
    if (!link) {
      return;
    }  
    document.location.href = link;
  });

  // filterable portfolio
  $('#portfolio-gallery').filterable();

  // lightbox gallery on portfolio
  if ($("a[data-gal^='prettyPhoto']").length) {
    $("a[data-gal^='prettyPhoto']").each(function(ind, el) {
      $(el).attr('rel', $(el).attr('data-gal'));
    });
    
    $("a[rel^='prettyPhoto']").prettyPhoto({social_tools: false, deeplinking: false});
  }

  // flex slider in section
  if ($('#main-slider').length) {
    $('#main-slider').flexslider({
      animation: "fade",
      directionNav: true,
      controlNav: true,
      pauseOnAction: true,
      pauseOnHover: true,
      direction: "horizontal",
      slideshowSpeed: 4000,
      slideshow: true
    });
  }


  // flex slider in header
  if ($('#full-slider').length) {
    $('#full-slider').flexslider({
      animation: "fade",
      directionNav: true,
      controlNav: false,
      pauseOnAction: true,
      pauseOnHover: true,
      direction: "horizontal",
      slideshowSpeed: 3000,
      slideshow: false,
      before: function(slider) { $('#full-slider .flex-caption').fadeOut(100); },
      after: function(slider) { $('#full-slider .flex-caption').fadeIn(900); }
    });
  }

  // links & icons hover effects
  $('#footer-navigation li a').css('opacity', '.35');
  $('#footer-navigation li a').hover(
    function () {
      $(this).stop().animate({ opacity: 1 }, 'normal');
    },
    function () {
      $(this).stop().animate({ opacity: .35 }, 'normal');
  });
    
  $('.over').css('opacity', '0');
  $('.over').hover(
    function () {
       $(this).stop().animate({ opacity: 1 }, 'slow');
    },
    function () {  
       $(this).stop().animate({ opacity: 0 }, 'slow');
  });

  // to top button
  $(window).scroll(function(){
    if ($(window).scrollTop() > 100){
      $('#totop').css('visibility','visible');
    }
  });
  $(window).scroll(function(){
    if ($(window).scrollTop() < 100){
      $('#totop').css('visibility','hidden');
    }
  });
    $("#totop a").click(function(){
      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  // gmap init
  $('.gmap').each(function(index, element) {
    var gmap = $(element);
    var addr = 'http://maps.google.com/maps?hl=en&ie=utf8&output=embed&sensor=true&iwd=1&mrt=loc&t=m&q=' + encodeURIComponent(gmap.attr('data-address'));
    addr += '&z=' + gmap.attr('data-zoom');
    if (gmap.attr('data-bubble') == 'true') {
      addr += '&iwloc=addr';
    } else {
      addr += '&iwloc=near';
    }
    gmap.attr('src', addr);
  });
  
  // load captcha question for contact form
  if ($('#captcha-img').length) {
    $.get('_captcha.php?generate', function(response) {
      $('#captcha-img').html(response);
    }, 'html');
  }
  
  // contact form
  if ($('#contact_form').length > 0) {
    $('#contact_form').validate({ rules: { name: { required: true},
                                           email: { required: true, email: true },
                                           message: { required: true },
                                           captcha: { required: true, remote: '_captcha.php' }},
                                 messages: { name: 'This field is required.',
                                             email: { required: 'This field is required.',
                                                      email: 'Please enter a valid email address.'},
                                             message: 'This field is required.',
                                             captcha: 'Are you really a human?'},
                                 submitHandler: function(form) {  $(form).ajaxSubmit({ dataType: 'json',
                                                                                        success: contactFormResponse }); }
                              });
  } // if contact form
}); // onload

// handle contact form AJAX response
function contactFormResponse(response) {
  if (response.responseStatus == 'err') {
    if (response.responseMsg == 'ajax') {
      alert('Error - this script can only be invoked via an AJAX call.');
    } else if (response.responseMsg == 'notsent') {
      alert('We are having some mail server issues. Please refresh the page or try again later.');
    } else {
      alert('Undocumented error. Please refresh the page and try again.');
    }
  } else if (response.responseStatus == 'ok') {
    alert('Thank you for contacting us! We\'ll get back to you ASAP.');
  } else {
    alert('Undocumented error. Please refresh the page and try again.');
  }
  
  location.reload(true);
} // contactFormResponse
