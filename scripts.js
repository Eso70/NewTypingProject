const englishWords = "nature reload create plan could would none".split(" ");
const engWordCount = englishWords.length;
const closeButton = document.getElementById("closeButton");
const banner = document.getElementById("bannerCenter");
const punc = document.getElementById("punc");
const num = document.getElementById("num");
const time = document.getElementById('time');
const quote = document.getElementById('quote');
const zen = document.getElementById('zen');
const custom = document.getElementById('custom');


if (closeButton && banner) {
    closeButton.addEventListener('click', () => {
        banner.style.display = "none";
    });
}
if (punc) {
  punc.addEventListener('click', () => {
    removeActiveClasses();
    punctuation();
  });
}
if (num) {
  num.addEventListener('click', () => {
    removeActiveClasses();
    number();
  });
}

function rand(){
  const randomIndex = Math.floor(Math.random() * engWordCount);
  return englishWords[randomIndex];
}
function formatedWord(word){
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
function loadWord() {
  const wordWrapper = document.getElementById("words");
  let html = "";
  for (let i = 0; i < 50; i++) {
    html += formatedWord(rand());
  }
  wordWrapper.innerHTML = html;
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
}
function addClass(element, name) {element.classList.add(name);}
function removeClass(element, name) {element.classList.remove(name);}
function selectPunctuation(){}
function selectNumber(){}
function selectWord() {}
function selectQuote() {}
function selectZen() {}
function selectCustom() {}

document.addEventListener("DOMContentLoaded", () => {
  loadWord();
});
