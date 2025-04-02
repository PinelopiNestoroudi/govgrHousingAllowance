var languageContent = {
    greek: {
      languageBtn: "EL",
      mainTitle: "Στεγαστικό επίδομα σε φοιτητές",
      pageTitle: "Στεγαστικό επίδομα σε φοιτητές",
      infoTitle: "Πληροφορίες για τη χορήγηση Στεγαστικού επιδόματος σε φοιτητές",
      subTitle1: "Αυτό το ερωτηματολόγιο μπορεί να σας βοηθήσει να βρείτε αν δικαιούστε να λάβετε το στεγαστικό επίδομα φοιτητών.",
      subTitle2: "H συμπλήρωση του ερωτηματολογίου δεν απαιτεί παραπάνω από 10 λεπτά.",
      subTitle3: "Δεν θα αποθηκεύσουμε ούτε θα μοιραστούμε τις απαντήσεις σας.",
      backButton: "Πίσω",
      nextQuestion: "Επόμενη ερώτηση",
      biggerCursor: "Μεγαλύτερος Δρομέας",
      bigFontSize: "Μεγάλο Κείμενο",
      readAloud: "Ανάγνωση",
      changeContrast: "Αντίθεση",
      readingMask: "Μάσκα Ανάγνωσης",
      footerText: "Υλοποίηση εργασίας εξαμήνου από την φοιτήτρια Μεταπτυχιακού τμήματος Εφαρμοσμένης Πληροφορικής ΠΑΜΑΚ, Νεστωρούδη Πηνελόπη. Το προτότυπο έργο δημιουργήθηκε για τις ανάγκες της πτυχιακής εργασίας κατά τη διάρκεια των προπτυχιακών σπουδών στο Πανεπιστήμιο Μακεδονίας του τμήματος Εφαρμοσμένης Πληροφορικής από τις φοιτήτριες:",
      and: "και",
      student1: "Αμπατζίδου Ελισάβετ",
      student2: "Δασύρα Ευμορφία Ελπίδα",
      startBtn:"Ας ξεκινήσουμε",
      chooseAnswer: "Επιλέξτε την απάντησή σας",
      oneAnswer: "Μπορείτε να επιλέξετε μόνο μία επιλογή.",
      errorAn: "Λάθος:",
      choose: "Πρέπει να επιλέξετε μια απάντηση",
    },
    english: {
      languageBtn: "EN",
      mainTitle: "Housing allowance for university students",
      pageTitle: "Housing allowance for university students",
      infoTitle: "Information on the issue of Housing allowance for university students",
      subTitle1: "This questionnaire can help you determine if you are eligible to receive the Housing allowance for university students.",
      subTitle2: "Completing the questionnaire should not take more than 10 minutes.",
      subTitle3: "We will neither store nor share your answers.",
      backButton: "Βack",
      nextQuestion: "Next Question",
      biggerCursor: "Bigger Cursor",
      bigFontSize:" Big Font Size",
      readAloud: "Read Aloud",
      changeContrast:" Change Contrast",
      readingMask:" Reading Mask",
      footerText: "Implementation of a semester project by the postgraduate student of the Applied Informatics department UOM, Pinelopi Nestoroudi. The original project was created for the needs of the bachelor thesis during the undergraduate studies at the University of Macedonia, Department of Applied Informatics, by the students:",
      and: "and",
      student1: "Ampatzidou Elisavet",
      student2: "Dasyra Evmorfia Elpida",
      startBtn:"Let's start",
      chooseAnswer: "Choose your answer",
      oneAnswer: "You can choose only one option.",
      errorAn: "Error:",
      choose: "You must choose one option",
    }
};
  
// Retrieve the selected language from localStorage or set default to "greek"
var currentLanguage = localStorage.getItem("preferredLanguage") || "greek";

function toggleLanguage() {
    currentLanguage = currentLanguage === "greek" ? "english" : "greek";
    localStorage.setItem("preferredLanguage", currentLanguage);
    updateContent();
}

function updateContent() {
    var components = document.querySelectorAll(".language-component");
     
    components.forEach(function (component) {
        var componentName = component.dataset.component;
        component.textContent = languageContent[currentLanguage][componentName];
    });
}

// Initialize the content based on the selected language
updateContent();