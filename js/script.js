//selectors:
let allMoviesContentsSections = document.querySelectorAll(
  ".all-movies-contents .movies-section"
);
let slidBtnsDuo = document.querySelectorAll(".all-movies-contents .duo-btns");
let exploreAllOverlay = document.querySelector(".all-movies-contents-overlay");
let allExploreAllSection = document.querySelectorAll(".explore-all");
let questionsFormContent = document.querySelectorAll(".ques-pages .ques-form .ques-contents");
let StartQuesBtn = document.querySelector(".first-page .questions-btn");
let quesNextBtns = document.querySelectorAll(".ques-pages .questions-btn");
let quesBackBtns = document.querySelectorAll(".ques-pages .move-back-btn");
let allQuestions = document.querySelectorAll(".ques-pages .ques-contents .group-of-ques .ques");
let repeatQuesBtn = document.querySelector(".ques-pages .restart-ques-btn");
let quesFormes = document.querySelectorAll(".landing .landing-contents .ques-pages .ques-form");
//events:
// to open explore all section when click on section title
let myWatchListItemsIndexes = [];
//add movies to each section:
//add to section function
function addChildToSection(funcData, sec, rightBtn) {
  if (funcData[0] !== null) {
    sec.appendChild(funcData[0]);
    //if movies group less than 2 dont show the slide btns
    if (funcData[1] < 2) {
      rightBtn = sec.querySelector(".slide-btn-right");
      rightBtn.style.display = "none";
    }
    //to show to bottom slider status
    if (funcData[1] > 1) {
      let sliderStats = document.createElement("div");
      sliderStats.classList.add("slider-stats");
      let slideItems = [];
      for (let i = 0; i < funcData[1]; i++) {
        let slideItem = document.createElement("span");
        slideItem.classList.add("slide-item");
        if (i === 0) {
          slideItem.classList.add("active");
        }
        slideItems.push(slideItem);
        slideItems.forEach((item) => {
          sliderStats.appendChild(item);
        });
        sec.appendChild(sliderStats);
      }
    }
    //movie card hover effect to show story
    const allMovieCards = sec.querySelectorAll(".movie-card");
    allMovieCards.forEach((card) => {
      let hoverTimer;
      card.addEventListener("mouseenter", () => {
        hoverTimer = window.setTimeout(() => {
          card.classList.add("hover-effect");
        }, 800);
      });
      card.addEventListener("mouseleave", () => {
        window.clearTimeout(hoverTimer);
        card.classList.remove("hover-effect");
      });
    });
    //add watchlist movies to localstorage
    let addToWatchListBtns = sec.querySelectorAll(
      ".add-to-watch-list-btn button"
    );
    let removeFromWatchListBtns = null;
    if (window.localStorage.getItem("myWatchList")) {
      myWatchListItemsIndexes = JSON.parse(localStorage.getItem("myWatchList"));
      removeFromWatchListBtns = sec.querySelectorAll(
        ".remove-to-watch-list-btn button"
      );
    }
    addToWatchListBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!myWatchListItemsIndexes.includes(btn.getAttribute("data-index"))) {
          myWatchListItemsIndexes.unshift(btn.getAttribute("data-index"));
          window.localStorage.setItem(
            "myWatchList",
            JSON.stringify(myWatchListItemsIndexes)
          );
          let sec = document.querySelector(".my-watchlist");
          let funcData = generateMyWatchListMovies(sec);
          sec.innerHTML = `<div class="duo-btns">
                              <i class="fa-solid fa-angle-right slide-btn slide-btn-right"></i>
                              <i class="fa-solid fa-angle-left slide-btn slide-btn-left"></i>
                              </div>
                              <div class="section-title"><span>My Watchlist</span><span>Explore All</span></div>`;
          addChildToSection(funcData, sec);
          sliderFunction(true);
          showExploreAllMovies();
          exploreAllLoadData(true,false,[]);
          lazyLoading();
        }
      });
    });
    //remove movies form watchlist
    if (removeFromWatchListBtns !== null) {
      removeFromWatchListBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          //remove from local storage
          let itemIndex = myWatchListItemsIndexes.indexOf(
            btn.getAttribute("data-index")
          );
          let newList = myWatchListItemsIndexes.filter((elem) => {
            return elem !== myWatchListItemsIndexes[itemIndex];
          });
          myWatchListItemsIndexes = newList;
          window.localStorage.setItem(
            "myWatchList",
            JSON.stringify(myWatchListItemsIndexes)
          );
          //remove card
          let remCard = btn.parentElement.parentElement.parentElement;
          remCard.classList.add("remove-card");
          window.setTimeout(() => {
            remCard.remove();
            let sec = document.querySelector(".my-watchlist");
            let funcData = generateMyWatchListMovies(sec);
            sec.innerHTML = `<div class="duo-btns">
                              <i class="fa-solid fa-angle-right slide-btn slide-btn-right"></i>
                              <i class="fa-solid fa-angle-left slide-btn slide-btn-left"></i>
                              </div>
                              <div class="section-title"><span>My Watchlist</span><span>Explore All</span></div>`;
            addChildToSection(funcData, sec);
            sliderFunction(true);
            showExploreAllMovies();
            exploreAllLoadData(true,false,[]);
            lazyLoading();
          }, 600);
        });
      });
    }
  }
}
function addToEachSection() {
  allMoviesContentsSections.forEach((sec) => {
    let rightBtn = sec.querySelector(".slide-btn-right");
    let funcData;
    let hasWatchListMovies = false;
    //add movies to each section categ
    //see if data in local storage
    if (sec.classList.contains("my-watchlist")) {
      hasWatchListMovies = generateMyWatchListMovies(sec)[2];
      funcData = generateMyWatchListMovies(sec);
    }
    if (sec.classList.contains("random-movies")) {
      funcData = generateRandomMovies();
    }
    if (sec.classList.contains("action-movies")) {
      funcData = generateSpecificMovies("Action");
    }
    if (sec.classList.contains("comedy-movies")) {
      funcData = generateSpecificMovies("Comedy");
    }
    if (sec.classList.contains("drama-movies")) {
      funcData = generateSpecificMovies("Drama");
    }
    if (sec.classList.contains("romance-movies")) {
      funcData = generateSpecificMovies("Romance");
    }
    if (sec.classList.contains("fantasy-movies")) {
      funcData = generateSpecificMovies("Fantasy");
    }
    if (sec.classList.contains("horror-movies")) {
      funcData = generateSpecificMovies("Horror");
    }
    if (!sec.classList.contains("my-watchlist") || hasWatchListMovies) {
      addChildToSection(funcData, sec, rightBtn);
    }
  });
}
addToEachSection();
// Slider Btns Event
function sliderFunction(fromWatchList) {
  if (fromWatchList) {
    slidBtnsDuo = document.querySelectorAll(".my-watchlist .duo-btns");
  } else {
    slidBtnsDuo = document.querySelectorAll(".all-movies-contents .duo-btns");
  }
  slidBtnsDuo.forEach((duo) => {
    let move = 0;
    let movePx = 0;
    let duoBtns = duo.querySelectorAll(".slide-btn");
    duoBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        let moveElem =
          btn.parentElement.parentElement.querySelector(".all-groups");
        let visibleGroup = moveElem.querySelector(".visible");
        let sliderStats =
          btn.parentElement.parentElement.querySelector(".slider-stats");
        let activeSlideItem = sliderStats.querySelector(".active");
        if (btn.classList.contains("slide-btn-right")) {
          let leftBtn = btn.nextElementSibling;
          leftBtn.style.display = "flex";
          if (visibleGroup.nextElementSibling) {
            move += 100;
            movePx += 10;
            moveElem.style.transform = `translateX(calc(${-move}% - ${movePx}px))`;
            visibleGroup.classList.remove("visible");
            visibleGroup.nextElementSibling.classList.add("visible");
            btn.style.pointerEvents = "none";
            window.setTimeout(() => {
              activeSlideItem.classList.remove("active");
              activeSlideItem.nextElementSibling.classList.add("active");
              btn.style.pointerEvents = "all";
            }, 600);
            if (!visibleGroup.nextElementSibling.nextElementSibling) {
              btn.style.display = "none";
            }
          }
        } else {
          let rightBtn = btn.previousElementSibling;
          rightBtn.style.display = "flex";
          if (visibleGroup.previousElementSibling) {
            move -= 100;
            movePx -= 10;
            moveElem.style.transform = `translateX(calc(${-move}% - ${movePx}px))`;
            visibleGroup.classList.remove("visible");
            visibleGroup.previousElementSibling.classList.add("visible");
            btn.style.pointerEvents = "none";
            rightBtn.style.pointerEvents = "none";
            window.setTimeout(() => {
              activeSlideItem.classList.remove("active");
              activeSlideItem.previousElementSibling.classList.add("active");
              btn.style.pointerEvents = "all";
              rightBtn.style.pointerEvents = "all";
            }, 600);
            if (!visibleGroup.previousElementSibling.previousElementSibling) {
              btn.style.display = "none";
            }
          }
        }
      });
    });
  });
}
sliderFunction(false);
window.addEventListener("resize", () => {
  allMoviesContentsSections.forEach((sec) => {
    let secTitle = sec.querySelector(
      ".section-title span:first-child"
    ).innerText;
    sec.innerHTML = `<div class="duo-btns">
                      <i class="fa-solid fa-angle-right slide-btn slide-btn-right"></i>
                      <i class="fa-solid fa-angle-left slide-btn slide-btn-left"></i>
                    </div>
                    <div class="section-title"><span>${secTitle}</span><span>Explore All</span></div>`;
  });
  addToEachSection();
  sliderFunction(false);
  showExploreAllMovies();
  exploreAllLoadData(true,false,[]);
  lazyLoading();
});
//to show explore all section
function showExploreAllMovies() {
  let allSectionsTitle = document.querySelectorAll(".section-title");
  allSectionsTitle.forEach((title) => {
    title.addEventListener("click", () => {
      let section = title.parentElement;
      let sectionName = section.classList[1];
      let openElem = document.querySelector(`.explore-all.all-${sectionName}`);
      let sectionPos = section.getBoundingClientRect().top;
      let openElemPos = sectionPos - document.body.getBoundingClientRect().top;
      window.scrollBy(0,sectionPos-100);
      exploreAllOverlay.style.display = "block";
      openElem.style.top = `calc(${openElemPos}px - 100vh - 75px)`;
      openElem.style.display = "block";
      document.getElementsByTagName("body")[0].style.overflowY = "hidden";
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    });
  });
}
showExploreAllMovies();
//add click event to overlay to close it and close the section
exploreAllOverlay.addEventListener("click", () => {
  exploreAllOverlay.style.display = "none";
  document.getElementsByTagName("body")[0].style.overflowY = "visible";
  document.getElementsByTagName("html")[0].style.overflowY = "visible";
  allExploreAllSection.forEach((sec) => {
    sec.scrollTo(0,0);
    sec.style.display = "none";
  });
});
//add click event to close btn in explore all movies sectin to close it, and load data
allExploreAllSection.forEach((sec) => {
  let closeExploreAllBtn = sec.querySelector(".close-explore-all-btn");
  closeExploreAllBtn.addEventListener("click", () => {
    sec.style.display = "none";
    exploreAllOverlay.style.display = "none";
    document.getElementsByTagName("body")[0].style.overflowY = "visible";
    document.getElementsByTagName("html")[0].style.overflowY = "visible";
  });
});
//load explore all data
function exploreAllLoadData(justMyWatchList,fromGenerator,generatorData){
  let moviesCardHolderWatchList = document.querySelector(".all-my-watchlist .explore-all-contents");
  let moviesCardHolderRandom = document.querySelector(
    ".all-random-movies .explore-all-contents"
  );
  let moviesCardHolderAction = document.querySelector(
    ".all-action-movies .explore-all-contents"
  );
  let moviesCardHolderComedy = document.querySelector(
    ".all-comedy-movies .explore-all-contents"
  );
  let moviesCardHolderDrama = document.querySelector(
    ".all-drama-movies .explore-all-contents"
  );
  let moviesCardHolderRomance = document.querySelector(
    ".all-romance-movies .explore-all-contents"
  );
  let moviesCardHolderFantasy = document.querySelector(
    ".all-fantasy-movies .explore-all-contents"
  );
  let moviesCardHolderHorror = document.querySelector(
    ".all-horror-movies .explore-all-contents"
  );
  function makeCard(movie, index,fromWatchList) {
    let card = document.createElement("div");
    card.classList.add("movie-card");
    if(!fromWatchList){
      card.innerHTML += `
      <div class="movie-poster">
      <img data-src="${movie.image}" alt="${movie.title}" class="poster-img">
      <p class="movie-desc">${movie.simple_desc}</p>
      </div>
      <div class="infos">
      <div class="movie-rating">
      <i class="fa-solid fa-star"></i>
      <span class="rate">${movie.rating}</span>
      </div>
      <div class="movie-title">
      ${movie.title}
      </div>
      <div class="add-to-watch-list-btn">
      <button data-index="${index}"><i class="fa-solid fa-plus"></i>Watchlist</button>
      </div>
      <div class="movies-genre">
      </div>    
      </div>`;
    }else{
      card.innerHTML += `
      <div class="movie-poster">
      <img data-src="${movie.image}" alt="${movie.title}" class="poster-img">
      <p class="movie-desc">${movie.simple_desc}</p>
      </div>
      <div class="infos">
      <div class="movie-rating">
      <i class="fa-solid fa-star"></i>
      <span class="rate">${movie.rating}</span>
      </div>
      <div class="movie-title">
      ${movie.title}
      </div>
      <div class="remove-to-watch-list-btn">
      <button data-index="${index}"><i class="fa-solid fa-minus"></i>Remove</button>
      </div>
      <div class="movies-genre">
      </div>    
      </div>`;
    }
    let genres = card.querySelector(".movies-genre");
    for (let i = 0; i < movie.genre.length; i++) {
      genres.innerHTML += `<span>${movie.genre[i]}</span>`;
    }
    //movie card hover effect to show story
    let hoverTimer;
    card.addEventListener("mouseenter", () => {
      hoverTimer = window.setTimeout(() => {
        card.classList.add("hover-effect");
      }, 800);
    });
    card.addEventListener("mouseleave", () => {
      window.clearTimeout(hoverTimer);
      card.classList.remove("hover-effect");
    });
    //add watchlist movies to localstorage
    let addToWatchListBtns = null;
    let removeFromWatchListBtns = null;
    if(fromWatchList){
      removeFromWatchListBtns = card.querySelector(
        ".remove-to-watch-list-btn button"
      );
      
    }else{
      addToWatchListBtns = card.querySelector(
        ".add-to-watch-list-btn button"
      );
    }
    if (window.localStorage.getItem("myWatchList")) {
      myWatchListItemsIndexes = JSON.parse(localStorage.getItem("myWatchList"));
    }
    if(addToWatchListBtns !== null){
      addToWatchListBtns.addEventListener("click", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        if (
          !myWatchListItemsIndexes.includes(
            addToWatchListBtns.getAttribute("data-index")
          )
        ) {
          myWatchListItemsIndexes.unshift(
            addToWatchListBtns.getAttribute("data-index")
          );
          window.localStorage.setItem(
            "myWatchList",
            JSON.stringify(myWatchListItemsIndexes)
          );
          let sec = document.querySelector(".my-watchlist");
          let funcData = generateMyWatchListMovies(sec);
          let rightBtn = sec.querySelector(".slide-btn-right");
          sec.innerHTML = `<div class="duo-btns">
                              <i class="fa-solid fa-angle-right slide-btn slide-btn-right"></i>
                              <i class="fa-solid fa-angle-left slide-btn slide-btn-left"></i>
                              </div>
                              <div class="section-title"><span>My Watchlist</span><span>Explore All</span></div>`;
          addChildToSection(funcData, sec, rightBtn);
          sliderFunction(true);
          showExploreAllMovies();
          exploreAllMyWatchList();
          lazyLoading();
          window.scrollTo(scrollLeft, scrollTop);
        }
      });
    }
    //remove movies from watchlist;
    if (removeFromWatchListBtns !== null) {
      removeFromWatchListBtns.addEventListener("click", () => {
          //remove from local storage
          let itemIndex = myWatchListItemsIndexes.indexOf(
            removeFromWatchListBtns.getAttribute("data-index")
          );
          let newList = myWatchListItemsIndexes.filter((elem) => {
            return elem !== myWatchListItemsIndexes[itemIndex];
          });
          myWatchListItemsIndexes = newList;
          window.localStorage.setItem(
            "myWatchList",
            JSON.stringify(myWatchListItemsIndexes)
          );
          //remove card
          let remCard = removeFromWatchListBtns.parentElement.parentElement.parentElement;
          remCard.classList.add("remove-card");
          window.setTimeout(()=>{
          remCard.remove();
          let sec = document.querySelector(".my-watchlist");
          let funcData = generateMyWatchListMovies(sec);
          sec.innerHTML = `<div class="duo-btns">
                            <i class="fa-solid fa-angle-right slide-btn slide-btn-right"></i>
                            <i class="fa-solid fa-angle-left slide-btn slide-btn-left"></i>
                            </div>
                            <div class="section-title"><span>My Watchlist</span><span>Explore All</span></div>`;
          addChildToSection(funcData, sec);
          sliderFunction(true);
          showExploreAllMovies();
          exploreAllMyWatchList();
          lazyLoading();
        },600);
        });
    }
    return card;
  }
  if(!justMyWatchList){
    moviesData.forEach((movie, index) => {
      moviesCardHolderRandom.appendChild(makeCard(movie, index,false));
      movie.genre.forEach((genre) => {
        if (genre.trim() === "Action") {
          moviesCardHolderAction.appendChild(makeCard(movie, index,false));
        }
        if (genre.trim() === "Comedy") {
          moviesCardHolderComedy.appendChild(makeCard(movie, index,false));
        }
        if (genre.trim() === "Drama") {
          moviesCardHolderDrama.appendChild(makeCard(movie, index,false));
        }
        if (genre.trim() === "Romance") {
          moviesCardHolderRomance.appendChild(makeCard(movie, index,false));
        }
        if (genre.trim() === "Fantasy") {
          moviesCardHolderFantasy.appendChild(makeCard(movie, index,false));
        }
        if (genre.trim() === "Horror") {
          moviesCardHolderHorror.appendChild(makeCard(movie, index,false));
        }
      });
    });
  }

  function exploreAllMyWatchList(){
    if(JSON.parse(window.localStorage.getItem("myWatchList"))){
      let myMovies = JSON.parse(window.localStorage.getItem("myWatchList"));
      moviesCardHolderWatchList.innerHTML = "";
      if(myMovies.length > 0){
        myMovies.forEach(movieInx=>{
          moviesCardHolderWatchList.appendChild(makeCard(moviesData[movieInx],movieInx,true));
        })
      }else{
        let parentSec = moviesCardHolderWatchList.parentElement;
        parentSec.style.display = "none";
        exploreAllOverlay.style.display = "none";
      }
    }
  }
  if(!fromGenerator){
    exploreAllMyWatchList();
  }
  if(fromGenerator){
    let data = generatorData;
    return makeCard(data[0],data[1],false);
  }
}
exploreAllLoadData(false,false,[]);
//start movies genrator;
let answaresDataList = {
  1:"",
  2:"",
  3:"",
  4:"",
  5:"",
};
//click to the ques
allQuestions.forEach(ques=>{
  ques.addEventListener("click",()=>{
    //remove class just form ques siblings not for all ques.
    let quesSiblings = ques.parentElement.parentElement.querySelectorAll(".ques");
    quesSiblings.forEach(sib=>{
      sib.classList.remove("clicked-ques");
    })
    ques.classList.add("clicked-ques");
  })
})
//show the next btn
questionsFormContent.forEach(form=>{
  form.addEventListener("click",()=>{
    let formChildes = form.querySelectorAll(".group-of-ques .ques")
    for(let i = 0 ; i < formChildes.length ; i++){
      if(formChildes[i].classList.contains("clicked-ques")){
        if(form.nextElementSibling.classList.contains("questions-btn")){
          form.nextElementSibling.style.visibility = "visible";
          window.setTimeout(()=>{
            form.nextElementSibling.style.opacity = "1";
            form.nextElementSibling.style.transform = "translateY(0px)"
          },100)
        }else{
          let btn = form.nextElementSibling.querySelector(".questions-btn");
          btn.style.visibility = "visible";
          window.setTimeout(()=>{
            btn.style.opacity = "1";
            btn.style.transform = "translateY(0px)"
          },100)
        }
      }
    }
  })
})
//to start the ques
StartQuesBtn.addEventListener("click",()=>{
  let parentElem = StartQuesBtn.parentElement;
  let parentNext = parentElem.nextElementSibling;
  parentElem.style.opacity = "0";
  parentElem.style.transform = "translateY(-30px)";
  window.setTimeout(()=>{
    parentElem.style.display = "none";
    parentNext.style.display = "block"
  },500)
})
//to move to the next ques
quesNextBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    let btnParent = btn.parentElement;
    if(btnParent.classList.contains("all-btns")){
      btnParent = btn.parentElement.parentElement
    }
    let parentNext = btnParent.nextElementSibling;
    let answarData = btnParent.querySelector(".clicked-ques").getAttribute("data-rep");
    let stepNum = btnParent.querySelector(".ques-title").innerText[0];
    answaresDataList[stepNum]= answarData;
    if(!parentNext.classList.contains("result")){
      btnParent.style.opacity = "0";
      btnParent.style.transform = "translateY(-30px)"
      window.setTimeout(()=>{
        btnParent.style.display = "none";
        parentNext.style.display = "block";
        parentNext.style.opacity = "1";
        parentNext.style.transform = "translateY(0px)";
      },500)
    }else{
      //result here
      btnParent.style.opacity = "0";
      btnParent.style.transform = "translateY(-30px)"
      window.setTimeout(()=>{
        btnParent.style.display = "none";
        parentNext.style.display = "flex";
        parentNext.style.opacity = "1";
        parentNext.style.transform = "translateY(0px)";
        let returnedMovie = generateMovieFromUserAnswers();
        if(returnedMovie.length > 0){
          let randomIndx = Math.trunc(Math.random()*returnedMovie.length);
          let showArea = parentNext.querySelector(".show-movie-area");
          showArea.appendChild(exploreAllLoadData(true,true,[returnedMovie[randomIndx][0],returnedMovie[randomIndx][1]]));
          lazyLoading();
        }else{
          console.log("its vide")
        }
      },500)
    }
  })
})
//to move back :
quesBackBtns.forEach(btn=>{
  btn.addEventListener("click",()=>{
    let btnParent = btn.parentElement.parentElement;
    let parentPrev = btnParent.previousElementSibling;
    btnParent.style.opacity = "0";
    btnParent.style.transform = "translateY(-30px)"
    window.setTimeout(()=>{
      btnParent.style.display = "none";
      parentPrev.style.display = "block";
      parentPrev.style.opacity = "1";
      parentPrev.style.transform = "translateY(0px)";
    },500)
  })
})
//to repeat the quest:
repeatQuesBtn.addEventListener("click",()=>{
  let btnParent = repeatQuesBtn.parentElement;
  let parentCard = btnParent.querySelector(".movie-card");
  btnParent.style.opacity = "0";
  btnParent.style.transform = "translateY(-30px)";
  window.setTimeout(()=>{
    parentCard.parentElement.removeChild(parentCard);
    btnParent.style.display = "none";
    quesNextBtns.forEach(btn=>{
      btn.style.opacity = "0";
      btn.style.visibility = "hidden";
      btn.style.transform = "translateY(30px)";
    })
    quesFormes.forEach(form=>{
      form.style.display = "none";
      form.style.opacity = "1";
      form.style.transform = "translateY(0px)";
    })
    allQuestions.forEach(ques=>{
      ques.classList.remove("clicked-ques");
    })
    quesFormes[0].style.display = "block";
  },500)
})
//Functions:
//random movies function
function generateRandomMovies() {
  let allGoupsContainers = document.createElement("div");
  allGoupsContainers.classList.add("all-groups");
  let cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-group");
  let filmsCounter = 0;
  let dejaVue = [];
  let cardsLimit = 5;
  if (window.matchMedia("(max-width: 1280px)").matches) {
    cardsLimit = 4;
  }
  if (window.matchMedia("(max-width: 993px)").matches) {
    cardsLimit = 3;
  }
  if (window.matchMedia("(max-width: 767px)").matches) {
    cardsLimit = 2;
  }
  if (window.matchMedia("(max-width: 480px)").matches) {
    cardsLimit = 1;
  }
  for (let i = 0; i < 35; i++) {
    filmsCounter += 1;
    let randomIndex = Math.trunc(Math.random() * moviesData.length);
    while (dejaVue.includes(randomIndex)) {
      randomIndex = Math.trunc(Math.random() * moviesData.length);
    }
    dejaVue.push(randomIndex);
    let randomMovies = moviesData[randomIndex];
    cardsContainer.innerHTML += `<div class="movie-card">
                                    <div class="movie-poster">
                                    <img data-src="${randomMovies.image}" alt="${randomMovies.title}" class="poster-img">
                                    <p class="movie-desc">${randomMovies.simple_desc}</p>
                                    </div>
                                    <div class="infos">
                                    <div class="movie-rating">
                                    <i class="fa-solid fa-star"></i>
                                    <span class="rate">${randomMovies.rating}</span>
                                    </div>
                                    <div class="movie-title">
                                    ${randomMovies.title}
                                    </div>
                                    <div class="add-to-watch-list-btn">
                                    <button data-index="${randomIndex}"><i class="fa-solid fa-plus"></i>Watchlist</button>
                                    </div>
                                    <div class="movies-genre">
                                    </div>    
                                    </div>
                                    </div>`;
    let moviesGenreContainer = cardsContainer.querySelector(
      ".movie-card:last-child .movies-genre"
    );
    for (let j = 0; j < randomMovies.genre.length; j++) {
      moviesGenreContainer.innerHTML += `<span>${randomMovies.genre[j]}</span>`;
    }
    if (filmsCounter === cardsLimit) {
      let newNode = cardsContainer.cloneNode(true);
      allGoupsContainers.appendChild(newNode);
      cardsContainer.innerHTML = "";
      filmsCounter = 0;
    }
  }
  allGoupsContainers
    .querySelector(".cards-group:first-child")
    .classList.add("visible");
  let numOfColumns = allGoupsContainers.children.length;
  allGoupsContainers.style.gridTemplateColumns = `repeat(${numOfColumns}, 100%)`;
  return [allGoupsContainers, numOfColumns];
}
//Specific movies function:
function generateSpecificMovies(genre) {
  let allGoupsContainers = document.createElement("div");
  allGoupsContainers.classList.add("all-groups");
  let cardsContainer = document.createElement("div");
  cardsContainer.classList.add("cards-group");
  let filmsCounter = 0;
  let groupsCounter = 0;
  let makeCard = false;
  let indexCounter = -1;
  let cardsLimit = 5;
  let groupsLimit = 7;
  if (window.matchMedia("(max-width: 1280px)").matches) {
    cardsLimit = 4;
    groupsLimit = 9;
  }
  if (window.matchMedia("(max-width: 993px)").matches) {
    cardsLimit = 3;
    groupsLimit = 12;
  }
  if (window.matchMedia("(max-width: 767px)").matches) {
    cardsLimit = 2;
    groupsLimit = 18;
  }
  if (window.matchMedia("(max-width: 480px)").matches) {
    cardsLimit = 1;
    groupsLimit = 35;
  }
  for (let i = 0; i < moviesData.length; i++) {
    let foundGenre = false;
    indexCounter += 1;
    moviesData[i].genre.forEach((g) => {
      if (g.trim() === genre) {
        foundGenre = true;
      }
    });
    if (foundGenre) {
      makeCard = false;
      filmsCounter += 1;
      cardsContainer.innerHTML += `<div class="movie-card">
                                      <div class="movie-poster">
                                      <img data-src="${moviesData[i].image}" alt="${moviesData[i].title}" class="poster-img">
                                      <p class="movie-desc">${moviesData[i].simple_desc}</p>
                                      </div>
                                      <div class="infos">
                                      <div class="movie-rating">
                                      <i class="fa-solid fa-star"></i>
                                      <span class="rate">${moviesData[i].rating}</span>
                                      </div>
                                      <div class="movie-title">
                                      ${moviesData[i].title}
                                      </div>
                                      <div class="add-to-watch-list-btn">
                                      <button data-index="${indexCounter}"><i class="fa-solid fa-plus"></i>Watchlist</button>
                                      </div>
                                      <div class="movies-genre">
                                      </div>    
                                      </div>
                                      </div>`;
      let moviesGenreContainer = cardsContainer.querySelector(
        ".movie-card:last-child .movies-genre"
      );
      for (let j = 0; j < moviesData[i].genre.length; j++) {
        moviesGenreContainer.innerHTML += `<span>${moviesData[i].genre[j]}</span>`;
      }
      if (filmsCounter === cardsLimit) {
        groupsCounter += 1;
        makeCard = true;
        let newNode = cardsContainer.cloneNode(true);
        allGoupsContainers.appendChild(newNode);
        cardsContainer.innerHTML = "";
        filmsCounter = 0;
      }
      if (groupsCounter === groupsLimit) {
        break;
      }
    }
  }
  if (makeCard) {
    allGoupsContainers
      .querySelector(".cards-group:first-child")
      .classList.add("visible");
  } else {
    allGoupsContainers.appendChild(cardsContainer);
    allGoupsContainers
      .querySelector(".cards-group:first-child")
      .classList.add("visible");
  }
  let numOfColumns = allGoupsContainers.children.length;
  allGoupsContainers.style.gridTemplateColumns = `repeat(${numOfColumns}, 100%)`;
  return [allGoupsContainers, numOfColumns];
}
//watch list movies function;
function generateMyWatchListMovies(sec) {
  if (JSON.parse(window.localStorage.getItem("myWatchList"))) {
    //load data
    let myMovies = JSON.parse(window.localStorage.getItem("myWatchList"));
    //see movies list not empty
    if (myMovies.length > 0) {
      sec.style.display = "block";
      let allGoupsContainers = document.createElement("div");
      allGoupsContainers.classList.add("all-groups");
      let cardsContainer = document.createElement("div");
      cardsContainer.classList.add("cards-group");
      let filmsCounter = 0;
      let groupsCounter = 0;
      let makeCard = false;
      let cardsLimit = 5;
      let groupsLimit = 7;
      if (window.matchMedia("(max-width: 1280px)").matches) {
        cardsLimit = 4;
        groupsLimit = 9;
      }
      if (window.matchMedia("(max-width: 993px)").matches) {
        cardsLimit = 3;
        groupsLimit = 12;
      }
      if (window.matchMedia("(max-width: 767px)").matches) {
        cardsLimit = 2;
        groupsLimit = 18;
      }
      if (window.matchMedia("(max-width: 480px)").matches) {
        cardsLimit = 1;
        groupsLimit = 35;
      }
      for (let i = 0; i < myMovies.length; i++) {
        makeCard = false;
        filmsCounter += 1;
        cardsContainer.innerHTML += `<div class="movie-card">
                                        <div class="movie-poster">
                                        <img data-src="${
                                          moviesData[myMovies[i]].image
                                        }" alt="${
          moviesData[myMovies[i]].title
        }" class="poster-img">
                                        <p class="movie-desc">${
                                          moviesData[myMovies[i]].simple_desc
                                        }</p>
                                        </div>
                                        <div class="infos">
                                        <div class="movie-rating">
                                        <i class="fa-solid fa-star"></i>
                                        <span class="rate">${
                                          moviesData[myMovies[i]].rating
                                        }</span>
                                        </div>
                                        <div class="movie-title">
                                        ${moviesData[myMovies[i]].title}
                                        </div>
                                        <div class="remove-to-watch-list-btn">
                                        <button data-index="${
                                          myMovies[i]
                                        }"><i class="fa-solid fa-minus"></i>Remove</button>
                                        </div>
                                        <div class="movies-genre">
                                        </div>    
                                        </div>
                                        </div>`;
        let moviesGenreContainer = cardsContainer.querySelector(
          ".movie-card:last-child .movies-genre"
        );
        for (let j = 0; j < moviesData[myMovies[i]].genre.length; j++) {
          moviesGenreContainer.innerHTML += `<span>${
            moviesData[myMovies[i]].genre[j]
          }</span>`;
        }
        if (filmsCounter === cardsLimit) {
          groupsCounter += 1;
          makeCard = true;
          let newNode = cardsContainer.cloneNode(true);
          allGoupsContainers.appendChild(newNode);
          cardsContainer.innerHTML = "";
          filmsCounter = 0;
        }
        if (groupsCounter === groupsLimit) {
          break;
        }
      }
      if (makeCard) {
        allGoupsContainers
          .querySelector(".cards-group:first-child")
          .classList.add("visible");
      } else {
        allGoupsContainers.appendChild(cardsContainer);
        allGoupsContainers
          .querySelector(".cards-group:first-child")
          .classList.add("visible");
      }
      let numOfColumns = allGoupsContainers.children.length;
      allGoupsContainers.style.gridTemplateColumns = `repeat(${numOfColumns}, 100%)`;
      return [allGoupsContainers, numOfColumns, true];
    } else {
      sec.style.display = "none";
      return [null, null, false];
    }
  } else {
    sec.style.display = "none";
    return [null, null, false];
  }
}
function generateMovieFromUserAnswers(){
  let moviesResult = [];
  function worstCase(){
    moviesData.forEach((movie,indx)=>{
      if(answaresDataList[5] === "heist-movies"){
       movie.keywords.forEach(key=>{
        if(key.split(" ").includes("heist")){
          moviesResult.push([movie,indx]);
        }
       })
      }
      else if(answaresDataList[5] === "space-movies"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("space")){
          moviesResult.push([movie,indx]);
         }
        })
       }
       else if(answaresDataList[5] === "true-story"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("true") && key.split(" ").includes("story")){
          moviesResult.push([movie,indx]);
         }
        })
       }
       else if(answaresDataList[5] === "based-on-book"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("based") && key.split(" ").includes("book")){
          moviesResult.push([movie,indx]);
         }
        })
       }
       else{
        if(parseInt(movie.rating[0]) >= 8){
          moviesResult.push([movie,indx]);
        }
       }
    })
    return moviesResult;
  }
  moviesData.forEach((movie,indx)=>{
    let stepOne = false,
        stepTwo = false,
        stepThree = false,
        stepFour = false,
        stepFive = false
    if(answaresDataList[1] === "sad"){
      movie.genre.forEach(g=>{
        if(g.trim() === "Romance" || g.trim() === "Comedy" || g.trim() === "Drama" || g.trim() === "Horror"){
          stepOne = true
        }
      })
    }
    else if(answaresDataList[1] === "neutral"){
      stepOne = true
    }
    else{
      let foundHor = false;
      movie.genre.forEach(g=>{
        if(g.trim() === "Horror"){
          foundHor = true;
        }
      })
      if(!foundHor){
        stepOne = true;
      }
    }
    if(stepOne){
      if(answaresDataList[2] === "date"){
        movie.genre.forEach(g=>{
          if(g.trim() === "Horror" || g.trim() === "Romance" || g.trim() === "Comedy"){
            stepTwo = true;
          }
        })
      }
      else if(answaresDataList[2] === "alone"){
        movie.genre.forEach(g=>{
          if(g.trim() === "Thriller" || g.trim() === "Mystery" || g.trim() === "Horror" || g.trim() === "Crime" || g.trim() === "Drama"){
            stepTwo = true;
          }
        })
      }
      else if(answaresDataList[2] === "family"){
        movie.genre.forEach(g=>{
          if(g.trim() === "Family"){
            stepTwo = true;
          }
        })
      }
      else{
        stepTwo = true;
      }
    }
    if(stepTwo){
      movie.genre.forEach(g=>{
        if(g.trim().toLowerCase() === answaresDataList[3]){
          stepThree = true;
        }
      })
    }
    if(stepThree){
      if(answaresDataList[4] === "none"){
        stepFour = true;
      }else{
        let releaseDate = new Date().getFullYear() - parseInt(answaresDataList[4]);
        if(parseInt(movie.year.slice(1,movie.year.length-1)) >= releaseDate){
          stepFour = true
        }
      }
    }
    if(stepFour){
      if(answaresDataList[5] === "heist-movies"){
       movie.keywords.forEach(key=>{
        if(key.split(" ").includes("heist")){
          stepFive = true;
        }
       })
      }
      else if(answaresDataList[5] === "space-movies"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("space")){
           stepFive = true;
         }
        })
       }
       else if(answaresDataList[5] === "true-story"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("true") && key.split(" ").includes("story")){
           stepFive = true;
         }
        })
       }
       else if(answaresDataList[5] === "based-on-book"){
        movie.keywords.forEach(key=>{
         if(key.split(" ").includes("based") && key.split(" ").includes("book")){
           stepFive = true;
         }
        })
       }
       else{
        if(parseInt(movie.rating[0]) >= 8){
          stepFive = true;
        }
       }
    }
    if(stepFive){
      moviesResult.push([movie,indx])
    }
  })
  return moviesResult.length > 0 ? moviesResult : worstCase();
}
//lazy load.
function lazyLoading(){
  let options = {
    root:null,
    rootMargin:'0px',
    threshold:0.25,
  };
  let allPosterImgs = document.querySelectorAll(".movie-card .movie-poster .poster-img");
  let callback = (entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && entry.target.classList.contains("poster-img")){
        let imgUrl = entry.target.getAttribute("data-src");
        entry.target.setAttribute("src",imgUrl);
      };
    });
  };
  let observer = new IntersectionObserver(callback,options);
  allPosterImgs.forEach(img=>{
    observer.observe(img);
  });
}
lazyLoading();