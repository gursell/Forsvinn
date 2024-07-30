import { fetchData, sendData } from '../server-request.js';

function generateItemId(menuData) {
  // Extract the menu items from the menuData
  const items = Object.values(menuData.menu).flat();
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
}

export default async function addItemPage() {
  const addItemPageContent = `
        <div id="addItemPage">
            <h2>Add New Item</h2>
            <form id="addItemForm">
                <label for="kategori">Kategori:</label>
                <select id="kategori" name="kategori">
                    <option value="" disabled selected>Välj kategori</option>
                    <option value="huvudrätter">Huvudrätter</option>
                    <option value="förrätter">Förrätter</option>
                    <option value="desserter">Desserter</option>
                    <option value="drycker">Drycker</option>
                </select><br><br>
                <label for="namn">Namn:</label>
                <input type="text" id="namn" name="namn" required><br><br>
                <label for="beskrivning">Beskrivning:</label><br>
                <textarea id="beskrivning" name="beskrivning" rows="4" cols="50" required></textarea><br><br>
                <label for="pris">Pris (SEK):</label>
                <input type="number" id="pris" name="pris" min="0" required><br><br>
                <button type="submit">Lägg till</button>
            </form>
        </div>
    `;

  // Render the add item page content
  $('main').html(addItemPageContent);

  $('#addItemForm').on('submit', async function (event) {
    event.preventDefault();

    // Extract the form data
    const kategori = $('#kategori').val();
    const namn = $('#namn').val();
    const beskrivning = $('#beskrivning').val();
    const pris = $('#pris').val();

    try {
      // Fetch the current menu data
      let menuData = await fetchData();

      // Generate a new ID for the item
      const id = generateItemId(menuData);

      // Create a new item object with the generated ID
      const newItem = {
        id: id,
        namn: namn,
        beskrivning: beskrivning,
        pris: parseInt(pris),
        sold_out: false
      };

      // Add the new item to the selected category in the menu
      menuData.menu[kategori].push(newItem);

      // Send the updated menu data to the server
      await sendData(menuData);

      // Redirect to the admin page or another appropriate page
      window.location.href = '#admin';
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again later.');
    }
  });
}
