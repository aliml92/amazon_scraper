// variables
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
let modal = document.getElementById('exampleModal');
let mContent = document.getElementById('mContent');


// dropdown item click handler
Array.from(dropdown).forEach(
    function (element, index, array) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            selectItem = e.target.textContent;
            let url = `https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A13896617011%2Cn%3A565108%2Cp_89%3A${selectItem}&dc&qid=1627208606&rnid=13896617011&ref=sr_nr_n_2`
            getSelectedItem(url);
        })
    }
)

// more info event handler
modal.addEventListener('show.bs.modal', function (event) {
    mContent.innerHTML = `<div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel" style="color:#0e1e25; font: 600 1rem 'Raleway', sans-serif;">Data Loading ...</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-6">
                                <img src="/images/loader.gif" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-6">
                                <div class="card-body">
                                    <h5 class="card-title">Specs</h5>
                                    <div> ... </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    var button = event.relatedTarget
    var itemLink = button.getAttribute('data-bs-whatever')
    getSingleItem(itemLink)
})   

// selected item scraper
let laptops = [];
function getSelectedItem(url) {
    axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        .then((response) => {
            htmlData = response.data.contents;
            htmlDom = new DOMParser().parseFromString(htmlData, 'text/html');
            items = htmlDom.getElementsByClassName("s-result-item");
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
            appendItems(laptops);
        })
        .catch(function (error) {
            console.log(error)
        })
}

// attaching scraped results for a selected item to the dom
function appendItems(a) {
    itemswrap.innerHTML = "";
    a.forEach((e) => {
        itemswrap.innerHTML += `
                <div class="col" >
                    <div class="card h-100"  style="background-color:#f7fcfc !important;">
                        <a href="${e.src}" target="_blank" class="pt-3">
                            <img src="${e.src}"
                                class="card-img-top" alt="...">
                        </a>
                        <div class="card-body">
                            <h5 class="card-title" style="color:#0e1e25; font: 600 1.2rem 'Raleway', sans-serif;">${e.name}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item" style="background-color:#f7fcfc !important;"><span style="font: 600 1rem 'Raleway', sans-serif;">Price: </span>
                             <span class="text-success">${e.cost}$ </span></li>
                            <li class="list-group-item" style="background-color:#f7fcfc !important;"><span style="font: 600 1rem 'Raleway', sans-serif;">Source: </span>
                                <a href="${e.href}" class="text-success" target="_blank">www.amazon.com
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-arrow-up-right-square" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z" />
                                </svg>
                            </a>
                            </li>
                        </ul>
                        <div class="card-footer d-flex justify-content-evenly">
                            <button type="button" class="btn btn-success" data-bs-toggle="modal"
                                data-bs-target="#exampleModal" data-bs-whatever="${e.href}">More info</button>
                        
                        </div>
                    </div>
                </div>
                `
    })
}

// scrape single item
function getSingleItem(link) {
        axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`)
        .then((response) => {
            htmlData = response.data.contents;
            htmlDom = new DOMParser().parseFromString(htmlData, 'text/html');
            let img = htmlDom.getElementById('landingImage');
            let title = htmlDom.getElementById('productTitle');
            let price = htmlDom.getElementById('priceblock_ourprice');
            let spec1 = htmlDom.getElementById('productDetails_techSpec_section_1');
            mContent.innerHTML = `
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel" style="color:#0e1e25; font: 600 1rem 'Raleway', sans-serif;">${title.textContent}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-6 col-lg-6">
                                <img src="${img.getAttribute('data-old-hires')}" class="img-fluid" alt="...">
                            </div>
                            <div class="col-md-6 col-lg-6">
                                <div class="card-body">
                                    <h5 class="card-title">Specs</h5>
                                    <p>Price: ${price.textContent}</p>
                                    <div>${spec1.outerHTML}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
        })
        .catch(function (error) {
            console.log(error)
        })
        
}

function findResults(e) {
    e.preventDefault();
    let sItem = document.getElementById('query');
    let sValue = sItem.value.trim();
    sValue = sValue.replace( /\s+/g,' ');
    let url = `https://www.amazon.com/s?k=${sValue}&rh=n%3A565108&ref=nb_sb_noss`
    getSelectedItem(url)
}












