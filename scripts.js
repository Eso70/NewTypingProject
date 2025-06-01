class TypingTest {
  constructor() {
    // Words to type
    this.englishWords =
      "abandon abstract adapt advocate ambiguity analysis anticipate apparent approach appropriate aspect assess assume atmosphere attach available aware benefit bias brief capacity category challenge circumstance clarify collapse colleague commit community complex component concept conclude conduct confirm consequence consistent constant consult context contrast contribute controversy convenient cooperate corporate create debate decline define demonstrate derive design despite distinct distribute diverse element eliminate emerge emphasize encounter environment establish evaluate evident evolve exclude export facilitate factor feature finance focus function generate global guarantee hierarchy identify illustrate impact implement imply incentive income indicate infer infrastructure inherent innovate instance institute integrate interpret interval invest isolate justify labor lecture legal legislate maintain manual margin mature mechanism media medical mental migrate ministry modify monitor motive mutual negate network neutral notion objective observe obvious occupy outcome output overall perceive persistent perspective phase philosophy physical policy portion positive potential practitioner precise predict predominant preliminary preserve previous primary priority proceed professional promote proportion prospect publish pursue reaction reinforce reject relevant reluctant reside resource respond revenue reveal schedule sector select sequence shift significant similar source specific statistic status strategy stress submit subsequent substitute sufficient survey sustain symbol target technical technique technology temporary theory topic trace transfer transform transit trend ultimate undergo uniform unique valid vary vehicle version visual voluntary widespread".split(
        " "
      );
    this.engWordCount = this.englishWords.length;

    // Extra data for features
    this.numbers = "0123456789".split("");
    this.punctuationMarks = [".", ",", "?", "!", ";", ":", "-", '"', "'"];

    // Cache DOM elements
    this.wordWrapper = document.getElementById("words");
    this.typingSection = document.getElementById("typing-section");
    this.currentWord = null;
    this.currentLetter = null;
    this.isCtrl = false;
    this.isPunctuationMode = false;
    this.isNumberMode = false;

    this.init();
  }

  init() {
    this.loadWords();
    this.typingSection.addEventListener("keydown", this.handleKeyDown.bind(this), {
      passive: true,
    });

    this.setupBannerClose();
    this.handleCapslockInput();
    this.handleKeyboardShortcuts();

    const puncBtn = document.getElementById("punc-btn");
    if (puncBtn) {
      puncBtn.addEventListener("click", this.punctuationBtn.bind(this));
    }

    const numBtn = document.getElementById("num-btn");
    if (numBtn) {
      numBtn.addEventListener("click", this.numberBtn.bind(this));
    }
  }


  // Setup close button for top banner
  setupBannerClose() {
    this.closeButton = document.getElementById("close-button");
    this.banner = document.getElementById("banner-center");

    if (localStorage.getItem("bannerClosed") === "true") {
      if (this.banner) {
        this.banner.style.display = "none";
      }
      return;
    }

    if (this.closeButton && this.banner) {
      this.closeButton.addEventListener("click", () => {
        this.banner.style.display = "none";
        localStorage.setItem("bannerClosed", "true");
      });
    }
  }

  punctuationBtn() {
    const puncBtn = document.getElementById("punc-btn");
    if (puncBtn) {
      puncBtn.classList.toggle("active");
      this.isPunctuationMode = !this.isPunctuationMode;
    }
    this.loadWords();
  }
  numberBtn(){
    const numBtn = document.getElementById('num-btn');
    if(numBtn){
      numBtn.classList.toggle("active")
      this.isNumberMode = !this.isNumberMode;
    }
    this.loadWords();
  }

  // Load 50 random words into the DOM
  loadWords() {
    let html = "";
    for (let i = 0; i < 50; i++) {
      html += this.formatWord(this.randomWord());
      if (this.isPunctuationMode && Math.random() < 0.3) {
        const randomPunctuation = this.punctuationMarks[Math.floor(Math.random() * this.punctuationMarks.length)];
        html += this.formatWord(randomPunctuation);
      }
      if (this.isNumberMode && Math.random() < 0.3) {
        const numCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numCount; i++) {
          const randomNumber = this.numbers[Math.floor(Math.random() * this.numbers.length)];
          html+= this.formatWord(randomNumber);
        }
      }
    }
    if (this.wordWrapper) {
      this.wordWrapper.innerHTML = html;

      this.currentWord = this.wordWrapper.querySelector(".word");
      this.currentLetter = this.currentWord.querySelector(".letter");

      this.addClass(this.currentWord, "current");
      this.addClass(this.currentLetter, "current");
    }
  }

  // Pick a random word
  randomWord() {
    const randomIndex = Math.floor(Math.random() * this.engWordCount);
    let word = this.englishWords[randomIndex];
    return word;
  }

  formatWord(word) {
    return `<div class="word"><span class="letter">${word
      .split("")
      .join("</span><span class='letter'>")}</span></div>`;
  }

  addClass(el, cls) {
    if (el && !el.classList.contains(cls)) el.classList.add(cls);
  }

  removeClass(el, cls) {
    if (el && el.classList.contains(cls)) el.classList.remove(cls);
  }

  handleKeyDown(ev) {
    const key = ev.key;

    if (!this.currentWord || !this.currentLetter) return;

    const expected = this.currentLetter.innerHTML;
    const isLetterKey = key.length === 1 && key !== " " && key !== "Backspace";
    const isSpaceKey = key === " ";
    const isBackspace = key === "Backspace";

    if (isLetterKey) {
      this.handleLetterInput(key, expected);
    } else if (isSpaceKey) {
      this.handleSpaceInput();
    } else if (isBackspace) {
      this.handleBackspaceInput();
    }
  }

  handleLetterInput(key, expected) {
    if (key === expected) {
      this.addClass(this.currentLetter, "correct");
    } else {
      this.addClass(this.currentLetter, "incorrect");
    }

    if (this.currentLetter.nextSibling) {
      this.removeClass(this.currentLetter, "current");
      this.currentLetter = this.currentLetter.nextSibling;
      this.addClass(this.currentLetter, "current");
    }
  }

  handleSpaceInput() {
    const expected = this.currentLetter.innerHTML;

    if (expected !== " ") {
      const letters = this.currentWord.querySelectorAll(
        ".letter:not(.correct)"
      );
      letters.forEach((letter) => this.addClass(letter, "incorrect"));
    }

    this.removeClass(this.currentWord, "current");
    this.removeClass(this.currentLetter, "current");

    if (this.currentWord.nextSibling) {
      this.currentWord = this.currentWord.nextSibling;
      this.addClass(this.currentWord, "current");

      this.currentLetter = this.currentWord.querySelector(".letter");
      this.addClass(this.currentLetter, "current");
    }
  }

  handleBackspaceInput() {
    if (!this.currentLetter) return;

    const isFirstLetter =
      this.currentLetter === this.currentWord.firstElementChild;

    if (isFirstLetter) {
      const prevWord = this.currentWord.previousElementSibling;
      if (prevWord) {
        this.removeClass(this.currentWord, "current");
        this.removeClass(this.currentLetter, "current");

        this.currentWord = prevWord;
        this.currentLetter = this.currentWord.lastElementChild;

        this.addClass(this.currentWord, "current");
        this.addClass(this.currentLetter, "current");
        this.removeClass(this.currentLetter, "correct");
        this.removeClass(this.currentLetter, "incorrect");
      }
    } else {
      this.removeClass(this.currentLetter, "current");
      this.currentLetter = this.currentLetter.previousElementSibling;
      this.addClass(this.currentLetter, "current");
      this.removeClass(this.currentLetter, "correct");
      this.removeClass(this.currentLetter, "incorrect");
    }
  }

  handleCapslockInput() {
    const capslockElement = document.getElementById("capslock");
    if (!capslockElement) return;

    ["keydown", "keyup"].forEach((event) => {
      document.body.addEventListener(event, (ev) => {
        const isCaps =
          ev.getModifierState && ev.getModifierState("CapsLock");
        capslockElement.style.display = isCaps ? "flex" : "none";
      });
    });
  }

  handleKeyboardShortcuts() {
    document.body.addEventListener("keydown", (event) => {
      if (event.key === "Control") {
        this.isCtrl = true;
      }

      const active = document.activeElement;
      if (
        active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable
      ) {
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        this.loadWords();
      } else if (event.key === "Escape") {
        this.handleSearch?.(); // Only call if defined
      } else if (this.isCtrl && event.key === "Backspace") {
        event.preventDefault();
        this.loadWords();
      }
    });

    document.body.addEventListener("keyup", (event) => {
      if (event.key === "Control") {
        this.isCtrl = false;
      }
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new TypingTest();
});
