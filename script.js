let selectItem;
let htmlDom;
let htmlData;
let items;
let img;
let title;
let price;
let priceFrac;
let link;

let dropdown = document.getElementsByClassName("dropdown-menu")
let itemswrap = document.getElementById("items-wrap");

Array.from(dropdown).forEach(
    function (element, index, array) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            selectItem = e.target.textContent;
            console.log(selectItem);
            getSelectedItem(selectItem);
        })
    }
)

let laptops = [];
function getSelectedItem(item) {
    axios.get(`http://www.whateverorigin.org/get?url=https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A13896617011%2Cn%3A565108%2Cp_89%3A${item}&dc&qid=1627208606&rnid=13896617011&ref=sr_nr_n_2`)
        .then((response) => {
            console.log(response)
            htmlData = response.data;
            htmlDom = new DOMParser().parseFromString(htmlData, 'text/html');
            items = htmlDom.getElementsByClassName("sg-col-inner");
            laptops = [];
            Array.from(items).forEach((e) => {
                img = e.getElementsByClassName("s-image")[0]
                link = e.getElementsByClassName("a-link-normal")[0]
                title = e.getElementsByClassName("a-text-normal")[0]
                price = e.getElementsByClassName("a-price-whole")[0]
                priceFrac = e.getElementsByClassName("a-price-fraction")[0]
                if (img != null && price != null) {
                    laptops.push({
                        src: img.src,
                        href: "https://www.amazon.com"+link.getAttribute("href"),
                        name: title.textContent,
                        cost: price.textContent+priceFrac.textContent
                    });
                }
            })
            localStorage.setItem('laptops', JSON.stringify(laptops));
        })
        .catch(function (error) {
            console.log(error)
        })
        .then(() => {
            let l = localStorage.getItem('laptops');
            let a = JSON.parse(l)
            console.log(a)
            appendItems(a);
        })
}
function appendItems(a) {
    itemswrap.innerHTML = "";
    a.forEach((e) => {
        itemswrap.innerHTML += `
                <div class="col">
                    <div class="card h-100 text-white bg-success">
                        <a href="${e.src}"
                            class="glightbox" >
                            <img src="${e.src}"
                                class="card-img-top" alt="...">
                        </a>
                        <div class="card-body">
                            <h5 class="card-title">${e.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item bg-success text-white"><span class="text-dark fw-bolder">Price: </span>${e.cost}$</li>
                            <li class="list-group-item bg-success text-white"><span class="text-dark fw-bolder">Website: </span>
                                <a href="${e.href}" class="text-white">www.amazon.com
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z" />
                                </svg>
                            </a>
                            </li>
                        </ul>
                        <div class="card-footer d-flex justify-content-evenly">
                            <button type="button" class="btn btn-success btn-outline-info" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" data-bs-whatever="${e.href}">More info</button>
                        
                        </div>
                    </div>
                </div>
                `
    })
}













