$(function () {
    deckCarousel = new DeckCarousel($("#carousel")[0]);

    $("#carousel").on("crslNext", function () {
        console.log("next");
    }).on("crslPrev", function () {
        console.log("prev");
    });
});