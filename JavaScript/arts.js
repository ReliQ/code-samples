/**
 *	ReliQ Arts | ReliQ Arts
 *	arts js - 	System
 * 	@author:	Patrick Reid - @IAmReliQ
 * 	@link:		reliqarts.com 
 */

$.extend(verge);
$(function() {
    var bbiBox      = $('#bbi.imaged');
    var bbiTop      = (bbiBox.length > 0) ? parseInt(bbiBox.css('margin-top')) : null;
    var wowiOffset  = ($.viewportW() <= 400) ? 0 : (-($.viewportH() - ($('#hdr').height() + $('#grit').height()) - 420));
    var ttOffset    = 220;
    var ttDuration  = 1000;
    var scrlWidth   = 860;
    function log(message){
        console.log(message);
    }
    function svgCh() {
        $('*[class]').filter(function() {
          return $(this).css('background-image').toLowerCase().indexOf('sheblu.svg') > -1;
        }).css('background', 'url(./assets/img/core/sheblu.png) no-repeat left / cover');
        /* 
        $('img').filter(function() {
          return $(this).attr('href').toLowerCase().indexOf('logo.svg') > -1;
        }).attr('href', 'http://www.reliqarts.com/assets/img/core/logo.png');
        */
    } if (!Modernizr.svg) { svgCh(); }
    function sizeLogo() {
        var liv = $('header#hdr #nav #logo-case .liv');
        var size = "auto";
        if ($.viewportW()  > 860) {
            size = ( liv.parent().width() + (6*2) ) + 'px';
        }
        liv.css({'width': size});
    }
    $(window).load(function() {
        sizeLogo();
        $('#pr3s #st8').fadeOut();
        $('#pr3s').delay(350).fadeOut('slow');
        $('body').delay(350).css({'overflow':'visible'});
    });
    $(window).resize(function() {
        sizeLogo();
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > ttOffset) {
            if ($.viewportW() > 150) $('#to-top').fadeIn(ttDuration);
        } else {
            $('#to-top').fadeOut(ttDuration);
        }
        if ($.viewportW() > scrlWidth) { 
            if (bbiBox.length > 0) {
                if ($(this).scrollTop() < bbiBox.height()) {
                    bbiBox.css('margin-top', bbiTop+($(this).scrollTop() / 3) + 'px');
                }    
            }
            if ( (!$.inViewport($('#hdr')) && ($.viewportW() > 250) ) ) { 
                $('#hdr').height($('#hdr').height() + 'px'); 
                $('#hdr').addClass('s3t'); 
            } else { 
                $('#hdr').height('auto');
                $('#hdr').removeClass('s3t'); 
            }
            /*$('body.glazed').css('background-position', 'center '+ ($(this).scrollTop() / 11)+'px');*/
            $('.h-block').each(function() {
                if ($.inViewport($(this), -80)) {
                    $(this).find('.con').css('opacity', 1);
                    $(this).find('.teas').css({'position':'relative', 'right':'0px', 'opacity':'1'});
                }
            });
        }
    });
	$('aside#menu-switch').prepend('<a href="#" class="bt-menu-trigger fa-bars"><span>Menu</span></a href="#">');
	$('aside#menu-switch .bt-menu-trigger').click(function(e){
		e.preventDefault();
		if($(this).closest('#menu-switch').siblings('ul').is(":visible")){
			$(this).closest('#menu-switch').siblings('ul').slideUp(100);
			$(this).removeClass('open');
		}else{
			$(this).closest('#menu-switch').siblings('ul').slideDown(100);
			$(this).addClass('open');
		}
	});
	$('a#to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, ttDuration);
    });
    $('section#inner:not(.home)').css('min-height', ($.viewportH() - ($('#hdr').height() + $('#hdr').height())) + 'px');
    if ($.viewportW() > scrlWidth) { 
         $('.h-block').each(function() {
            if ( ! $.inViewport($(this), -80)) {
                $(this).find('.con').css('opacity', 0);
                $(this).find('.teas').css('position', 'relative').css({'right':'-100%', 'opacity':'0'});
            }
        });
        $('#project-grid .project.item').addClass('wow fadeInUp no-trans-me').attr({'data-wow-offset': wowiOffset, 'data-wow-delay': '.2s'});
        new WOW({}).init(); /* Start WOW */
    }
    $('.skillbar').waypoint(function () {
        $('.skillbar').each(function () {
            $(this).find('.skillbar-bar').animate({
                width: $(this).attr('data-percent')
            }, 3000);
        });
    }, {
        offset: '85%'
    });
    $('form .submit').click(function(e){
    	e.preventDefault();
    	$(this).closest('form').submit();
    });
    $('form').submit(function(e){
    	var q = $(this).find('input[name="q"]');
    	if (q.length > 0) {
    		if (q.val().length < 3) {
    			log('Query too short!');
    			q.focus(function(e){
    				$(this).addClass('error');
    			}); 
    			q.blur(function(e){
    				$(this).removeClass('error');
    			});
    			q.focus();
    			e.preventDefault();
    		}
    	}
    });
	
});