// Function to apply page change effect
function applyPageChangeEffect() {
  // function getCurrentFileName() {
  //   let path = window.location.pathname;
  //   let filename = path.split("/").pop().split(".")[0];
  //   return filename;
  // }

  // const htmlFile = getCurrentFileName();
  // const currentLink = document.querySelector(`#${htmlFile}-page`);

  // if (currentLink) {
  //   currentLink.style.backgroundColor = "rgb(255, 255, 255)";
  //   currentLink.style.borderTopLeftRadius = "8px";
  //   currentLink.style.borderTopRightRadius = "8px";

  //   const svgElement = currentLink.querySelector("svg");

  //   if (svgElement) {
  //     // Apply styles to the SVG element
  //     svgElement.style.fill = "rgb(74, 74, 74)";
  //   }
  // }

  // Function to load HTML content from file and replace current body content
  function loadHTMLContent(filePath) {
    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // Set the callback function to handle the response
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          document.open();
          document.write(xhr.responseText);
          document.close();
          // Apply page change effect again after loading new content
          applyPageChangeEffect();
        } else {
          console.error("Failed to load HTML content: " + xhr.status);
        }
      }
    };

    // Open the file using GET request
    xhr.open("GET", filePath, true);

    // Send the request
    xhr.send();
  }

  const pageButtons = document.querySelectorAll("#nav-right button");
  console.log(pageButtons);
  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const htmlFile = this.id.split("-")[0];
      console.log(htmlFile);
      loadHTMLContent(`${htmlFile}.html`);
    });
  });
}

// Call the function initially to apply the effect
applyPageChangeEffect();
