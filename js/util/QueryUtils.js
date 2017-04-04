class QueryUtils {
    /**
     * Takes an HTTP response(which should contain cards as JSON) and returns the cards as an array.
     * We also try to guess the best image url for that card.
     *
     */
    static getCardsFromResponse(response) {
        const cards = JSON.parse(response.responseText);
        return QueryUtils._setCardImageUrls(cards);
    }

    static buildQueryParams(searchText, searchOracleText, searchSubtypeText, manaParams, sets) {
        //Set query params
        let setQuery = '';
        for (var i = 0; i < sets.length; i++) {
            setQuery = setQuery + '&set=' + sets[i];
        }
        setQuery = '';
        //Subtype query params
        let subtypeQuery = '';
        if (searchSubtypeText != null && searchSubtypeText != '') {
            subtypeQuery = '&subtype=' + searchSubtypeText
        }
        //Mana colors query params
        let manaQuery = '';
        if (manaParams.white || manaParams.blue || manaParams.black || manaParams.red || manaParams.green) {
            var numberOfColors = 0;
            if (manaParams.white) {
                manaQuery = manaQuery.concat('&color=white');
                numberOfColors++;
            }
            if (manaParams.blue) {
                manaQuery = manaQuery.concat('&color=blue');
                numberOfColors++;
            }
            if (manaParams.black) {
                manaQuery = manaQuery.concat('&color=black');
                numberOfColors++;
            }
            if (manaParams.red) {
                manaQuery = manaQuery.concat('&color=red');
                numberOfColors++;
            }
            if (manaParams.green) {
                manaQuery = manaQuery.concat('&color=green');
                numberOfColors++;
            }
            //if (numberOfColors > 1) {
            //    manaQuery = manaQuery.concat('&multicolor=true');
            //}
        }
        if (searchOracleText == null) searchOracleText = '';
        const requestUrlParams = "name=" + searchText + "&oracle=" + searchOracleText + setQuery + subtypeQuery + manaQuery;
        return requestUrlParams;
    }

    /**
     * Takes an array of cards and and returns a filtered array of cards without duplicates of the
     * same card from different editions/sets. Additionally we try to pick the correct image for that card.
     * Note that if an image cannot be found, the card will be omitted altogether from the array this function returns.
     *
     */
    static _setCardImageUrls(cards) {
        let filteredCards = [];
        for (var i = 0; i < cards.length; i++) {
            let card = cards[i];
            let imageFound = false;
            for (var k = 0; k < card.editions.length; k++) {
                if (card.editions[k].image_url != "https://image.deckbrew.com/mtg/multiverseid/0.jpg") {
                    card.img_url = card.editions[k].image_url;
                    imageFound = true;
                    break;
                }
            }
            if (imageFound) {
                filteredCards.push(card);
            }
        }
        return filteredCards;
    }

}

export default QueryUtils;