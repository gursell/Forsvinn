import { fetchData } from './server-request.js';

export async function displayMenu() {
  try {
    // Fetch menu data from the server
    const menuData = await fetchData();
    $("#app").empty(); // Clear any existing content

    // Check if menuData and menuData.meny are available
    if (!menuData || !menuData.menu) {
      $("#app").append("<p>No menu items available.</p>");
      return;
    }

    const menu = menuData.menu;

    // Iterate over categories in the menu data
    Object.keys(menu).forEach(kategori => {
      const categoryItems = menu[kategori];
      $("#app").append(`<h2>${kategori}</h2>`);

      // Check if categoryItems is an array
      if (Array.isArray(categoryItems)) {
        // Iterate over items in the category
        categoryItems.forEach(item => {
          const soldOutLabel = item.sold_out ? '<span class="sold-out-label">Sold Out</span>' : '';
          const itemHtml = `
            <div class="menu-item">
              <h3>${item.namn}</h3>
              <p>${item.beskrivning}</p>
              <p>Price: ${item.pris} SEK</p>
              ${soldOutLabel}
            </div>
          `;
          $("#app").append(itemHtml);
        });
      } else {
        console.error(`Error: ${kategori} items are not an array.`);
      }
    });
  } catch (error) {
    console.error('Error fetching and displaying menu data:', error);
    $("#app").append("<p>Error loading menu. Please try again later.</p>");
  }
}

$(function () {
  displayMenu(); // Call displayMenu when the document is ready
});
