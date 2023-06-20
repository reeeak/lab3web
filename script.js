const addButton = document.querySelector('.button');
const productNameInput = document.querySelector('.text');
const addPanel = document.querySelector('.add-panel');
const addPanelOneContainer = document.querySelector('.add-panel-one-container');
const largeProductList = document.querySelector('.large-product');
const smallProductList = document.querySelector('.add-panel-small-noBought');
const smallProductListBought = document.querySelector('.add-panel-small-bought');

const initialProductList = [
  { name: "Помідори", amount: 2, bought: true },
  { name: "Печиво", amount: 2, bought: false },
  { name: "Сир", amount: 1, bought: false }
];

let productList = JSON.parse(localStorage.getItem('productList'));


if (productList.length === 0) {
  productList = initialProductList;
  saveProductList(); 
}

function addProduct() {
  const productName = productNameInput.value.trim();
  if (productName === '') {
    alert('Введіть назву!');
    return;
  }

  const existingProduct = productList.find(product => product.name.toLowerCase() === productName.toLowerCase());
  if (existingProduct) {
    alert('Такий продукт уже існує!');
    productNameInput.value = '';
    return;
  }
  
  const newProduct = {
    name: productName,
    amount: 1,
    bought: false
  };
  productList.push(newProduct);
  saveProductList();
  renderProductList();
  productNameInput.value = '';
  productNameInput.focus(); 
}

function saveProductList() {
  localStorage.setItem('productList', JSON.stringify(productList));
}

  
 
  function createProductNameClickHandler(index) {
    return function () {
      const nameElement = document.querySelector(`#product-name-${index}`);
      const currentName = nameElement.textContent;
    
      const inputElement = document.createElement('input');
      inputElement.value = currentName;
    
      inputElement.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          const newName = inputElement.value.trim();
          const existingProduct = productList.find(product => product.name.toLowerCase() === newName.toLowerCase());
          if (newName !== '' && !existingProduct) {
            productList[index].name = newName;
          } else {
            alert('Назва продукту або порожня, або вже наявна!');
            nameElement.textContent = currentName;
          }
          saveProductList();
          renderProductList();
        }
      });
    
      nameElement.textContent = '';
      nameElement.appendChild(inputElement);
      inputElement.focus();
      inputElement.addEventListener('blur', function () {
        nameElement.textContent = currentName;
      });
    };
  }
  


function renderProductList() {
  addPanelOneContainer.innerHTML = '';
  smallProductList.innerHTML = '';
  smallProductListBought.innerHTML = '';

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];
    const addPanelOne = document.createElement('section');
    addPanelOne.classList.add('add-panel-one');

    const nameSection = document.createElement('section');
    nameSection.classList.add('name');

    const productName = document.createElement('p');
    productName.textContent = product.name;
    productName.id = `product-name-${i}`; 
    if (product.bought) {
      productName.style.textDecoration = 'line-through';
    }
    else{
      productName.addEventListener('click', createProductNameClickHandler(i));
    }
    nameSection.appendChild(productName);
    addPanelOne.appendChild(nameSection);

    const numberSection = document.createElement('section');
    numberSection.classList.add('number');

    const minusButton = document.createElement('button');
    minusButton.classList.add('minus-amount');
    minusButton.textContent = '-';
    if (product.amount === 1) {
      minusButton.classList.add('minus-amount-light');
      minusButton.disabled = true;
    } else {
      minusButton.dataset.tooltip = "Зменшити";
      minusButton.addEventListener('click', createMinusButtonHandler(i));
    }
    minusButton.style.display = product.bought ? 'none' : 'inline-block'; 
    numberSection.appendChild(minusButton);

    const amountMainPanel = document.createElement('section');
    amountMainPanel.classList.add('amount-main-panel');
    amountMainPanel.textContent = product.amount;
    numberSection.appendChild(amountMainPanel);

    const addButton = document.createElement('button');
    addButton.classList.add('add-amount');
    addButton.textContent = '+';
    addButton.addEventListener('click', createAddButtonHandler(i));
    addButton.dataset.tooltip = "Збільшити";
    addButton.style.display = product.bought ? 'none' : 'inline-block'; 
    numberSection.appendChild(addButton);

    addPanelOne.appendChild(numberSection);

    const panelBoughtSection = document.createElement('section');
    panelBoughtSection.classList.add('panel-bought');

    const boughtButton = document.createElement('button');
    boughtButton.classList.add('bought');
    boughtButton.dataset.tooltip = 'Купити';
    boughtButton.textContent = product.bought ? 'Не куплено' : 'Куплено';
    boughtButton.addEventListener('click', product.bought ? createNotBoughtButtonHandler(i) : createBoughtButtonHandler(i));
    panelBoughtSection.appendChild(boughtButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel');
    cancelButton.dataset.tooltip = 'Видалити';
    cancelButton.textContent = '×';
    cancelButton.addEventListener('click', createCancelButtonHandler(i));
    cancelButton.style.display = product.bought ? 'none' : 'inline-block'; 
    panelBoughtSection.appendChild(cancelButton);
    addPanelOne.appendChild(panelBoughtSection);
    addPanelOneContainer.appendChild(addPanelOne);


    const productItem = document.createElement('span');
    productItem.classList.add('product-item');
    const productNamew = document.createElement('span');
    productNamew.textContent = product.name;
    const productAmount = document.createElement('span');
    productAmount.classList.add('amount');
    productAmount.textContent = product.amount;
    productItem.appendChild(productNamew);
    productItem.appendChild(productAmount);
    if (product.bought) {
      productNamew.style.textDecoration = 'line-through';
      productAmount.style.textDecoration = 'line-through';
      smallProductListBought.appendChild(productItem);
    }
    else{smallProductList.appendChild(productItem);}

  }
}


function createCancelButtonHandler(index) {
  return function() {
    productList.splice(index, 1);
    saveProductList();
    renderProductList();
  };
}

function createAddButtonHandler(index) {
    return function() {
      productList[index].amount++;
      saveProductList();
      renderProductList();
    };
  }

  function createMinusButtonHandler(index) {
    return function() {
      productList[index].amount--;
      saveProductList();
      renderProductList();
    };
  }

 
function createBoughtButtonHandler(index) {
    return function() {
      productList[index].bought = true;
      saveProductList();
      renderProductList();
    };
  }
  
  
  function createNotBoughtButtonHandler(index) {
    return function() {
      productList[index].bought = false;
      saveProductList();
      renderProductList();
    };
  }

addButton.addEventListener('click', addProduct);
productNameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addProduct();
  }
});


renderProductList();