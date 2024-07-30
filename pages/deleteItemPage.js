import { fetchData, sendData } from '../server-request.js';

function createSelectOptions(items) {
  return items.map(item => `<option value="${item.id}">${item.namn}</option>`).join('');
}

export default async function deleteItemPage() {
  try {
    // Fetch the current menu data
    const menuData = await fetchData();

    // Extract categories from menu data
    const categories = Object.keys(menuData.menu);

    const deleteItemPageContent = `
        <div id="deleteItemPage">
            <h2>Ta Bort</h2>
            <form id="deleteItemForm">
                <label for="kategori">Kategori:</label>
                <select id="kategori" name="kategori">
                    <option value="" disabled selected>Välj Kategori</option>
                    ${categories.map(kategori => `<option value="${kategori}">${kategori}</option>`).join('')}
                </select><br><br>
                <label for="item">Item:</label>
                <select id="item" name="item">
                    <option value="" disabled selected>Välj Kategori</option>
                </select><br><br>
                <button type="submit">Ta Bort</button>
            </form>
        </div>
    `;

    // Render the delete item page content
    $('main').html(deleteItemPageContent);

    // Add event listener for category selection
    $('#kategori').on('change', function () {
      const selectedCategory = $(this).val();
      const items = menuData.menu[selectedCategory];
      const selectOptions = createSelectOptions(items);
      $('#item').html(selectOptions);
    });

    // Add event listener for form submission
    $('#deleteItemForm').on('submit', async function (event) {
      event.preventDefault();

      // Extract selected category and item ID
      const kategori = $('#kategori').val();
      const itemId = $('#item').val();

      try {
        // Find the selected item in the menu data
        const selectedItemIndex = menuData.menu[kategori].findIndex(item => item.id == itemId);

        if (selectedItemIndex !== -1) {
          menuData.menu[kategori].splice(selectedItemIndex, 1);
          await sendData(menuData);

          // Redirect to the admin page or another appropriate page
          window.location.href = '#admin';
        } else {
          alert('Item not found');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again later.');
      }
    });
  } catch (error) {
    console.error('Error fetching menu data:', error);
    alert('Error fetching menu data. Please try again later.');
  }
}
