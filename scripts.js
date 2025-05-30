class TypingTest {
  constructor() {
    // Words to type
    this.englishWords = "abandon abstract adapt advocate ambiguity analysis anticipate apparent approach appropriate aspect assess assume atmosphere attach available aware benefit bias brief capacity category challenge circumstance clarify collapse colleague commit community complex component concept conclude conduct confirm consequence consistent constant consult context contrast contribute controversy convenient cooperate corporate create debate decline define demonstrate derive design despite distinct distribute diverse element eliminate emerge emphasize encounter environment establish evaluate evident evolve exclude export facilitate factor feature finance focus function generate global guarantee hierarchy identify illustrate impact implement imply incentive income indicate infer infrastructure inherent innovate instance institute integrate interpret interval invest isolate justify labor lecture legal legislate maintain manual margin mature mechanism media medical mental migrate ministry modify monitor motive mutual negate network neutral notion objective observe obvious occupy outcome output overall perceive persistent perspective phase philosophy physical policy portion positive potential practitioner precise predict predominant preliminary preserve previous primary priority proceed professional promote proportion prospect publish pursue reaction reinforce reject relevant reluctant reside resource respond revenue reveal schedule sector select sequence shift significant similar source specific statistic status strategy stress submit subsequent substitute sufficient survey sustain symbol target technical technique technology temporary theory topic trace transfer transform transit trend ultimate undergo uniform unique valid vary vehicle version visual voluntary widespread".split(" ");
    this.engWordCount = this.englishWords.length;

    // Cache DOM elements
    this.wordWrapper = document.getElementById("words");
    this.typingSection = document.getElementById("typing-section");
    this.currentWord = null;
    this.currentLetter = null;

    this.init();
  }

  init() {
    this.loadWords();
    this.typingSection.addEventListener("keydown", this.handleKeyDown.bind(this), { passive: true });

    this.setupBannerClose();
    this.handleCapslockInput();
    this.handleKeyboardShortcuts();
  }

  // Setup close button for top banner
  setupBannerClose() {
    this.closeButton = document.getElementById("close-button");
    this.banner = document.getElementById("banner-center");

    // Check if banner was already closed and hide it
    if (localStorage.getItem("bannerClosed") === "true") {
      if (this.banner) {
        this.banner.style.display = "none";
      }
      return;
    }

    // Attach click handler to close button
    if (this.closeButton && this.banner) {
      this.closeButton.addEventListener("click", () => {
        this.banner.style.display = "none";
        localStorage.setItem("bannerClosed", "true"); // Save state
      });
    }
  }


  // Load 50 random words into the DOM
  loadWords() {
    let html = "";
    for (let i = 0; i < 50; i++) {
      html += this.formatWord(this.randWord());
    }
    this.wordWrapper.innerHTML = html;

    this.currentWord = this.wordWrapper.querySelector(".word");
    this.currentLetter = this.currentWord.querySelector(".letter");

    this.addClass(this.currentWord, "current");
    this.addClass(this.currentLetter, "current");
  }

  // Pick a random word
  randWord() {
    const index = Math.floor(Math.random() * this.engWordCount);
    return this.englishWords[index];
  }

  // Format word with span-wrapped letters
  formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
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
    const isLetterKey = key.length === 1 && key !== ' ' && key !== 'Backspace';
    const isSpaceKey = key === ' ';
    const isBackspace = key === 'Backspace';

    if (isLetterKey) {
      this.handleLetterInput(key, expected);
    } else if (isSpaceKey) {
      this.handleSpaceInput();
    } else if(isBackspace){
      this.handleBackspaceInput();
    }
  }

  // Typing a letter
  handleLetterInput(key, expected) {
    if (key === expected) {
      this.addClass(this.currentLetter, "correct");
    } else {
      this.addClass(this.currentLetter, "incorrect");
    }

    this.removeClass(this.currentLetter, "current");

    if (this.currentLetter.nextSibling) {
      this.currentLetter = this.currentLetter.nextSibling;
      this.addClass(this.currentLetter, "current");
    }
  }

  // Handle pressing spacebar
  handleSpaceInput() {
    const expected = this.currentLetter.innerHTML;

    if (expected !== ' ') {
      const letters = this.currentWord.querySelectorAll(".letter:not(.correct)");
      letters.forEach(letter => this.addClass(letter, "incorrect"));
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

  // Show/hide caps lock warning
  handleCapslockInput() {
    const capslockElement = document.getElementById("capslock");
    if (!capslockElement) return;

    ["keydown", "keyup"].forEach(event => {
      document.body.addEventListener(event, ev => {
        const isCaps = ev.getModifierState && ev.getModifierState("CapsLock");
        capslockElement.style.display = isCaps ? "flex" : "none";
      });
    });
  }
  
  handleBackspaceInput() {
  if (!this.currentLetter) return;

  const isFirstLetter = this.currentLetter === this.currentWord.firstElementChild;

  if (isFirstLetter) {
    const prevWord = this.currentWord.previousElementSibling;
    if (prevWord) {
      // Move to the previous word
      this.removeClass(this.currentWord, 'current');
      this.removeClass(this.currentLetter, 'current');

      this.currentWord = prevWord;
      this.currentLetter = this.currentWord.lastElementChild;

      this.addClass(this.currentWord, 'current');
      this.addClass(this.currentLetter, 'current');
      this.removeClass(this.currentLetter, 'correct');
      this.removeClass(this.currentLetter, 'incorrect');
    }
  } else {
      // Move one letter back within the current word
      this.removeClass(this.currentLetter, 'current');
      this.currentLetter = this.currentLetter.previousElementSibling;
      this.addClass(this.currentLetter, 'current');
      this.removeClass(this.currentLetter, 'correct');
      this.removeClass(this.currentLetter, 'incorrect');
    }
  }



  handleKeyboardShortcuts() {
    document.body.addEventListener('keydown', (event) => {
      // Use event.code for physical key or event.key for character

      // Ignore if user is typing in input, textarea, or contenteditable
      const active = document.activeElement;
      if (
        active.tagName === 'INPUT' || 
        active.tagName === 'TEXTAREA' || 
        active.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'Tab':
          event.preventDefault(); // prevent tab focusing next element
          this.loadWords();
          break;

        case 'Escape':
          // For example, clear typing area or reset test
          this.handleSearch();
          break;

        default:
          break;
      }
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new TypingTest();
});
