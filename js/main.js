// Initialize an empty object to store the fetched JSON data
let data = {};

// Fetch JSON data from the specified file path
fetch('./js/data.json')
   .then(response => response.json())  // Convert the response to JSON
   .catch(err => console.log(err))     // Log any errors that occur during the fetch
   .then(json => data = json)          // Store the fetched JSON data in the 'data' object

// Select the tab list and all tabs within it
const tabsList = document.querySelector('[role="tablist"]'),
      tabs = tabsList.querySelectorAll('[role="tab"]');

// Add an event listener to the tab list for keydown events
tabsList.addEventListener('keydown', changeTabFocus);

// Add an event listener to each tab for click events
tabs.forEach(tab => tab.addEventListener('click', changeTabContent));

// Initialize a variable to keep track of the currently focused tab
let tabFocus = 0;

// Function to handle changing the focus between tabs using arrow keys
function changeTabFocus(e) {
   // Define key codes for the left and right arrow keys
   const keyLeftArrow = 37,
         keyRightArrow = 39;

   // Check if the key pressed is the left or right arrow key
   if (e.keyCode === keyLeftArrow || e.keyCode === keyRightArrow) {
      // Remove the tabindex attribute from the currently focused tab
      tabs[tabFocus].setAttribute('tabindex', -1);

      // If the right arrow key is pressed, move focus to the next tab
      if (e.keyCode === keyRightArrow) {
         tabFocus++;
         // If the focus goes beyond the last tab, wrap around to the first tab
         if (tabFocus >= tabs.length) {
            tabFocus = 0;
         }
      } else { // If the left arrow key is pressed, move focus to the previous tab
         tabFocus--;
         // If the focus goes before the first tab, wrap around to the last tab
         if (tabFocus < 0) {
            tabFocus = tabs.length - 1;
         }
      }
   
      // Set the tabindex attribute to 0 for the newly focused tab and move focus to it
      tabs[tabFocus].setAttribute('tabindex', 0);
      tabs[tabFocus].focus();
   }
}

// Function to handle changing the content when a tab is clicked
function changeTabContent(e) {
   // Helper function to capitalize the first letter of a string
   const firstLetterUpper = str => str.charAt(0).toUpperCase() + str.slice(1);

   // Get the clicked tab element and its aria-controls attribute
   const ele = e.target,
         eleName = ele.getAttribute('aria-controls'),
         // Get the previously active tab
         prevActive = ele.parentNode.querySelector('[aria-selected="true"]'),
         // Get the aria-label attribute of the parent element (the tab list)
         page = ele.parentNode.getAttribute('aria-label');

   // Filter the data for the current page to find the object matching the clicked tab's name or role
   const [objData] = data[page].filter(ele => ele.name === firstLetterUpper(eleName)),
         [objCrewData] = data[page].filter(ele => ele.role === firstLetterUpper(eleName));

   // Set aria-selected attribute to false for the previously active tab
   prevActive.setAttribute('aria-selected', false);
   // Set aria-selected attribute to true for the clicked tab
   ele.setAttribute('aria-selected', true);

   // Depending on the page, call the appropriate function to change the content
   switch (page) {
      case 'destinations':
         changeContent(objData, page);
         break;
      case 'crew':
         changeContent(objCrewData, page);
         break;
      default:
         changeTechnology(objData, page);
         break;
   }
}

// Function to change the content for destinations or crew pages
const changeContent = (data, page) => {
   // Define the IDs of the fields to be updated based on the page
   if (page === 'destinations') {
      idsFields = ['name', 'image', 'description', 'distance', 'travel'];
   } else {
      idsFields = ['name', 'image', 'role', 'bio'];
   }

   // Update each field with the corresponding data
   idsFields.forEach(idField => {
      const eleId = document.getElementById(idField);
      if (idField === 'image') {
         eleId.src = data[idField]; // Update the image source
         eleId.setAttribute('alt', `${data.name} - ${page}`); // Update the alt text
      } else {
         eleId.textContent = data[idField]; // Update the text content
      }
   });
}

// Function to change the content for the technology page
const changeTechnology = (data, page) => {
   // Define the IDs of the fields to be updated
   idsFields = ['name', 'portrait', 'landscape', 'description'];

   // Update each field with the corresponding data
   idsFields.forEach(idField => {
      const eleId = document.getElementById(idField);
      if (idField === 'portrait') {
         eleId.srcset = data.images[idField]; // Update the portrait image source set
      } else if (idField === 'landscape') {
         eleId.src = data.images[idField]; // Update the landscape image source
         eleId.setAttribute('alt', `${data.name} - ${page}`); // Update the alt text
      } else {
         eleId.textContent = data[idField]; // Update the text content
      }
   });
}
