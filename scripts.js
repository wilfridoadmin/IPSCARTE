// Datos de usuarios simulados
const users = [
    { username: 'admin', password: '221099', role: 'admin' },
    { username: 'michell', password: '2210', role: 'michell' }
];

// Función de login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        showDashboard();
    } else {
        document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
    }
});

// Mostrar dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    loadProductos();
    loadCobros();
}

// Cerrar sesión
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('user');
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

// Mostrar sección de productos
document.getElementById('productosBtn')?.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
        document.getElementById('productosContent').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
    }
});

// Mostrar sección de dashboard
document.getElementById('dashboardBtn')?.addEventListener('click', function() {
    document.getElementById('productosContent').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
});

// Agregar producto al listado
document.getElementById('productoForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreProducto = document.getElementById('nombreProducto').value;
    const valorProducto = parseFloat(document.getElementById('valorProducto').value);

    if (isNaN(valorProducto)) {
        alert('El valor debe ser un número válido');
        return;
    }

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.push({ nombreProducto, valorProducto });
    localStorage.setItem('productos', JSON.stringify(productos));
    document.getElementById('productoForm').reset();
    loadProductos();
});

// Cargar productos
function loadProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const productoSelect = document.getElementById('productoSelect');
    const productoList = document.getElementById('productoList');

    productoSelect.innerHTML = '';
    productoList.innerHTML = '';

    productos.forEach((producto, index) => {
        if (producto && producto.nombreProducto && producto.valorProducto != null) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${producto.nombreProducto} - $${producto.valorProducto.toFixed(2)}`;
            productoSelect.appendChild(option);

            const li = document.createElement('li');
            li.textContent = `${producto.nombreProducto} - $${producto.valorProducto.toFixed(2)}`;
            productoList.appendChild(li);
        }
    });
}

// Agregar productos al cobro
document.getElementById('addProduct')?.addEventListener('click', function() {
    const productoSelect = document.getElementById('productoSelect');
    const selectedOptions = Array.from(productoSelect.selectedOptions);
    const productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    let total = 0;

    selectedOptions.forEach(option => {
        const index = parseInt(option.value);
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const producto = productos[index];
        if (producto) {
            productosSeleccionados.push(producto);
            total += producto.valorProducto;
        }
    });

    localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
    updateProductList();
    updateTotal();
});

// Actualizar lista de productos seleccionados
function updateProductList() {
    const productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    const productosList = document.getElementById('productosList');
    productosList.innerHTML = '';

    productosSeleccionados.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombreProducto} - $${producto.valorProducto.toFixed(2)}`;
        
        // Botón para eliminar producto
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.addEventListener('click', function() {
            removeProduct(index);
        });

        li.appendChild(removeButton);
        productosList.appendChild(li);
    });
}

// Eliminar producto de la lista
function removeProduct(index) {
    let productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    productosSeleccionados.splice(index, 1);
    localStorage.setItem('productosSeleccionados', JSON.stringify(productosSeleccionados));
    updateProductList();
    updateTotal();
}

// Actualizar total
function updateTotal() {
    const productosSeleccionados = JSON.parse(localStorage.getItem('productosSeleccionados')) || [];
    const total = productosSeleccionados.reduce((sum, producto) => sum + producto.valorProducto, 0);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Generar cobro
document.getElementById('cobroForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const edad = document.getElementById('edad').value;
    const observaciones = document.getElementById('observaciones').value;
    const total = parseFloat(document.getElementById('total').textContent);

    if (isNaN(total)) {
        alert('El total debe ser un número válido');
        return;
    }

    const cobro = { nombreCompleto, edad, observaciones, total };
    let cobros = JSON.parse(localStorage.getItem('cobros')) || [];
    cobros.push(cobro);
    localStorage.setItem('cobros', JSON.stringify(cobros));

    document.getElementById('cobroForm').reset();
    localStorage.removeItem('productosSeleccionados');
    updateProductList();
    updateTotal();
    loadCobros();
});

// Vaciar formulario
document.getElementById('clearForm')?.addEventListener('click', function() {
    document.getElementById('cobroForm').reset();
    localStorage.removeItem('productosSeleccionados');
    updateProductList();
    updateTotal();
});

// Cargar cobros en la tabla
function loadCobros() {
    const cobros = JSON.parse(localStorage.getItem('cobros')) || [];
    const cobrosList = document.getElementById('cobrosList');
    cobrosList.innerHTML = '';

    cobros.forEach((cobro, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cobro.nombreCompleto}</td>
            <td>${cobro.edad}</td>
            <td>${cobro.observaciones}</td>
            <td>$${cobro.total.toFixed(2)}</td>
            <td>
                <button onclick="editCobro(${index})">Editar</button>
                <button onclick="deleteCobro(${index})">Eliminar</button>
                <button onclick="printCobro(${index})">Imprimir</button>
            </td>
        `;
        cobrosList.appendChild(tr);
    });
}

// Editar cobro
function editCobro(index) {
    const cobros = JSON.parse(localStorage.getItem('cobros')) || [];
    const cobro = cobros[index];

    document.getElementById('nombreCompleto').value = cobro.nombreCompleto;
    document.getElementById('edad').value = cobro.edad;
    document.getElementById('observaciones').value = cobro.observaciones;
    localStorage.setItem('editIndex', index);
}

// Eliminar cobro
function deleteCobro(index) {
    let cobros = JSON.parse(localStorage.getItem('cobros')) || [];
    cobros.splice(index, 1);
    localStorage.setItem('cobros', JSON.stringify(cobros));
    loadCobros();
}

// Imprimir cobro
function printCobro(index) {
    const cobros = JSON.parse(localStorage.getItem('cobros')) || [];
    const cobro = cobros[index];
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Factura</title></head><body>');
    printWindow.document.write('<h1>Factura de Cobro</h1>');
    printWindow.document.write('<p><strong>Nombre Completo:</strong> ' + cobro.nombreCompleto + '</p>');
    printWindow.document.write('<p><strong>Edad:</strong> ' + cobro.edad + '</p>');
    printWindow.document.write('<p><strong>Observaciones:</strong> ' + cobro.observaciones + '</p>');
    printWindow.document.write('<p><strong>Total:</strong> $' + cobro.total.toFixed(2) + '</p>');
    printWindow.document.write('<p>¡Gracias por su preferencia!</p>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}


