const input = document.querySelector('.text');
const addButton = document.querySelector('.button');

// Зчитування збереженого списку продуктів з localStorage
let productList = JSON.parse(localStorage.getItem('productList')) || [];

// Функція для додавання нового продукту
function addProduct() {
  const productName = productNameInput.value;
  const newProduct = {
    name: productName,
    amount: 1,
    bought: false
  };
  productList.push(newProduct);
  saveProductList();
  renderProductList();
  productNameInput.value = '';
}

// Функція для збереження списку продуктів в localStorage
function saveProductList() {
  localStorage.setItem('productList', JSON.stringify(productList));
}

function renderProductList() {
  const productContainer = document.querySelector('.product');
  const productItem = document.createElement('section');
  productItem.classList.add('add-panel-one');

  const nameSection = document.createElement('section');
  nameSection.classList.add('name');
  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = products[productName].name;
  nameSection.appendChild(nameParagraph);

  const subtractButton = document.createElement('button');
  if(products[productName] === 1)
  subtractButton.classList.add('minus-amount-light');
  else subtractButton.classList.add('minus-amount');
  subtractButton.textContent = '-';
  subtractButton.addEventListener('click', () => {
    minusNumProduct(productName, subtractButton, amountPanel);
  });

  const numberSection = document.createElement('section');
  numberSection.classList.add('number');
  const amountPanel = document.createElement('section');
  amountPanel.classList.add('amount-main-panel');
  amountPanel.textContent = products[productName].amount;

  const addButton = document.createElement('button');
  addButton.classList.add('add-amount');
  addButton.textContent = '+';
  addButton.addEventListener('click', () => {
    addNumProduct(productName, subtractButton, amountPanel);
  });

  numberSection.appendChild(subtractButton);
  numberSection.appendChild(amountPanel);
  numberSection.appendChild(addButton)

  const boughtSection = document.createElement('section');
  boughtSection.classList.add('panel-bought');
  const boughtButton = document.createElement('button');
  boughtButton.classList.add('bought');
  boughtButton.setAttribute('data-tooltip', 'Купити');
  boughtButton.textContent = 'Куплено';

  const cancelButton = document.createElement('button');
  cancelButton.classList.add('cancel');
  cancelButton.setAttribute('data-tooltip', 'Відмінити');
  cancelButton.textContent = '×';

    boughtButton.addEventListener('click', () => {   
        bought(subtractButton, addButton, boughtButton, cancelButton);     
    });

    cancelButton.addEventListener('click', () => {
      const confirmed = confirm('Ви впевнені, що хочете видалити цей продукт?');
      if (confirmed) {
        productContainer.removeChild(productItem);
        delete products[productName];
        updateLocalStorage();
      }
    });
  boughtSection.appendChild(boughtButton);
  boughtSection.appendChild(cancelButton);

  productItem.appendChild(nameSection);
  productItem.appendChild(numberSection);
  productItem.appendChild(boughtSection);

  productContainer.appendChild(productItem);
}

function minusNumProduct(productName, subtractBtn, amountPnl) {
  if (products[productName] > 1) {
    subtractBtn.classList.remove('minus-amount-light'); 
    subtractBtn.classList.add('minus-amount');
    products[productName]--;
    amountPnl.textContent = products[productName];
    updateLocalStorage();
  }
  if (products[productName] === 1) {
    subtractBtn.classList.add('minus-amount-light');
  }
}

function addNumProduct(productName, subtractBtn, amountPnl) {
  products[productName]++;
  if (products[productName] > 1) {
    subtractBtn.classList.remove('minus-amount-light'); 
    subtractBtn.classList.add('minus-amount');}
  amountPnl.textContent = products[productName];
  updateLocalStorage();
  subtractBtn.classList.remove('minus-amount-light');
}

function bought(subtractBtn, addBtn, boughtBtn, cancelBtn) {
  subtractBtn.remove('minus-amount-light');
    addBtn.remove('add-amount');
    cancelBtn.remove('cancel');
    boughtBtn.setAttribute('id', 'unbought');
    boughtBtn.textContent = 'Куплено';
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem('products', JSON.stringify(products));
} 

addButton.addEventListener('click', addProduct);

input.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addProduct();
  }
});

populateProducts();
