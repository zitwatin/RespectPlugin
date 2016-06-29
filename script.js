( function( $ ) {
	/**
	 * Respect
	 */
	var RespectComment = function( element ) {
		var obj = this;
		var $element = $( element );

		// Elements
		var elements = {};
		elements.questions = $element.find( '.respect-comment-question' );
		elements.next = $element.find( '#respect-next' );

		/**
		 * X
		 */
		this.init = function() {
			elements.questions.hide();

			$('input#submit').hide();
			$('label[for="comment"]').hide();

			obj.currentQuestion = elements.questions.first();

			obj.currentQuestion.show();
		};

		this.showNextQuestion = function() {
		
			var input = obj.currentQuestion.find( 'input' );
			
			if ( input.length < 1 ) {
				var input = obj.currentQuestion.find( 'textarea.respectveld' );			
			}
			
			if ( input.length > 1 ) {
				nextId = input.filter(':checked').data( 'respect-next' );
								
				if ( !nextId ) {
					nextId = nextIdaftermultiplechoice;
					$("#respect-next").hide();
				} else {				
					$("#respect-next").show();					
				}
								
			} else {
				nextId = input.data( 'respect-next' );
			}
					
			obj.currentQuestion.addClass('voltooid');
		//	obj.currentQuestion.hide();

			console.log(nextId);

			if ( nextId ) {

				if ( nextId == 'decommentisingevuld' ) {

					$('#respect-field-decommentisingevuld').hide();

					if ( vraagomfeedback == 'ja' ) {
						nextId = 'decommentisingevuldeerstekeer';
					} else {
						$('input#submit').replaceWith('<button name="submit" type="submit" id="submit" class="submit" style="display: block;">Ik heb naar eer en geweten respectvol gereageerd. <br/> Publiceer mijn bijdrage!</button>');
						$('#respect-next').hide();
						$('input#submit').show();
						$('.comment-subscription-form').show();						
					}

					ga('send', 'event', 'Comment', 'ingevuld');
				//	ga('send', 'event', 'Testing-Comment', 'ingevuld');
					$.cookie('koekje-waarschijnlijkopartikelgereageerd', 'ja');
				}

/*
				DEZE DOEN WE MOMENTEEL NIET
				if ( nextId == 'bedanktvooralles' ) {
					$('#respect-field-bedanktvooralles').hide();
					$('#respect-next').hide();
					$('input#submit').replaceWith('<button name="submit" type="submit" id="submit" class="submit" style="display: block;">Ik heb naar eer en geweten respectvol gereageerd. <br/> Publiceer mijn bijdrage!</button>');
					$('input#submit').show();
					$('.comment-subscription-form').show();

					ga('send', 'event', 'Eerstekeerfeedback', 'ingevuld');
				//	ga('send', 'event', 'Testing-Eerstekeerfeedback', 'ingevuld');
				} 
*/

				ga('send', 'event', 'SpectorVolgendeVraag', nextId, paginaurl);
				ga('send', 'event', 'SpectorVolgendeVraagV2', nextId);
			//	ga('send', 'event', 'Testing-SpectorVolgendeVraag', nextId, paginaurl);
			//	ga('send', 'event', 'Testing-SpectorVolgendeVraag', nextId);

				var enjoyername = $('input#author').val();

//				console.log(enjoyername);
					
				if ( !enjoyername ) {			
					enjoyername = $('.logged-in-as').text();
					enjoyername = enjoyername.replace("Ingelogd als ", "");
					enjoyername = enjoyername.replace(". Uitloggen?", "");
					ga('send', 'event', 'VisitorInfo', enjoyername, "Logged-in");
					ga('send', 'event', 'VisitedPages', enjoyername, paginaurl);
					ga('send', 'event', 'PageVisitors', paginaurl, enjoyername);
					$.cookie('koekje-enjoyername', enjoyername, { path: '/', expires: 60 });
				} else {
					ga('send', 'event', 'VisitorInfo', enjoyername, "Guest");
					ga('send', 'event', 'VisitedPages', enjoyername, paginaurl);
					ga('send', 'event', 'PageVisitors', paginaurl, enjoyername);
					$.cookie('koekje-enjoyername', enjoyername, { path: '/', expires: 60 });
				}

				$(".njoyernaam").each(function() {
				    $(this).text(enjoyername);
				});

				obj.currentQuestion = $element.find( '#' + nextId );
	
				obj.currentQuestion.show();
				
				obj.currentQuestion.find( 'textarea.respectveld' ).focus();
		
				return false;
						
			} else {
				$('#respect-next').hide();
// 				$('.voltooid').show();
//				$('input#submit').show();
//				$('.comment-subscription-form').show();
				console.log("er is geen nextid");
			}
		};

		elements.next.click( obj.showNextQuestion );

		// Function calls
		obj.init();
	};

	/**
	 * jQuery plugin - Respect Comment
	 */
	$.fn.respectComment = function() {
		return this.each( function() {
			var $this = $( this );

			if ( $this.data( 'respect' ) ) {
				return;
			}

			var respect = new RespectComment( this );

			$this.data( 'respect', respect );
		} );
	};

	var nextIdaftermultiplechoice;

	$('.respectoption').dblclick(function() {
		$("#respect-next").click();
	});
			
	$('label.respectoption').click(function() {
		$(this).siblings(".respectoption").hide();
	    setTimeout(function() {
		    console.log("geklikt");
		    nextIdaftermultiplechoice = $(this).parent().find( 'input' ).filter(':checked').data( 'respect-next' );
   		    console.log(nextIdaftermultiplechoice);
   			$("#respect-next").click();
			$(this).replaceWith( "<span class='chosenrespectoption'>" + $( this ).text() + "</span>" );
    	}, 100); 
	});

/*
	ENTER KEY
*/
	$('input#author').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) {
		$(".author-respect-next").click();	 
	    $("input#email").focus();
	    e.preventDefault();
	    return false;
	  }
	});
	$('input#email').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) { 
		$(".email-respect-next").click();
	    e.preventDefault();
	    return false;
	  }
	});
	$('#respect-field-detoegevoegdewaarde').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) { 
	    $("#respect-next").click();
	    e.preventDefault();
	    return false;
	  }
	});

/*
	DYNAMICALLY INCREASING TEXTAREA AS SEEN AT http://jsfiddle.net/viphalongpro/M6SM2/3/
*/

	var span = $('<span>').css('display','inline-block')
	.css('word-break','break-all').appendTo('body').css('visibility','hidden');
	function initSpan(textarea){
	  span.text(textarea.text())
	      .width(textarea.width())      
	      .css('font',textarea.css('font'));
	}
	$('textarea.respectveld').on({
	    input: function(){
	      var text = $(this).val();      
	      span.text(text);      
	      $(this).height(text ? span.height() : '1.1em');
	    },
	    focus: function(){
	     initSpan($(this));
	    },
	    keypress: function(e){
	        if(e.which == 13) e.preventDefault();
	    }
	});

	$("label").each(function() {
	    var labelhtml = $(this).html();
	    labelhtml = labelhtml.replace("NJOYER", "<span class='njoyernaam'></span>");
	    $(this).html(labelhtml);
	});

	var njoyername;
	
	if ( $('input#author').val() ) {
		njoyername = $('input#author').val();		
	} else if ( $('.logged-in-as').text() ) {
		njoyername = $('.logged-in-as').text();
		njoyername = njoyername.replace("Ingelogd als ", "");
		njoyername = njoyername.replace(". Uitloggen?", "");		
	} else {
		njoyername = "";
	}
	
	$(".njoyernaam").each(function() {
	    $(this).text(njoyername);
	});

	var vraagomfeedback = 'geenfeedback';

	var gebruikerisingelogd = $('.logged-in-as').length;

	var paginaurl = $(location).attr('href');
	
	console.log(paginaurl);
	console.log(gebruikerisingelogd);

	var spectorimgsrc = $(".spector-profilepicture").attr("src");
	var waardeimgsrc = $(".toegevoegdewaarde-icoon").attr("src");

	$('.author-respect-next').click(function() {
	    if( $("input#author").val() ) {
				$(this).hide();   	
			$(".comment-form-email").show();	
	    } else {
			$("#respect-next").hide();    
	    }
	});
	$('.email-respect-next').click(function() {
	    if( $('input#author').val() && $('input#email').val() ) {
			njoyername = $('input#author').val();
			$(".njoyernaam").each(function() {
			    $(this).text(njoyername);
			});
			$(this).hide();
			$("#detoegevoegdewaarde").show();
		   $("textarea#respect-field-detoegevoegdewaarde").focus();
			$("#respect-next").show();
	    }
	});

	$('input#author').blur(function() {
		if( $(this).val() && $('input#email').val() && $('textarea#respect-field-detoegevoegdewaarde').val() ) {
			$("#respect-next").show();	    			
	    } else {
			$("#respect-next").hide();	    
	    }
	});
	$('input#email').blur(function() {
	    if( $(this).val() && $('input#author').val() ) {
			$("#respect-next").show();
	    } else {
			$("#respect-next").hide();	  
	    }
	});

	$('.comment-subscription-form').hide();
	$('#reply-title').text('Reageer en voeg jouw waarde toe!');
	$('label[for="respect-field-decomment"]').append('<div class="despecial"><br/> \'k ben ook benieuwd naar je reactie op: "<i>' + $('.entry-content blockquote').text() +'</i>"</div>');

//		$('label[for="respect-field-deoproep"]').text($('.entry-content blockquote').text());		
	$('#comment').appendTo('#decomment');
	$('#comment').attr('placeholder','Bijdrageveld 2 van 2');	
	$('.comment-subscription-form').prependTo(".form-submit");
	
	$.urlParam = function(name){
	    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}

	if ( $.urlParam('replytocom') ) {
		$(".despecial").hide();
	}

/*
	TAB KEY	
*/

		$('#author').keydown(function(e) {
		   console.log('keyup called');
		   var code = e.keyCode || e.which;
		   if (code == '9') {	
			   e.preventDefault();
			   $(".author-respect-next").click();
   			   $("#email").focus();
			   return false;
		   }		
		});
		$('#email').keydown(function(e) {
		   console.log('keyup called');
		   var code = e.keyCode || e.which;
		   if (code == '9') {	
			   e.preventDefault();
			   $(".email-respect-next").click();
			   return false;
		   }		
		});
		$('#respect-field-detoegevoegdewaarde').keydown(function(e) {
		   console.log('keyup called');
		   var code = e.keyCode || e.which;
		   if (code == '9') {	
			   e.preventDefault();
			   $("#respect-next").click();
   			   $("#comment").focus();
			   return false;
		   }		
		});
		$('#comment').keydown(function(e) {
		   console.log('keyup called');
		   var code = e.keyCode || e.which;
		   if (code == '9') {	
			   e.preventDefault();
			   $("#respect-next").click();
		   console.log('time for scrolltop');
				var element_to_scroll_to = document.getElementById('decomment');
				element_to_scroll_to.scrollIntoView();
			   return false;
		   }		
		});
	
	$("article header h1").before('<span class="eengesprekover" id="eengesprekover">Een gesprek over:</span>');
	
	/**
		IS STUFF VISIBLE? IF NOT DO  COOL STUFF	
	*/
	
	$.fn.inView = function(){

	    var rect = this[0].getBoundingClientRect();
	
	    return (
	        rect.top >= 0 &&
	        rect.left >= 0 &&
	        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
	        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	    );
	
	};


		$(window).on('scroll',function(){ 

			if ( $('#respect-field-detoegevoegdewaarde').val() ) {		
			    if( ($('.respect-onderdeel').inView()) || ($('.respectveld').inView()) || ($('#respect-next').inView()) || ($('.respect-comment-question').inView()) || ($('.spectortext').inView()) || ($('textarea').inView()) ) {
			//	    console.log("reactiedeel WEL zichtbaar");
					$('.naarreactiedeel').hide();
					$('.naarartikel').show();
				} else {
			//	    console.log("reactiedeel NIET zichtbaar");
						$('.naarreactiedeel').show();
						$('.naarartikel').hide();
			    };
			    if ( $('textarea').is(':focus') ) {
  					$('.naarreactiedeel').hide();
			    }
			    if ( $(".content-entry").inView() ) {
						$('.naarartikel').hide();				    
						$('.naarreactiedeel').show();
			    }
			}
		});

	$("#respond").after('<p class="ganaar naarreactiedeel"><span class="clearboth"></span><img width="25" height="25" src="' + spectorimgsrc + '" class="spector-profilepicture" alt="Spector" itemprop="profielfoto"> <label class="spectortext-small ganaarartikel">Klik hier om terug te keren naar je bijdrage.</label></p>');
	$("#respond").after('<p class="ganaar naarartikel"><span class="clearboth"></span><img width="25" height="25" src="' + spectorimgsrc + '" class="spector-profilepicture" alt="Spector" itemprop="profielfoto"> <label class="spectortext-small ganaarreactiedeel">Snel naar het artikel? Klik hier!</label></p>');

	var auteurnaam;

	if ( $.cookie('koekje-enjoyername') ) {
		console.log('auteurnaambekend');
		auteurnaam = $.cookie('koekje-enjoyername');
	} else {
		auteurnaam = "";
	}

	$("#respond").before('<div class="bonusvraag" id="bonusvraag"><p><img width="60" height="60" src="' + spectorimgsrc + '" class="spector-profilepicture" alt="Spector" itemprop="profielfoto"> <label class="spectortext spector-bonusvraag">' + auteurnaam + ', Ik heb een bonusvraag voor je! <br/> Wie zou nog meer waarde aan dit gesprek toe kunnen voegen?!</label></p><span class="clearboth"></span><p id="bonusvraag-mail"><a id="bonusvraag-email" href="mailto:%20?subject=Interessant%20artikel%20voor%20jou%3F%21&body=%0DIk%20vond%20dit%20artikel%20wel%20triggerend%21%0D' + escape(paginaurl) + '%0D%0DIk%20denk%20dat%20jij%20ook%20wel%20een%20waardevolle%20bijdrage%20kunt%20leveren%2E%20Wil%20je%20reageren%3F%0D%0DGroetjes%2C%0D'+ auteurnaam +'">&#9993; Klik hier om een mailtje te sturen.</a></p><span class="clearboth"></span><span class="bonusvraag-nietmeertonen" style="float:right;">Niet meer tonen</span></div>');

	if ( !($.cookie('koekje-cookiestoegestaan')) ) {
		$("#respond").append('<div id="cookie-achtergrond"><div id="cookie-tekstvak"><h1>Welkom!</h1>Zitwatin maakt gebruik van cookies om inzicht te krijgen in de effectiviteit van de site. Door deze kennis kunnen we de site gebruiksvriendelijker maken. <br/><br/><span class="cookiesaccepteren">Accepteer cookies</span> <div class="cookies-meer"> <p class="cookies-wistjedat">Eigenlijk maar een aparte term hè?! <br/> Waar denk jij aan als je aan cookies denkt?</p> <iframe width="378" height="283" src="https://www.youtube.com/embed/I5e6ftNpGsU?start=25&amp;rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div> </div></div>');		
	}
	$(".cookiesaccepteren").click( function(){
		$("#cookie-achtergrond").hide();
		$.cookie('koekje-cookiestoegestaan','toegestaan', { path: '/', expires: 364 } );
	});
	
	$.fn.scrollView = function () {
	    return this.each(function () {
	        $('html, body').animate({
	            scrollTop: $(this).offset().top
	        }, 1000);
	    });
	}
	
	$('.naarreactiedeel').click( function() {
		$('#respect-comment').scrollView();
		$(this).hide();
	});
	$('.naarartikel').click( function() {
		$('#eengesprekover').scrollView();
		$(this).hide();
	});
	
	$(".bonusvraag-nietmeertonen").click( function() {
		$.cookie('koekje-bonusvraag-nietmeertonen', 'toon_bonusvraag_nietmeer');
		$("#bonusvraag").hide();
	});
	$("#bonusvraag-email").click( function() {
		$.cookie('koekje-bonusvraag-nietmeertonen', 'geklikt');
		ga('send', 'event', 'bonusvraag', paginaurl, auteurnaam);
		$("#bonusvraag").hide();
	});

	if ( $('input#author').val() ) {
			
	}
			
	/**
	 * Ready
	 */
	$( document ).ready( function() {
						
		$('#respect-comment').respectComment();

    if ( $.cookie('koekje-afgelopenzestigdagengeweest') ) {
		    $.cookie('koekje-binnenzestigdagenteruggeweest', 'ja');	    
			$.cookie('koekje-recentstebezoekmoment', Date.now());
   } else {
	    $.cookie('koekje-afgelopenzestigdagengeweest', "ja" , { path: '/', expires: 60 });
	    $.cookie('koekje-eerstebezoekmoment', Date.now());
	}
		// cookie aanpassen
	    $.cookie('koekje-afgelopen24uurgeweest', "ja" , { path: '/', expires: 1 });
	    // set cookie
	    if ( $.cookie('koekje-artikeleerstekijkmoment') ) {
		    $.cookie('koekje-artikeleerderbekeken', 'ja');
	    } else {
		    $.cookie('koekje-artikeleerstekijkmoment', Date.now());
	    }
		
	    $.cookie('koekje-Datenow', Date.now());		
	    console.log(Date.now());		

		if (( $.cookie('koekje-waarschijnlijkopartikelgereageerd')) && !($.cookie('koekje-bonusvraag-nietmeertonen')) && ($.cookie('koekje-enjoyername'))) {
			$("#bonusvraag").show();
		}
		
		if ( gebruikerisingelogd < 1) {
			$("#detoegevoegdewaarde").hide();
			$("#respect-next").hide();
			
			if ( $('input#author').val() ) {
				$('.author-respect-next').hide();
			}
			if ( !($('input#email').val()) ) {
				$(".comment-form-email").hide();		
			} else {
				$('.email-respect-next').hide();
			}
			if ( $('input#author').val() && $('input#email').val() ) {
				$("#detoegevoegdewaarde").show();
				$("#respect-next").show();					
			}
		} else {
			var inlognaam = $('.logged-in-as').text();
			inlognaam = inlognaam.replace("Ingelogd als ", "");
			inlognaam = inlognaam.replace(". Uitloggen?", "");
			$(".njoyernaam").each(function() {
			    $(this).text(inlognaam);
			});
		}
		
	} );
} )( jQuery );