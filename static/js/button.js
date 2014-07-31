(function($){
    $.fn.extend({ 

        button: function(settings) {
 
            var defaults = {
                mouseOffColor: '#005896',
                mouseOnColor: '#c1082b',
                speed: 300
            };
             
            var settings = $.extend(defaults, settings);
         
            return this.each(function() {
                var s = settings;
                var b = $(this);
               
                b.append('<span class="button-stroke" /><span class="button-border" />');
                $('.button-stroke', b).css({opacity: 0.30});
                $('.button-border', b).css({opacity: 0.19});
                b.css({backgroundColor: s.mouseOffColor}); 
                
                b.hover(function() {
                    $(this).stop().animate({
                        backgroundColor: s.mouseOnColor,
                        borderTopColor: s.mouseOnColor,
                        borderRightColor: s.mouseOnColor,
                        borderBottomColor: s.mouseOnColor,
                        borderLeftColor: s.mouseOnColor}, s.speed);
                  
                }, function() {
                    $(this).stop().animate({
                        backgroundColor: s.mouseOffColor,
                        borderTopColor: s.mouseOffColor,
                        borderRightColor: s.mouseOffColor,
                        borderBottomColor: s.mouseOffColor,
                        borderLeftColor: s.mouseOffColor}, s.speed);
                });
            });
        }
    });
})(jQuery);