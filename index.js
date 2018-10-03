$(function () {
    let deckCarousel = new DeckCarousel($("#carousel")[0], 300, 50, 500);

    $("#carousel").on("crslNext", function () {
        deckCarousel.next();
    }).on("crslPrev", function () {
        deckCarousel.prev();
    });
});