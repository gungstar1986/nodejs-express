// Re-struct price
const priceRebuild = price => new Intl.NumberFormat(
    'ru-Ru', {
        currency: 'uah',
        style: 'currency'
    }).format(price);

document.querySelectorAll('.price').forEach(node => node.textContent = priceRebuild(node.textContent));


// Get parent div id="card" =>
const $card = document.querySelector('#card');

// If card === true .then(promise => ...).then(result => ...)
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;

            // add async delete function via fetch('url', method: 'some method').then(... )
            fetch('card/remove/' + id, {
                method: 'delete'
            }).then(promise => promise.json())
                .then(card => {
                    if (card.courses.length) {
                        const html = card.courses.map(item => {
                            return `<tbody>
                        <tr>
                            <td>${item.title}</td>
                            <td>${item.price}</td>
                            <td>${item.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${id}">Delete</button>
                            </td>
                        </tr>
                    </tbody>`
                        }).join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = priceRebuild(card.price)
                    } else {
                        $card.innerHTML = "<h1>В корзине ничего нет</h1>"
                    }
                })
        }
    })
}



