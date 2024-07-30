import { fetchData, sendData } from '../server-request.js';

function createSelectOptions(items) {
  const selectOption = '<option value="" disabled selected>Select Item</option>';
  const itemOptions = items.map(item => `<option value="${item.id}">${item.namn}</option>`).join('');
  return selectOption + itemOptions;
}

export default async function editItemPage() {
  try {
    // Fetch the current menu data
    const menuData = await fetchData();

    // Extract categories from menu data
    const categories = Object.keys(menuData.menu);

    // Create HTML content for edit item page
    const editItemPageContent = `
        <div id="editItemPage">
            <h2>Redigera</h2>
            <form id="editItemForm">
                <label for="kategori">Kategori:</label>
                <select id="kategori" name="Kategori">
                    <option value="" disabled selected>Välj Kategori</option>
                    ${categories.map(kategori => `<option value="${kategori}">${kategori}</option>`).join('')}
                </select><br><br>
                <label for="item">Item:</label>
                <select id="item" name="item">
                    ${createSelectOptions([])}
                </select><br><br>
                <label for="namn">Namn:</label>
                <input type="text" id="namn" name="namn" required><br><br>
                <label for="beskrivning">Beskrivning:</label><br>
                <textarea id="beskrivning" name="beskrivning" rows="4" cols="50" required></textarea><br><br>
                <label for="pris">Pris (SEK):</label>
                <input type="number" id="pris" name="pris" min="0" required><br><br>
                <label for="soldOut">Sold Out:</label>
                <input type="checkbox" id="soldOut" name="soldOut"><br><br>
                <button type="submit">Redigera</button>
            </form>
        </div>
    `;

    // Render the edit item page content
    $('main').html(editItemPageContent);

    // Add event listener for category selection
    $('#kategori').on('change', function () {
      const selectedCategory = $(this).val();
      const items = menuData.menu[selectedCategory] || [];
      const selectOptions = createSelectOptions(items);
      $('#item').html(selectOptions);
    });

    // Add event listener for item selection
    $('#item').on('change', function () {
      const selectedCategory = $('#kategori').val();
      const selectedItemId = $(this).val();
      const selectedItem = menuData.menu[selectedCategory].find(item => item.id == selectedItemId);
      
      if (selectedItem) {
        $('#namn').val(selectedItem.namn);
        $('#beskrivning').val(selectedItem.beskrivning);
        $('#pris').val(selectedItem.pris);
        $('#soldOut').prop('checked', selectedItem.sold_out);
      }
    });

    // Add event listener for form submission
    $('#editItemForm').on('submit', async function (event) {
      event.preventDefault();

      const kategori = $('#kategori').val();
      const itemId = $('#item').val();

      try {
        const selectedItemIndex = menuData.menu[kategori].findIndex(item => item.id == itemId);

        if (selectedItemIndex !== -1) {
          // Update item details
          menuData.menu[kategori][selectedItemIndex].namn = $('#namn').val();
          menuData.menu[kategori][selectedItemIndex].beskrivning = $('#beskrivning').val();
          menuData.menu[kategori][selectedItemIndex].pris = parseFloat($('#pris').val());
          menuData.menu[kategori][selectedItemIndex].sold_out = $('#soldOut').prop('checked');

          // Send updated data
          await sendData(menuData);

          // Redirect to admin page
          window.location.href = '#admin';
        } else {
          alert('Item not found');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item. Please try again later.');
      }
    });

    // Trigger change event on page load to initialize items dropdown
    $('#kategori').trigger('change');
  } catch (error) {
    console.error('Error fetching menu data:', error);
    alert('Error fetching menu data. Please try again later.');
  }
}
