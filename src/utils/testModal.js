// Test function untuk modal
export const testModal = () => {
  console.log('Testing modal functionality...');
  
  // Simulasi klik tombol tambah
  const addButton = document.querySelector('.add-button');
  if (addButton) {
    console.log('Add button found, clicking...');
    addButton.click();
  } else {
    console.log('Add button not found');
  }
  
  // Cek apakah modal muncul
  setTimeout(() => {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      console.log('Modal found and visible');
      console.log('Modal styles:', window.getComputedStyle(modal));
    } else {
      console.log('Modal not found');
    }
  }, 100);
};

// Export untuk browser console
if (typeof window !== 'undefined') {
  window.testModal = testModal;
}
