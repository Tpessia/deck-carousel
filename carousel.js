'use strict';

class DeckCarousel {
    constructor(elem, cardsClass, crslStyles, cardStyles, animTime, fit) {
        const $self = this;
        this.carousel = elem;
        this.cardsClass = cardsClass;
        this.length = $(elem).find(cardsClass).length;
        this.direction = null;
        this.animTime = animTime;
        this.styles = {
            crsl: {
                width: crslStyles.width,
                height: crslStyles.height
            },
            card: {
                width: cardStyles.width,
                maxMargin: crslStyles.width - cardStyles.width,
                margin: (crslStyles.width - cardStyles.width) / ($self.length - 1)
            }
        }

        $(this.carousel).css({
            "display": "block",
            "width": this.styles.crsl.width
        });
        $(this.cardsClass).each(function (i) {
            const marginMult = $self.length - i - 1;

            $(this).css({
                "width": $self.styles.card.width,
                "top": $self.styles.card.margin * marginMult,
                "left": $self.styles.card.margin * marginMult,
                "z-index": marginMult
            });

            $(this).attr("data-position", (i + 1));
        });

        if (typeof fit !== "undefined" && fit) {
            this.styles.crsl.height = $(this.cardsClass).height() + $self.styles.card.maxMargin;
        }

        $(this.carousel).css("height", $self.styles.crsl.height);
        $(this.cardsClass).css("height", $self.styles.crsl.height - $self.styles.card.maxMargin);

        this.bindDragEvent();
        this.bindCrslMov();
    }


    get $carousel() {
        return $(this.carousel);
    }

    get cards() {
        return $(this.cardsClass).toArray();
    }

    get $cards() {
        return $(this.cardsClass);
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


    bindDragEvent() {
        const $self = this;

        // Event to initiate drag, include touchstart events
        $self.$carousel.on('mousedown touchstart', function (e) {
            e.preventDefault();
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
                    $self.removeDragEvent();
                    $self.$carousel.one("crslAnimEnd", function () {
                        $self.bindDragEvent();
                    });
                }

                initX = e.pageX || e.changedTouches[0].pageX;
            });
        });
    }

    removeDragEvent() {
        this.$carousel.off('mousedown touchstart');
    }


    next() {
        const $self = this;

        $self.$topCard
            .animate({ left: "+=" + ($self.styles.card.width + 10) }, $self.animTime / 3)
            .animate({ top: 0, left: ($self.styles.card.width + 10) }, $self.animTime / 3)
            .animate({ left: 0 }, $self.animTime / 3);

        $(".carousel-item:not([data-position=1])").animate({ top: "+=" + $self.styles.card.margin, left: "+=" + $self.styles.card.margin }, $self.animTime, function () {
            $self.$carousel.trigger("crslAnimEnd");
        });

        $self.$cards.each(function () {
            const dataPos = parseInt($(this).attr("data-position"));
            
            if (dataPos == 1) {
                $(this).attr("data-position", $self.length);
            } else {
                $(this).attr("data-position", dataPos - 1);
            }

            setTimeout((elem) => {
                let zIndex = $self.length - $(elem).attr("data-position");
                $(elem).css("z-index", zIndex);
            }, $self.animTime / 3, this);
        });
    }

    prev() {
        const $self = this,
            topCardMargin = $self.styles.card.margin * ($self.length - 1);
            
        $self.$bottomCard
            .animate({ left: "-=" + ($self.styles.card.width + 10) }, $self.animTime / 3)
            .animate({ top: topCardMargin, left: topCardMargin - ($self.styles.card.width + 10) }, $self.animTime / 3)
            .animate({ left: topCardMargin }, $self.animTime / 3);

        $(".carousel-item:not([data-position=" + $self.length + "])").animate({ top: "-=" + $self.styles.card.margin, left: "-=" + $self.styles.card.margin }, $self.animTime, function () {
            $self.$carousel.trigger("crslAnimEnd");
        });

        $self.$cards.each(function () {
            const dataPos = parseInt($(this).attr("data-position"));
            
            if (dataPos == $self.length) {
                $(this).attr("data-position", 1);
            } else {
                $(this).attr("data-position", dataPos + 1);
            }

            setTimeout((elem) => {
                let zIndex = $self.length - $(elem).attr("data-position");
                $(elem).css("z-index", zIndex);
            }, $self.animTime / 3, this);
        });
    }

    bindCrslMov() {
        $("#carousel").on("crslNext", function () {
            deckCarousel.next();
        }).on("crslPrev", function () {
            deckCarousel.prev();
        });
    }

    removeCrslMov() {
        this.$carousel.off('crslNext crslPrev');
    }


    remove() {
        this.removeDragEvent();
        this.removeCrslMov();
        this.$carousel.css({
            "display": "",
            "height": "",
            "width": "",
            "cursor": ""
        });
        this.$cards.css({
            "width": "",
            "top": "",
            "left": ""
        });
    }

    reset() {
        this.remove();
        new DeckCarousel(this.carousel, this.cardsClass, this.styles.crsl, this.styles.card, this.animTime);
    }
}