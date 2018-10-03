'use strict';

class DeckCarousel {
    constructor(elem, width, margin, animTime) {
        this.carousel = elem;
        this.length = $(elem).find(".carousel-item").length;
        this.direction = null;
        this.animTime = animTime;
        this.data = {
            width: width,
            margin: margin
        }

        const $self = this;
        $(".carousel-item").each(function (i) {
            const marginMult = $self - i - 1;

            $(this).css({
                width: width,
                top: margin * marginMult,
                left: margin * marginMult
            });
        });

        this.startDragEvent();
    }

    get $carousel() {
        return $(this.carousel);
    }

    get topCard() {
        return $(".carousel-item[data-position=1]")[0];
    }

    get bottomCard() {
        return $(".carousel-item[data-position=" + this.length + "]")[0];
    }

    get $topCard() {
        return $(".carousel-item[data-position=1]");
    }

    get $bottomCard() {
        return $(".carousel-item[data-position=" + this.length + "]");
    }

    searchItem(i) {
        return $(".carousel-item[data-position=" + i + "]")[0];
    }

    $searchItem(i) {
        return $(".carousel-item[data-position=" + i + "]");
    }

    startDragEvent() {
        const $self = this;

        // Event to initiate drag, include touchstart events
        $self.$carousel.on('mousedown touchstart', function (e) {
            let initX = null;
            // Drag start logic
            // ...

            // Event to end drag, may want to include touchend events
            $(this).one('mouseup touchend', function (e) {
                $self.direction = null;

                $(this).off('mousemove touchmove');
                // Drag stop logic
                // ...
            }).on('mousemove touchmove', function(e) {
                // Logic for dragging, can get mouse position
                // will probably want to throttle
                // possibly include touchmove events also
                if (initX != null) {
                    if ((e.pageX || e.changedTouches[0].pageX) > initX) {
                        $self.direction = "right";
                        $self.$carousel.trigger("crslNext");
                    } else {
                        $self.direction = "left";
                        $self.$carousel.trigger("crslPrev");
                    }

                    $(this).off('mousemove touchmove');
                    $self.stopDragEvent();
                    $self.$carousel.one("crslAnimEnd", function () {
                        $self.startDragEvent();
                    });
                }

                initX = e.pageX || e.changedTouches[0].pageX;

                console.log(initX);
            });
        });
    }

    stopDragEvent() {
        this.$carousel.off('mousedown touchstart');
    }

    next() {
        const $self = this;

        $self.$topCard.animate({ left: "+=" + $self.data.width }, $self.animTime / 3).animate({ top: 0, left: $self.data.width }, $self.animTime / 3).animate({ left: 0 }, $self.animTime / 3);

        $(".carousel-item:not([data-position=1])").animate({ top: "+=" + $self.data.margin, left: "+=" + $self.data.margin }, $self.animTime, function () {
            $self.$carousel.trigger("crslAnimEnd");
        });

        $(".carousel-item").each(function () {
            const dataPos = parseInt($(this).attr("data-position"));
            
            if (dataPos == 1) {
                $(this).attr("data-position", $self.length);
            } else {
                $(this).attr("data-position", dataPos - 1);
            }	
        });
    }

    prev() {
        const $self = this,
            topCardMargin = $self.$topCard.css("top");

        $self.$bottomCard
            .animate({ left: "-=" + $self.data.width }, $self.animTime / 3)
            .animate({ top: topCardMargin, left: topCardMargin - $self.data.width }, $self.animTime / 3)
            .animate({ left: topCardMargin }, $self.animTime / 3);

        $(".carousel-item:not([data-position=" + $self.length + "])").animate({ top: "-=" + 50, left: "-=" + 50 }, $self.animTime, function () {
            $self.$carousel.trigger("crslAnimEnd");
        });

        $(".carousel-item").each(function () {
            const dataPos = parseInt($(this).attr("data-position"));
            
            if (dataPos == $self.length) {
                $(this).attr("data-position", 1);
            } else {
                $(this).attr("data-position", dataPos + 1);
            }	
        });
    }
}