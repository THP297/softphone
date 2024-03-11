// -------------------------------------------Settings Phone dropdown

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
