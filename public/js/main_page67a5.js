

    $( ".search_stats" ).ready(function() {
        showCounterNumbers();
    })

    function showCounterNumbers() {
        $('.index_counter').each(function () {
       //    $(this).text($(this).data('number'));
        });
       $('.search_stats_item').removeClass('counter_text_disable');

        var options = {
            useEasing: true,
            useGrouping: true,
            separator: ' ',
            decimal: '.',
        };
        var demo = new CountUp('count-1', 0, $('#count-1').data('number'), 0, 2.5, options);
        var demo2 = new CountUp('count-2', 0, $('#count-2').data('number'), 0, 2.5, options);
        var demo3 = new CountUp('count-3', 0, $('#count-3').data('number'), 0, 2.5, options);
        var demo4 = new CountUp('count-4', 0, $('#count-4').data('number'), 0, 2.5, options);
        var demo5 = new CountUp('count-5', 0, $('#count-5').data('number'), 0, 2.5, options);
        if (!demo.error) {
            demo.start();
            demo2.start();
            demo3.start();
            demo4.start();
            demo5.start();
        } else {
            console.error(demo.error);
        }
    }