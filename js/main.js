const { createApp, ref, onMounted } = Vue;
createApp({
  setup() {

    const itemName = ref('');
    const itemQuantity = ref(1);
    const totalQuantity = ref(0);
    const shoppingList = ref([]);
    const savedLists = ref({});

    // Get saved lists on mount.
    onMounted(() => {
      const saved = localStorage.getItem('savedLists');
      if (saved) {
        savedLists.value = JSON.parse(saved);
      }
    });

    // Add item.
    function addItem() {
      if (!itemName.value || itemQuantity.value < 1) return;
      shoppingList.value.push({ name: itemName.value, quantity: itemQuantity.value });
      totalQuantity.value += itemQuantity.value;
      itemName.value = '';
      itemQuantity.value = 1;
    }

    // Remove item.
    function removeItem(index) {
      totalQuantity.value -= shoppingList.value[index].quantity;
      shoppingList.value.splice(index, 1);
    }

    // Clear current shopping list.
    function clearList() {
      if (confirm("Clear current shopping list?")) {
        shoppingList.value = [];
        totalQuantity.value = 0;
      }
    }

    // Save shopping list.
    function saveShoppinglist() {
      if (shoppingList.value.length === 0) return;
      const timestamp = new Date().toISOString();
      savedLists.value[timestamp] = [...shoppingList.value];
      localStorage.setItem('savedLists', JSON.stringify(savedLists.value));
      shoppingList.value = [];
      totalQuantity.value = 0;
    }

    // Load shopping list.
    function loadList(key) {
      const list = savedLists.value[key];
      if (list) {
        shoppingList.value = [...list];
        totalQuantity.value = list.reduce((sum, item) => sum + item.quantity, 0);
      }
    }

    // Delete shopping list.
    function deleteList(key) {
      if (confirm("Delete this saved list?")) {
        delete savedLists.value[key];
        localStorage.setItem('savedLists', JSON.stringify(savedLists.value));
      }
    }

    // Date formatting.
    function formatDate(iso) {
      const date = new Date(iso);
      return date.toLocaleString('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Email shopping list example.
    function emailItem(list) {
      const recipient = "someone@gmail.com";
      const subject = encodeURIComponent("My Shopping List");
      const bodyLines = list.map(item => `- ${item.quantity} x ${item.name}`);
      const body = encodeURIComponent("Here's my shopping list:\n\n" + bodyLines.join('\n'));

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }

    return {
      itemName, itemQuantity, totalQuantity, shoppingList,
      addItem, removeItem, clearList, saveShoppinglist,
      savedLists, loadList, deleteList, formatDate, emailItem
    };
  }
}).mount('#app');