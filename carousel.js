'use strict';

class DeckCarousel {
    constructor(elem) {
        this.elem = elem;
        this.direction = null;

        this.initDragEvent();
    }

    initDragEvent() {        
        const $self = this;

        // Event to initiate drag, include touchstart events
        $($self.elem).on('mousedown', function (e) {
            let initX = null;
            // Drag start logic
            // ...

            // Event to end drag, may want to include touchend events
            $(this).one('mouseup', function (e) {
                $self.direction = null;

                $(this).off('mousemove');
                // Drag stop logic
                // ...
            }).on('mousemove', function(e) {
                // Logic for dragging, can get mouse position
                // will probably want to throttle
                // possibly include touchmove events also
                if (initX != null) {
                    if (e.pageX > initX) {
                        $self.direction = "right";
                        $($self.elem).trigger("crslNext");
                        $(this).off('mousemove');
                    } else {
                        $self.direction = "left";
                        $($self.elem).trigger("crslPrev");
                        $(this).off('mousemove');
                    }
                }

                initX = e.pageX;
            });
        });
    }
}