# Troubleshooting Modal Tindak Lanjut

## Masalah: Modal Tidak Muncul

### 1. Periksa Console Browser
Buka Developer Tools (F12) dan periksa console untuk error messages.

### 2. Test Modal Manual
Jalankan di browser console:
```javascript
// Import test function
import('./src/utils/testModal.js').then(module => {
  module.testModal();
});

// Atau test langsung
console.log('Testing modal...');
const addButton = document.querySelector('.add-button');
if (addButton) {
  addButton.click();
  console.log('Button clicked');
} else {
  console.log('Button not found');
}
```

### 3. Periksa State Management
Di console browser, jalankan:
```javascript
// Periksa state komponen
console.log('showAddModal:', window.showAddModal);
console.log('showEditModal:', window.showEditModal);
```

### 4. Periksa CSS Z-Index
Pastikan modal memiliki z-index yang cukup tinggi:
```css
.modal-overlay {
  z-index: 1000;
}
```

### 5. Periksa Import dan Export
Pastikan semua file ter-import dengan benar:
- `FollowUpModal.js` ter-import di `TindakLanjut.js`
- `FollowUpModal.css` ter-import di `FollowUpModal.js`

## Debugging Steps

### Step 1: Periksa Button Click
```javascript
// Di console browser
document.querySelector('.add-button').addEventListener('click', () => {
  console.log('Button clicked!');
});
```

### Step 2: Periksa State Changes
```javascript
// Tambahkan di TindakLanjut.js
useEffect(() => {
  console.log('Modal state changed:', { showAddModal, showEditModal });
}, [showAddModal, showEditModal]);
```

### Step 3: Periksa Modal Rendering
```javascript
// Di FollowUpModal.js
console.log('Modal rendering, isOpen:', isOpen);
```

## Common Issues

### 1. CSS Not Loading
**Gejala**: Modal muncul tapi tidak ter-styling
**Solusi**: Pastikan `FollowUpModal.css` ter-import

### 2. Z-Index Conflict
**Gejala**: Modal muncul di belakang elemen lain
**Solusi**: Tambahkan z-index yang lebih tinggi

### 3. State Not Updating
**Gejala**: Button diklik tapi modal tidak muncul
**Solusi**: Periksa event handler dan state management

### 4. Import Error
**Gejala**: Error di console tentang module not found
**Solusi**: Periksa path import dan file structure

## Quick Fixes

### Fix 1: Force Modal to Show
```javascript
// Di console browser
document.body.innerHTML += `
<div class="modal-overlay" style="display: flex; z-index: 9999;">
  <div class="modal-container">
    <h2>Test Modal</h2>
    <p>Modal is working!</p>
  </div>
</div>
`;
```

### Fix 2: Check CSS Classes
```javascript
// Di console browser
const modal = document.querySelector('.modal-overlay');
if (modal) {
  console.log('Modal classes:', modal.className);
  console.log('Modal styles:', window.getComputedStyle(modal));
}
```

### Fix 3: Test State Management
```javascript
// Di console browser
// Simulasi state change
window.dispatchEvent(new CustomEvent('testModal', { 
  detail: { showAddModal: true } 
}));
```

## Testing Checklist

- [ ] Button "Tambah Tindak Lanjut" ada dan bisa diklik
- [ ] Console tidak menampilkan error
- [ ] State `showAddModal` berubah menjadi `true`
- [ ] Modal overlay muncul dengan z-index yang benar
- [ ] Modal container ter-render dengan styling yang benar
- [ ] Form fields ter-render dengan benar
- [ ] Tombol close berfungsi
- [ ] Form submission berfungsi

## Environment Setup

### Required Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-icons": "^4.0.0"
}
```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

Jika masih mengalami masalah:
1. Periksa browser console untuk error
2. Test di browser yang berbeda
3. Periksa network tab untuk failed requests
4. Pastikan semua dependencies ter-install
5. Restart development server
