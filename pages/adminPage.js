export default async function adminPage() {
    return `
    <div id="admin">
      <div id="adminButtons">
        <button id="addItem">Lägga till</button>
        <button id="editItem">Redigera</button>
        <button id="deleteItem">Ta Bort</button>
      </div>
      <div id="adminInfoContainer"></div>

      <script>
        $("#addItem").on("click", function () {
          window.location.href = "#addItemPage";
        });

        $("#editItem").on("click", function () {
          window.location.href = "#editItemPage";
        });

        $("#deleteItem").on("click", function () {
          window.location.href = "#deleteItemPage";
        });

      
      </script>
    </div>
  `;
}