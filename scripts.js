/*
    lógica de programação

    [x] Pegar os dados do Input, quando o botão for clicado.
    [x] Ir até o servidor, e trazer os produtos.
    [ ] Colocar os Produtos na tela.
    [ ] Criar o gráfico de Preços.

*/

const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const pricechat = document.querySelector('.price-chart')

let mychart = ''

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const InputValue = event.target[0].value

    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${InputValue}`)
    const products = (await data.json()).results.slice(0, 5999)

    displayItems(products)
    updatePriceChart(products)
})

function displayItems(products) {
    console.log(products)
    productList.innerHTML = products.map(product => `
            <div class="product-card">
            <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL', })}</p>
            <p class="product-store">Loja: ${product.seller.nickname}</p>
            </div>  
            
            `,
    ).join('')

}

function updatePriceChart(products) {
    const Ctx = pricechat.getContext('2d')
    if (mychart) {
        mychart.destroy()
    }
    mychart = new Chart(Ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'Preço (R$)',
                data: products.map(p => p.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            console.log(value)

                            return 'R$ ' + value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Comparação de Preços',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}