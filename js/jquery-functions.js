$("document").ready(function () {
  var currentQuestion = 0;
  var totalQuestions = 0;
  var userAnswers = {};
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  //hide the form buttons when its necessary
  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  //Once the form begins, the questions' data and length are fetched.
  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;
        totalQuestions = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Error: Failed to fetch all-questions-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch all-questions.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the evidences' data and length are fetched.
  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;
        totalEvidences = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en:", error);

            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch cpsv-en.json.";
            $(".question-container").html(errorMessage);

            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv:", error);

        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch cpsv.json.";
        $(".question-container").html(errorMessage);

        hideFormBtns();
      });
  }

  //Once the form begins, the faqs' data is fetched.
  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;
        totalFaq = data.length;

        // Fetch the second JSON file
        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en:", error);
            // Show error message to the user
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Error: Failed to fetch faq-en.json.";
            $(".question-container").html(errorMessage);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq:", error);
        // Show error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Error: Failed to fetch faq.json.";
        $(".question-container").html(errorMessage);
      });
  }

  function getEvidencesById(id) {
    var selectedEvidence;
    currentLanguage === "greek"
      ? (selectedEvidence = all_evidences)
      : (selectedEvidence = all_evidences_en);
    selectedEvidence = selectedEvidence.PublicService.evidence.find(
      (evidence) => evidence.id === id
    );

    if (selectedEvidence) {
      const evidenceListElement = document.getElementById("evidences");
      selectedEvidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    } else {
      console.log(`Evidence with ID '${givenEvidenceID}' not found.`);
    }
  }

  //text added in the final result
  function setResult(text) {
    const resultWrapper = document.getElementById("resultWrapper");
    const result = document.createElement("h5");
    result.textContent = text;
    resultWrapper.appendChild(result);
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${faqTitle}
        </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
          ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  // get the url from faqs and link it
  function convertURLsToLinks(text) {
    return text.replace(
      /https:\/\/www\.gov\.gr\/[\S]+/g,
      '<a href="$&" target="_blank">' + "myKEPlive" + "</a>" + "."
    );
  }


  //Εachtime back/next buttons are pressed the form loads a question
  function loadQuestion(questionId, noError) {
    
    $("#nextQuestion").show();
    if (currentQuestion > 0) {
      $("#backButton").show();
    } 

    currentLanguage === "greek"
      ? (question = all_questions[questionId])
      : (question = all_questions_en[questionId]);
    var questionElement = document.createElement("div");

    //If the user has answered the question (checked a value), no error occurs. Otherwise you get an error (meaning that user needs to answer before he continues to the next question)!
    if (noError) {
      questionElement.innerHTML = `
                <div class='govgr-field'>
                    <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
                        <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                            ${question.question}
                        </legend>
                        <div class='govgr-radios' id='radios-${questionId}'>
                            <ul>
                                ${question.options
                                  .map(
                                    (option, index) => `
                                    <div class='govgr-radios__item'>
                                        <label class='govgr-label govgr-radios__label'>
                                            ${option}
                                            <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                        </label>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    </fieldset>
                </div>
            `;
    } else {
      questionElement.innerHTML = `
            <div class='govgr-field govgr-field__error' id='$id-error'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                        ${question.question}
                    </legend>
                <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
                    <legend  class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
                        Επιλέξτε την απάντησή σας
                    </legend>
                    <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
                    <div class='govgr-radios id='radios-${questionId}'>
                        <p class='govgr-error-message'>
                            <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                            <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
                        </p>
                        
                            ${question.options
                              .map(
                                (option, index) => `
                                <div class='govgr-radios__item'>
                                    <label class='govgr-label govgr-radios__label'>
                                        ${option}
                                        <input class='govgr-radios__input' type='radio' name='question-option' value='${option}' />
                                    </label>
                                </div>
                            `
                              )
                              .join("")}
                    </div>
                </fieldset>
            </div>
        `;

      //The reason for manually updating the components of the <<error>> questionElement is because the
      //querySelectorAll method works on elements that are already in the DOM (Document Object Model)
      if (currentLanguage === "english") {
        // Manually update the english format of the last 4 text elements in change-language.js
        //chooseAnswer: "Choose your answer",
        //oneAnswer: "You can choose only one option.",
        //errorAn: "Error:",
        //choose: "You must choose one option"
        var components = Array.from(
          questionElement.querySelectorAll(".language-component")
        );
        components.slice(-4).forEach(function (component) {
          var componentName = component.dataset.component;
          component.textContent =
            languageContent[currentLanguage][componentName];
        });
      }
    }

    $(".question-container").html(questionElement);
  }

  function skipToEnd(message) {
    const errorEnd = document.createElement("h5");
    const error =
      currentLanguage === "greek"
        ? "Λυπούμαστε αλλά δεν δικαιούστε το στεγαστικό επδίδομα φοιτητών!"
        : "We are sorry but you are not entitled to the Housing allowance for university students!";
    errorEnd.className = "govgr-error-summary";
    errorEnd.textContent = error + " " + message;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  function retrieveAnswers() {
    var allAnswers = [];
    // currentLanguage === "greek" ? result = "Πρέπει να υποβάλετε id1": result = "You must submit id1";

    //getEvidencesById(1);
    for (var i = 0; i < totalQuestions; i++) {
      var answer = sessionStorage.getItem("answer_" + i);
      allAnswers.push(answer);
    }
    if (allAnswers[0] === "2") {
      getEvidencesById(9);
      getEvidencesById(2);
      currentLanguage === "greek"
      ? setResult("Μη εξατρώμενο τέκνο θεωρείται ο φοιτητής που έχει ξεπεράσει την ηλικία των 25 ετών ή είναι υπόχρεος σε υποβολή φορολογικής δήλωσης.")
      : setResult("A non-dependent child is considered a student who has exceeded the age of 25 or is required to file a tax return.");
    }
    else if (allAnswers[0] === "3") {
      getEvidencesById(10);
      getEvidencesById(2);
      currentLanguage === "greek"
      ? setResult("Στην περίπτωση που οι γονείς του φοιτητή είναι κάτοικοι εξωτερικού, ο φοιτητής υποχρεούται να προσκομίσει στην αρμόδια υπηρεσία του ιδρύματος όλα τα δικαιολογητικά που αφορούν στο εισόδημα και στην περιουσιακή του κατάσταση τόσο του ιδίου όσο και των γονέων του ή του γονέα τον οποίο βαρύνει.")
      : setResult("In the event that the student's parents are residents abroad, the student is required to submit to the competent service of the institution all supporting documents relating to his income and financial situation, both his own and that of his parents or the parent on whom he is dependent.");
    }
    else if (allAnswers[0] === "4") {
      getEvidencesById(1);
      getEvidencesById(2);
    }
    if (allAnswers[2] === "1") {
      getEvidencesById(3);
    }
    if (allAnswers[4] === "1" && allAnswers[3] === "1") {
      currentLanguage === "greek"
      ? setResult("Το ετήσιο ποσό στέγασης που δικαιούστε ανέρχεται στα 2.000 ευρώ, καθώς η μισθωμένη κατοικία ειναι εντός της Περιφέρειας Αττικής ή της Περιφερειακής Ενότητας Θεσσαλονίκης και συνυπάρχει συγκάτοικος που πληρεί τις προϋποθέσεις.")
      : setResult("The annual housing amount you are entitled to is this 2,000 euros.");
    }
    if (allAnswers[4] === "2" && allAnswers[3] === "1") {
      currentLanguage === "greek"
      ? setResult("Το ετήσιο ποσό στέγασης που δικαιούστε ανέρχεται στα 2.000 ευρώ, καθώς η μισθωμένη κατοικία ειναι εντός της Περιφέρειας Αττικής ή της Περιφερειακής Ενότητας Θεσσαλονίκης και δεν συνυπάρχει συγκάτοικος που να πληρεί τις προϋποθέσεις.")
      : setResult("The annual housing amount you are entitled to is 2,000 euros.");
    }
    if (allAnswers[4] === "1" && allAnswers[3] === "2") {
      currentLanguage === "greek"
      ? setResult("Το ετήσιο ποσό στέγασης που δικαιούστε ανέρχεται στα 2.500 ευρώ, καθώς η μισθωμένη κατοικία δεν ειναι εντός της Περιφέρειας Αττικής ή της Περιφερειακής Ενότητας Θεσσαλονίκης αλλά συνυπάρχει συγκάτοικος που να πληρεί τις προϋποθέσεις.")
      : setResult("The annual housing amount you are entitled to is this 2,500 euros.");
    }
    if (allAnswers[4] === "2" && allAnswers[3] === "2") {
      currentLanguage === "greek"
      ? setResult("Το ετήσιο ποσό στέγασης που δικαιούστε ανέρχεται στα 1.500 ευρώ, καθώς η μισθωμένη κατοικία δεν ειναι εντός της Περιφέρειας Αττικής ή της Περιφερειακής Ενότητας Θεσσαλονίκης και δεν συνυπάρχει συγκάτοικος που να πληρεί τις προϋποθέσεις.")
      : setResult("The annual housing amount you are entitled to is 1,500 euros.");
    }
    if (allAnswers[5] === "3") {
      getEvidencesById(4);
      currentLanguage === "greek"
      ? setResult("Σε περίπτωση που το διάστημα για το οποίο γίνεται η αίτηση αποτελείται από περισσότερα του ενός μισθωτήριων συμβολαίων, πρέπει να κατατεθούν όλα στην υπηρεσία προς έλεγχο.")
      : setResult("If the period for which the application is submitted consists of more than one rental contract, all contracts must be submitted to the relevant service for review.");
    }
    if (allAnswers[6] === "1") {
      getEvidencesById(5);
    }
    if (allAnswers[7] === "1") {
      getEvidencesById(6);
    }
    if (allAnswers[9] === "1") {
      getEvidencesById(7);
    }
    if (allAnswers[10] === "1") {
      getEvidencesById(8);
    }
  }

  function submitForm() {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Είστε δικαιούχος!"
        : "You are eligible!";
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);
    
    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά για την επιδότηση στέγασης που πρέπει να προσκομίσετε προς έλεγχο από τις αρμόδιες υπηρεσίες των ΑΕΙ, σε περίπτωση που αυτά δε διασταυρωθούν μέσω της ηλεκτρονικής εφαρμογής είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The housing subsidy documents that you must submit for review by the competent university authorities, in case they are not verified through the electronic application, are as follows:</h5><br />"
        );
    $(".question-container").append(evidenceListElement);
    $("#faqContainer").load("faq.html");
    retrieveAnswers();
    hideFormBtns();
  }

  $("#nextQuestion").click(function () {
    if ($(".govgr-radios__input").is(":checked")) {
      var selectedRadioButtonIndex =
        $('input[name="question-option"]').index(
          $('input[name="question-option"]:checked')
        ) + 1;
      console.log(selectedRadioButtonIndex);
      if (currentQuestion === 0 && (selectedRadioButtonIndex === 1 || selectedRadioButtonIndex === 5)) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Η αίτηση πρέπει να γίνεται από τον γονέα που επιβαρύνει το εξαρτώμενο τέκνο ή από τον ίδιο τον φοιτητή σε περίπτωση που δεν είναι εξαρτώμενο τέκνο.") : skipToEnd("The application must be made by the parent who is responsible for the dependent child or by the student himself/herself if he/she is not a dependent child.");
      } else if (currentQuestion === 1 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής πρέπει να φοιτά για την απόκτηση πρώτου πτυχίου και να μην έχει υπερβεί τη διάρκεια φοίτησης ως προς τα εξάμηνα που απαιτούνται για τη λήψη του πτυχίου, σύμφωνα με το πρόγραμμα σπουδών της σχολής.") : skipToEnd("The student must be studying to obtain a first degree and must not have exceeded the duration of study in terms of the semesters required to obtain the degree, according to the school's curriculum.");
      } else if (currentQuestion === 2 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής πρέπει να διαμένει σε μισθωμένη οικία λόγω των σπουδών του, σε πόλη άλλη της κύριας κατοικίας του, στην οποία ο ίδιος ή οι γονείς του δεν έχουν πλήρη κυριότητα ή επικαρπία κατοικίας.") : skipToEnd("The student must reside in a rented residence due to his studies, in a city other than his main residence, in which he or his parents do not have full ownership or usufruct of the residence.");
      } else if (currentQuestion === 5 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Η μίσθωση της φοιτητικής οικείας πρέπει να είναι σε ισχύ τουλάχιστον για έξι μήνες.") : skipToEnd("The student housing lease must be in effect for at least six months.");
      } else if (currentQuestion === 6 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής πρέπει να έχει Ελληνική υπηκοότητα ή υπηκοότητα άλλης χώρας της Ευρωπαϊκής Ένωσης.") : skipToEnd("The student must have Greek citizenship or citizenship of another European Union country.");
      } else if (currentQuestion === 7 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής πρέπει να είναι κάτοχος ακαδημαϊκής ταυτότητας σε ισχύ. Μπορεί να γίνει αίτηση έκδοσης ακαδημαϊκής ταυτότητας και στη συνέχεια να γίνει η αίτηση για το επίδομα στέγασης φοιτητών.") : skipToEnd("The student must hold a valid academic ID. An application for an academic ID can be submitted first, and then the application for the student housing allowance can be made.");
      } else if (currentQuestion === 8 && selectedRadioButtonIndex === 1) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής ή οι γονείς του φοιτητή δεν πρέπει να είναι κύριοι ή επικαρπωτές κατοικιών (ιδιοχρησιμοποιημένων ή εκμισθωμένων) που υπαρβαίνουν τα διακόσια (200)τ.μ. αθροιστικά, εκτός αν βρίσκονται σε δήμο ή κοινότητα με πληθυσμό λιγότερο των 3.000 κατοίκων") : skipToEnd("The student or the student's parents must not be the owners or usufructuary of residences (self-occupied or rented) exceeding two hundred (200) square meters in total, unless they are located in a municipality or community with a population of less than 3,000 inhabitants.");
      } else if (currentQuestion === 9 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο φοιτητής πρέπει να έχει εξεταστεί επιτυχώς κατ' ελάχιστον στα μισά μαθήματα του προηγούμενου ακαδημαϊκού έτους.") : skipToEnd("The student must have successfully passed at least half of the courses of the previous academic year.");
      } else if (currentQuestion === 10 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Ο γονέας που βαρύνει ο φοιτητής, ή ο φοιτητής σε περίπτωση που δεν θεωρείται εξαρτώμενο τέκνο, πρέπει να έχει υποβάλει φορολογική δήλωση για το έτος που υποβάλλεται η αίτηση στεγαστικού επιδόματος.") : skipToEnd("The student or the student's parents must not be the owners or usufructuary of residences (self-occupied or rented) exceeding two hundred (200) square meters in total, unless they are located in a municipality or community with a population of less than 3,000 inhabitants.");
      } else if (currentQuestion === 11 && selectedRadioButtonIndex === 2) {
        currentQuestion = -1;
        currentLanguage === "greek" ? skipToEnd("Το οικογενειακό εισόδημα (προσαυξανόμενο κατά 3.000€ ευρώ για κάθε εξαρτώμενο τέκνο πέραν του ενός), ή το ατομικό εισόδημα αν ο φοιτητής δεν θεωρείται εξαρτώμενο τέκνο πρέπει να είναι μικρότερο των 30.000€.") : skipToEnd("The family income (increased by €3,000 for each dependent child beyond one), or the individual income if the student is not considered a dependent child, must be less than €30,000.");
      }
       else {
        //save selectedRadioButtonIndex to the storage
        userAnswers[currentQuestion] = selectedRadioButtonIndex;
        sessionStorage.setItem(
          "answer_" + currentQuestion,
          selectedRadioButtonIndex
        ); // save answer to session storage

        //if the questions are finished then...
        if (currentQuestion + 1 == totalQuestions) {
          submitForm();
        }
        // otherwise...
        else {
          currentQuestion++;
          loadQuestion(currentQuestion, true);

          if (currentQuestion + 1 == totalQuestions) {
            currentLanguage === "greek"
              ? $(this).text("Υποβολή")
              : $(this).text("Submit");
          }
        }
      }
    } else {
      loadQuestion(currentQuestion, false);
    }
  });

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(currentQuestion, true);

      // Retrieve the answer for the previous question from userAnswers
      var answer = userAnswers[currentQuestion];
      if (answer) {
        $('input[name="question-option"][value="' + answer + '"]').prop(
          "checked",
          true
        );
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    // if is false only when the user is skipedToEnd and trying change the language
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1)
      loadQuestion(currentQuestion, true);
  });

  $("#questions-btns").hide();

  // Get all questions
  getQuestions().then(() => {
    // Get all evidences
    getEvidences().then(() => {
      // Get all faqs 
      getFaq().then(() => {
        // Code inside this block executes only after all data is fetched
        // load  faqs and the first question on page load
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestion, true);
      });
    });
  });
});
