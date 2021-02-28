document.getElementById("animeSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  // Don't let the user make requests less than 4 seconds apart.
  let currTime = performance.now() / 1000
  // If the cookie that tracks time between requests isn't defined,
  // define it.
  let lastRequest = document.cookie
    .split('; ')
    .find(row => row.startsWith('lastRequest='))
  let isLastRequestTooSoon = false;
  if (lastRequest === undefined) {
    document.cookie = `lastRequest=${currTime}`
  } else {
    let lastRequestTime = lastRequest.split('=')[1];
    if (Math.abs(currTime - lastRequestTime) < 4) {
      console.log("Last request was too soon to make another one.");
      let searchResults = '<div id="errorMessage">'
      searchResults += `Last request was ${Math.round(Math.abs(currTime - lastRequestTime) * 100) / 100} seconds ago. Please wait until four (4) seconds has passed to try again.`
      searchResults += '</div>'
      document.getElementById("searchResults").innerHTML = searchResults;
      isLastRequestTooSoon = true;
      return;
    }
    document.cookie = `lastRequest=${currTime}`
  }

  function populateAnimeResults(result) {
    let animeResults = ""
    animeResults += '<div id="animeBox">'
    animeResults += '<a href="' + result.url + '">'
    animeResults += '<div class="anime-image">'
    animeResults += '<img src="' + result.image_url + '" width=200px />'
    animeResults += '</div>'
    animeResults += '</a>'
    animeResults += '<div id="animeBoxBody">'
    animeResults += "<h2>" + result.title + "</h2>"
    animeResults += '<p>Synopsis: '
    animeResults += (result.synopsis === "") ? "N/A" : result.synopsis
    animeResults += '</p>'
    animeResults += '<p>Score: '
    animeResults += (result.score !== 0) ? result.score : 'N/A'
    animeResults += '</p>'
    animeResults += '<p>Number of Episodes: ' + result.episodes + '</p>'
    animeResults += '<p>Rated: '
    animeResults += (result.rated === null) ? 'Unknown' : result.rated
    animeResults += '</p>'
    animeResults += '<p>Currently Airing: '
    animeResults += (result.airing === true) ? 'Yes' : 'No'
    animeResults += '</p>'
    animeResults += '<p>Start date: '
    animeResults += (result.start_date === null) ? 'Unknown' : moment(result.start_date).format('MMMM Do YYYY')
    animeResults += '</p>'
    animeResults += '<p>End date: '
    animeResults += (result.end_date === null) ? 'Unknown' : moment(result.end_date).format('MMMM Do YYYY')
    animeResults += '</p>'
    animeResults += '<p>Type: ' + result.type + '</p>'
    animeResults += '</div>'
    animeResults += '</div>'
    return animeResults
  }

  function populateMangaResults(result) {
    let mangaResults = ""
    mangaResults += '<div id="animeBox">'
    mangaResults += '<a href="' + result.url + '">'
    mangaResults += '<div class="anime-image">'
    mangaResults += '<img src="' + result.image_url + '" width=200px />'
    mangaResults += '</div>'
    mangaResults += '</a>'
    mangaResults += '<div id="animeBoxBody">'
    mangaResults += "<h2>" + result.title + "</h2>"
    mangaResults += '<p>Synopsis: '
    mangaResults += (result.synopsis === "") ? "N/A" : result.synopsis
    mangaResults += '</p>'
    mangaResults += '<p>Score: '
    mangaResults += (result.score !== 0) ? result.score : 'N/A'
    mangaResults += '</p>'
    mangaResults += '<p>Number of Volumes: ' + result.volumes + '</p>'
    mangaResults += '<p>Number of Chapters: ' + result.chapters + '</p>'
    mangaResults += '<p>New Publications? '
    mangaResults += (result.publishing === true) ? 'Yes' : 'No'
    mangaResults += '</p>'
    mangaResults += '<p>Start date: '
    mangaResults += (result.start_date === null) ? 'Unknown' : moment(result.start_date).format('MMMM Do YYYY')
    mangaResults += '</p>'
    mangaResults += '<p>End date: '
    mangaResults += (result.end_date === null) ? 'Unknown' : moment(result.end_date).format('MMMM Do YYYY')
    mangaResults += '</p>'
    mangaResults += '<p>Type: ' + result.type + '</p>'
    mangaResults += '</div>'
    mangaResults += '</div>'
    return mangaResults
  }

  function populateCharacterResults(result) {
    let characterResults = ""
    characterResults += '<div id="characterBox">'
    characterResults += '<a href="' + result.url + '">'
    characterResults += '<div class="anime-image">'
    characterResults += '<img src="' + result.image_url + '" width=200px />'
    characterResults += '</div>'
    characterResults += '</a>'
    characterResults += '<div id="characterBoxBody">'
    characterResults += "<h2>" + result.name + "</h2>"
    characterResults += '<p>Alternative Names: '
    characterResults += addElementsFromArray(result.alternative_names)
    characterResults += '</p>'
    characterResults += '<p>Anime Appearance: ' + addAnimeObjectFromArray(result.anime) + '</p>'
    characterResults += '<p>Manga Appearance: ' + addAnimeObjectFromArray(result.manga) + '</p>'
    characterResults += '</div>'
    characterResults += '</div>'
    return characterResults
  }

  function addElementsFromArray(array) {
    let results = ""
    if (array.length !== 0) {
      let i = 0
      for (let element of array) {
        results += (i === 0) ? "" : ", "
        results += element
        i += 1
      }
    } else {
      results += 'N/A'
    }
    return results
  }

  function addAnimeObjectFromArray(array) {
    let results = ""
    if (array.length !== 0) {
      let i = 0
      for (let anime of array) {
        results += (i === 0) ? "" : ", "
        results += '<a href=""' + anime.url + '"">'
        results += anime.name + '</a>'
        i += 1
      }
    } else {
      results += 'N/A'
    }
    return results
  }

  if (!isLastRequestTooSoon) {
    const value = document.getElementById("userInput").value;
    const s = document.getElementById('selector');
    const type = s.options[s.selectedIndex].value[0].toLowerCase() + s.options[s.selectedIndex].value.slice(1);
    if (value === "")
      return;
    const url = "https://api.jikan.moe/v3/search/" + type + "?q=" + value;
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        let searchResults = ""
        if (json.status !== 404) {
          for (let result of json.results) {
            if (type === "anime") {
              searchResults += populateAnimeResults(result)
            } else if (type === "manga") {
              searchResults += populateMangaResults(result)
            } else if (type === "character") {
              searchResults += populateCharacterResults(result)
            }
          }
        } else {
          searchResults = '<div id="errorMessage">'
          searchResults += 'The search yielded no results. Please try searching for another anime/manga/character.'
          searchResults += '</div>'
          document.getElementById("searchResults").innerHTML = searchResults;
        }
        document.getElementById("searchResults").innerHTML = searchResults;
      })
      .catch(function(error) {
        console.log("Cannot make specified request")
      });
  }
});
