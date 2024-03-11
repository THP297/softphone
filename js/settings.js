// -------------------------------------------Settings Phone dropdown

// show and hide phone form
var phoneForm = document.querySelector("#phone-form");
var softPhoneBtn = document.querySelector("#phoneTypeSoftphone");
var deskPhoneBtn = document.querySelector("#phoneTypeDeskphone");

softPhoneBtn.addEventListener("click", function () {
  phoneForm.style.display = "none";
});
deskPhoneBtn.addEventListener("click", function () {
  phoneForm.style.display = "block";
});

// dropdown country code options
var dropdownContent = document.querySelector("#dropdown-options");
var phoneInput = document.querySelector("#phone-input input");

function displayDropdown() {
  dropdownContent.style.display = "block";
}

// tiktok border when clicked
var dropdownBtn = document.getElementById("dropdown-btn");
dropdownBtn.style.borderColor = "white";
dropdownBtn.addEventListener("click", function () {
  displayDropdown();

  dropdownBtn.style.borderColor = "rgba(102,102,102,0.8)";
  dropdownBtn.style.borderWidth = "2px";

  setTimeout(function () {
    dropdownBtn.style.borderColor = "none";
    dropdownBtn.style.borderWidth = "0px";
  }, 100);
});

// add onclick event to each dropdown option
var dropdownOptions = document.querySelectorAll("#dropdown-options ul li");
dropdownOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const countryCode = this.querySelector(".country-code");
    dropdownContent.style.display = "none";
    phoneInput.value = countryCode.textContent;
    phoneInput.focus();

    console.log(countryCode.textContent);
  });
});

// -------------------------------------------Settings Language dropdown

var languageDropdownBtn = document.querySelector("#language-dropdown-btn");

var languageDropdownContent = document.querySelectorAll(
  ".language-dropdown-options ul li"
);
var languageDropDownOptions = document.querySelector(
  ".language-dropdown-options"
);

var currentLanguage = document.querySelector("#language");

languageDropdownBtn.addEventListener("click", function () {
  languageDropDownOptions.style.display = "block";
  languageDropdownContent.forEach((option) => {
    option.addEventListener("click", function () {
      console.log("clicked");
      const language = this.querySelector("div");
      currentLanguage.textContent = language.textContent;
      languageDropDownOptions.style.display = "none";
    });
  });

  // Corrected line:
  languageDropdownBtn.style.border = "none";
  languageDropdownBtn.style.border = "1px solid black";
  setTimeout(function () {
    languageDropdownBtn.style.border = "none";
    languageDropdownBtn.style.borderBottom = "1px solid black";
  }, 100);
});
