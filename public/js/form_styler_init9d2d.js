(function($) {

	$(function() {

		$('input, select:not(.select2_widget)').styler();

		var tab = $('.tabs_control_item');

		tab.on('click', function (e) {
			$('input, select').trigger('refresh');
		});

	});

})(jQuery);