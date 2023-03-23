let cart = [];
let modalQt = 1;
let modalKey= 0;


const c = (el)=>document.querySelector(el); // função para selecionar
const cs = (el)=>document.querySelectorAll(el);

pizzaJson.map((item,index)=>{ // nessa função basicamente o prfifessor mapeou a array pizzaJson, definindo no primeiro parametro o nome dos itens que nela contem e no segundo a numeração de cada array, como 0,1,2,3 etc...

    let pizzaItem = c('.models .pizza-item').cloneNode(true); // nassa função ele selecionou a div pizzaItem implemnetou A variavel c que ja possui uma função especifica e pediiu para clonar as divs model e cart.
    //preencher as informções de pizzaitem
   
    pizzaItem.setAttribute('data-key', index); //seta um atributo que geralmente é utilizado o nome data,para especificar alguma informação e insere o index no segundo atributo que corresponde ao numero de cada array
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // selecionou a duv da imagem e alterou
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `RS ${item.price.toFixed(2)}`; // selecionou a div de preço e auterou o mesmo fixando os preços em duas casas 00,00
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //selecionou o item nome e alterou
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // selecionou a descrição e alterou
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // seleciona a tag a e ao clicar execute a função..
        e.preventDefault(); // previna a ação padrão. ele bloquea a função natural do elemento que no caso seria atualizar a pagina.
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // e.targed seleciona o proprio item que ele esta clicando,, e o closest diz para achar o elemento mais proximo especificado  e colocar o atributo data-key.
        modalQt = 1;
        modalKey = key;
        c('.pizzaBig img').src = pizzaJson[key].img; //seleciona a class especificada e muda a imagem.
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =  `RS ${item.price.toFixed(2)}`; 
        c('.pizzaInfo--size.selected').classList.remove('selected'); // remove a opção ja pre selecionada no tamanho.
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //(ForEach= para cada função), sizeIndex é a numeração de cada array.
            if(sizeIndex == 2) { //se for clicado no index dois da array, que no caso é o grande ...
                size.classList.add('selected'); //ficará selecionado.
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        
       
        c('.pizzaInfo--qt').innerHTML = modalQt;
       
       
        c('.pizzaWindowArea').style.opacity = 0; // a opacidade é 0=0% ou 1=1%;
        c('.pizzaWindowArea').style.display = 'flex'; // window area estava com display none no css.
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200); // irá aparecer a opacidade em cada 200 milisegundos,criando uma certa animação ao abrir a pagina.
    });

    c('.pizza-area').append( pizzaItem ); // a append adiciona no html, sem substituir algo que esteja la,

});

// eventos do modal

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0; //vai ficar bem clarinho na tela
    setTimeout(() =>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500); // espera meio segundo para executar essa função

}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{ 
    if(modalQt > 1) { // se modalqt for maior que um 
        modalQt--; // possibilita diminuir
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++; //possibilita aumentar infinitamente.
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{ // Ao clicar
        c('.pizzaInfo--size.selected').classList.remove('selected'); //remova o item que já está selecionado automaticamente, que no caso é o grande.
        size.classList.add('selected'); // e adiciona o item selecionado
    });

});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{ // ao clicar
    let size= parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); //parseInt transforma o instring em enteiro

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);// fara uma varredura nos itens no carrinho, se ele a achar um item com o mesmo identifier ele vai mostrar.

    if(key > -1) { // se ele for maior que menos um
        cart[key].qt += modalQt; // key para selecionar o item certo, += a quantidade desejada 
    } else {
         cart.push({  // caso ele não ache vai colocar o item completamente no carrinho.
            identifier,
            id:pizzaJson[modalKey].id, //vai pegar o modalkey do item e vai mostrar o id dela
            size,
            qt:modalQt
        });
    }

    closeModal(); // para ao clicar no carrinho fechar o modal.
    updateCart();
});
    c('.menu-openner').addEventListener('click',() => {
        if(cart.length > 0) {
            c('aside').style.left = '0'; // irá mostrar o carrinho no modo mobile
        }

    });
    c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw'; // irá fechar o carrinho no modo mobile.
    });

function updateCart() {

        c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) { 
        c('aside').classList.add('show'); // show significa aparecer.
        c('.cart').innerHTML = ''; // zera o update cart.

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

       for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                 case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                 cart[i].qt++;
                 updateCart();
            });

             c('.cart').append(cartItem);

        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    
    } else {    
        
        c('aside').classList.remove('show'); //aqui irá fechar no celular.
        c('aside').style.left = '100vw'; //caso contrario irá fechar o carrinho, no formato de celular.
    }
}



