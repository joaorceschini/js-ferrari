import firebase from './firebase-app'
import { appendTemplate, formatCurrency, getFormValues, getQueryString, getQueryStringFromJSON, onSnapshotError, setFormValues } from './utils'

let serviceSummary = [];

const renderServiceOptions = (context, serviceOptions) => {

    const optionsEl = context.querySelector('.options');

    optionsEl.innerHTML = '';

    serviceOptions.forEach(item => {

        const label = appendTemplate(optionsEl, 'label', `
            <input type="checkbox" name="service" value="${item.id}" />
            <div class="square">
                <div></div>
            </div>
            <div class="content">
                <span class="name">${item.name}</span>
                <span class="description">${item.description}</span>
                <span class="price">${formatCurrency(item.price)}</span>
            </div>
        `);

        label.querySelector('[type=checkbox]').addEventListener('change', e => {

            const { checked, value } = e.target;

            if (checked) {

                const service = serviceOptions.filter((option) => {
                    // return (+option.id === +id);
                    return (Number(option.id) === Number(value));    
                })[0];

                serviceSummary.push(service.id);

                /* Forma polida
                const { id } = serviceOptions.filter((option) => {
                    // return (+option.id === +id);
                    return (Number(option.id) === Number(value));    
                })[0];
                serviceSummary.push(id);
                */

            } else {

                serviceSummary = serviceSummary.filter(id => {
                    return Number(id) !== Number(value);
                })

            }

            const result = serviceSummary.map(id => serviceOptions.filter(item => (+item.id === +id))[0])
            
            /*
            .sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
            */

            result.sort((a, b) => {

                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }

            });

            renderServiceSummary(context, serviceOptions)

        });

    });

}

const renderServiceSummary = (context, serviceOptions) => {

    const tbodyEl = context.querySelector("aside tbody");

    tbodyEl.innerHTML = '';

    serviceSummary
        .map(id => serviceOptions
        .filter(item => Number(item.id) === Number(id))[0])
        .sort((a, b) => {

            if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }

        })
        .forEach(item => {

            appendTemplate(tbodyEl, 'tr', `
                <td>${item.name}</td>
                <td class="price">${formatCurrency(item.price)}</td>
            `)

        });

    const totalEl = context.querySelector('footer .total');

    const total = serviceSummary
        .map(id => serviceOptions
        .filter(item => (+item.id === +id))[0])
        .reduce((totalResult, item) => Number(totalResult) + Number(item.price), 0);

    totalEl.innerHTML = formatCurrency(total);

}

document.querySelectorAll("#schedules-services").forEach(page => {

    const db = firebase.firestore();

    db.collection("services").onSnapshot(snapshot => {

        const services = [];

        snapshot.forEach(item => {

            services.push(item.data());

        })

        renderServiceOptions(page, services);
        renderServiceSummary(page, services);

    }, onSnapshotError);


    const form = page.querySelector('form')
    const params = getQueryString();

    setFormValues(form, params);

    const buttonSummary = page.querySelector("#btn-summary-toggle");

    buttonSummary.addEventListener("click", () => {

        page.querySelector("aside").classList.toggle('open');

    });

    form.addEventListener('submit', e => {

        e.preventDefault()

        const values = getFormValues(form)

        window.location.href = `/schedules-payment.html?${getQueryStringFromJSON(values)}`

    })

})