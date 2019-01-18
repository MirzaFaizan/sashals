var popup_feedback_name = "";
$(function() {
	$('.dropdown_btn').on('click', function() {
		$('.dropdown_menu').slideToggle();
		$(this).toggleClass('active');
	});

	$('.jumbo .dropdown_menu li button').on('click',function(){

		if($(this).attr("data-option")=="services")
			{
                $(".jumbo_form .question_block span.service").addClass("active");
				$(".jumbo_form .question_block span.request").removeClass("active");
			}
		else
			{
				$(".jumbo_form .question_block span.service").removeClass("active");
				$(".jumbo_form .question_block span.request").addClass("active");
			}

        $('.jumbo .dropdown_btn span').html($(this).html());

        $('.jumbo .dropdown_menu').slideToggle();
        $('.jumbo .dropdown_btn').toggleClass('active');
	});

	$(window).on('load resize', function() {
		$('.slick-dots li').width($('.slick-dots').width() / $('.slick-dots li').length);
		// $('.slick-dots li').width($('.slick-dots').width() / $('.slick-dots li').length - ($('.slick-dots').width() * 0.03));
	});
	
	$('.reviews_slider').slick({
		infinite: true,
		dots: true,
		arrows: false
	});

	var $jumbo_counter = false;
    function jumbo_counter(){    
        if($(window).outerWidth(true) < 686){
            if(!$jumbo_counter){
                $(".jumbo_counter").slick({
                    					infinite: false,
										slidesToShow: 1,
										slidesToScroll: 1,
										arrows: true,
										swipe: false,
										// centerMode: true,
										variableWidth: false
                });
                $jumbo_counter = true;
            }
        } else if($(window).outerWidth(true) > 687){
            if($jumbo_counter){
                $('.jumbo_counter').slick('unslick');
                $jumbo_counter = false;
            }
        }
    }; 
       
	jumbo_counter();
        
	$(window).on('resize', function(){
		 jumbo_counter();
	});

    popup_feedback_name = $(".popup.popup_feedback h2.title").html;
	$(".popup_open").click(funcViewPopup);

	$(".action-show-chat").click(funcViewShowChat);
});
function funcViewShowChat()
	{
		$("#chat_icon_show_wraper").click();
	}
function funcViewPopup()
	{
		var title = $(".popup.popup_feedback h2.title");
		var form = $(".popup.popup_feedback #feedback_form");
        form.children("input.mail_subject").remove();
        //form.children("input.mail_file").remove();
		if($(this).is(".history_callback"))
			{
                popup_feedback_name = title.html();
                title.html($(this).attr("data-title"));
				form.append(
					"<input type='hidden' name='mail_subject' class='mail_subject' value='"+
						$(this).attr("data-title")+
					"' />");
                /*form.append(
                    "<input type='file' name='mail_file' class='mail_file' value='"+
                    $(this).attr("data-title")+
                    "' />");*/
				//form.attr("enctype","multipart/form-data");
			}
		else
			{
                title.html(popup_feedback_name);
                //form.removeAttr("enctype");
			}
	}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKSB7XHJcblx0JCgnLmRyb3Bkb3duX2J0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnLmRyb3Bkb3duX21lbnUnKS5zbGlkZVRvZ2dsZSgpO1xyXG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBmdW5jdGlvbigpIHtcclxuXHRcdCQoJy5zbGljay1kb3RzIGxpJykud2lkdGgoJCgnLnNsaWNrLWRvdHMnKS53aWR0aCgpIC8gJCgnLnNsaWNrLWRvdHMgbGknKS5sZW5ndGgpO1xyXG5cdFx0Ly8gJCgnLnNsaWNrLWRvdHMgbGknKS53aWR0aCgkKCcuc2xpY2stZG90cycpLndpZHRoKCkgLyAkKCcuc2xpY2stZG90cyBsaScpLmxlbmd0aCAtICgkKCcuc2xpY2stZG90cycpLndpZHRoKCkgKiAwLjAzKSk7XHJcblx0fSk7XHJcblx0XHJcblx0JCgnLnJldmlld3Nfc2xpZGVyJykuc2xpY2soe1xyXG5cdFx0aW5maW5pdGU6IHRydWUsXHJcblx0XHRkb3RzOiB0cnVlLFxyXG5cdFx0YXJyb3dzOiBmYWxzZVxyXG5cdH0pO1xyXG5cclxuXHRcdHZhciAkanVtYm9fY291bnRlciA9IGZhbHNlO1xyXG4gICAgZnVuY3Rpb24ganVtYm9fY291bnRlcigpeyAgICBcclxuICAgICAgICBpZigkKHdpbmRvdykub3V0ZXJXaWR0aCh0cnVlKSA8IDY4Nil7XHJcbiAgICAgICAgICAgIGlmKCEkanVtYm9fY291bnRlcil7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmp1bWJvX2NvdW50ZXJcIikuc2xpY2soe1xyXG4gICAgICAgICAgICAgICAgICBcdGluZmluaXRlOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHNsaWRlc1RvU2hvdzogMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzbGlkZXNUb1Njcm9sbDogMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3dpcGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNlbnRlck1vZGU6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyaWFibGVXaWR0aDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkanVtYm9fY291bnRlciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYoJCh3aW5kb3cpLm91dGVyV2lkdGgodHJ1ZSkgPiA2ODcpe1xyXG4gICAgICAgICAgICBpZigkanVtYm9fY291bnRlcil7XHJcbiAgICAgICAgICAgICAgICAkKCcuanVtYm9fY291bnRlcicpLnNsaWNrKCd1bnNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAkanVtYm9fY291bnRlciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTsgXHJcbiAgICAgICBcclxuICAgICAgICBqdW1ib19jb3VudGVyKCk7XHJcbiAgICAgICAgXHJcblx0XHQgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpe1xyXG5cdFx0ICAgICAgICAganVtYm9fY291bnRlcigpO1xyXG5cdFx0ICAgIH0pO1xyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
