let jobs = [];

// function fetchData() {
//     fetch('./data.json')
//         .then(response => response.json())
//         .then(jsonData => {
//             jobs = jsonData;
//             jobs.forEach(job => {
//                 renderJob(job, job.new, job.featured);
//             });
//         });
// }
async function fetchData(url){
    try{
        let response = await fetch(url)
        if(!response.ok){
            throw new Error('error fetching data')
        }
        jobs = await response.json()
        jobs.forEach(job => {
            renderJob(job, job.new, job.featured);
        });
        // console.log(data);
    }catch (error){
        console.error('Fetch error:', error);
    }
}
const filter_field = document.querySelector('.filter_field');
const jobs_container = document.querySelector('.jobs_container');

function renderJob(job, status, featured) {
    let card = document.createElement('div');
    card.className = 'card';

    let job_details = document.createElement('div');
    job_details.className = 'job_details';

    let logo = document.createElement('img');
    logo.src = job.logo;

    let details = document.createElement('div');
    details.className = 'details';

    let company_name = document.createElement('div');
    company_name.className = 'company_name';

    let name = document.createElement('p');
    name.className = 'name';
    name.innerText = job.company;

    let label = document.createElement('div');
    label.className = 'label';

    let position = document.createElement('div');
    position.className = 'position';
    let position_text = document.createElement('p');
    position_text.innerText = job.position;
    position.appendChild(position_text);

    let info = document.createElement('div');
    info.className = 'info';

    let info_posted = document.createElement('span');
    info_posted.innerText = job.postedAt;
    let info_contract = document.createElement('span');
    info_contract.innerText = job.contract;
    let info_location = document.createElement('span');
    info_location.innerText = job.location;

    details.appendChild(company_name);
    company_name.appendChild(name);
    company_name.appendChild(label);
    details.appendChild(position);
    details.appendChild(info);
    info.appendChild(info_posted);
    let divider1 = document.createElement('div');
    divider1.className = 'divider';
    info.appendChild(divider1);
    info.appendChild(info_contract);
    let divider2 = document.createElement('div');
    divider2.className = 'divider';
    info.appendChild(divider2);
    info.appendChild(info_location);

    let filter = document.createElement('div');
    filter.className = 'filters';

    if (status === true) {
        let status = document.createElement('span');
        status.innerText = 'new!';
        label.appendChild(status);
        card.classList.add("new");
    }
    if (featured === true) {
        let featured = document.createElement('span');
        featured.className = 'featured';
        featured.innerText = 'featured';
        label.appendChild(featured);
    }

    const languages = job.languages;
    const filters = [];
    filters.push(job.role, job.level);
    languages.forEach(language => {
        filters.push(language);
    });

    filters.forEach(filteR => {
        let tablets = document.createElement('div');
        tablets.className = 'tablets';
        tablets.innerText = filteR;
        filter.appendChild(tablets);

        tablets.addEventListener('click', () => {
            renderFilter(tablets);
            filterJob(tablets);
            filter_field.classList.remove('hide');
            applyFilter();
        });
    });

    jobs_container.appendChild(card);
    card.appendChild(job_details);
    job_details.appendChild(logo);
    job_details.appendChild(details);
    card.appendChild(filter);
}

const filterList = [];

function filterJob(keyword) {
    filterList.push(keyword.innerText);
}

function getFilter_arr(jobs, filterList) {
    return jobs.filter(job => {
        const jobValues = [job.role, job.level, ...job.languages];
        return filterList.every(filter => jobValues.includes(filter));
    });
}

function clearFilters() {
    const filter_field = document.querySelector('.filter_field');
    const filter_tablets = document.querySelectorAll('.filter_tablet');
    filter_tablets.forEach(filter_tablet => {
        filter_tablet.remove();
    });
    filter_field.classList.add('hide');
    jobs_container.innerHTML = ''; // Clear existing jobs
    fetchData('./data.json');
}

function removeFilter(button) {
    const parentDiv = button.closest('.filter_tablet');
    parentDiv.remove();
    const filterText = parentDiv.querySelector('.filter p').innerText;
    const index = filterList.indexOf(filterText);
    if (index !== -1) {
        filterList.splice(index, 1);
    }
    applyFilter();
}

function renderFilter(txt) {
    const filter_list = document.querySelector('.filter_list');
    let filter_tablet = document.createElement('div');
    filter_tablet.className = 'filter_tablet';

    filter_list.appendChild(filter_tablet);

    let filter = document.createElement('div');
    filter.className = 'filter';
    let text = document.createElement('p');
    text.innerText = txt.innerText;
    filter.appendChild(text);

    let close = document.createElement('div');
    close.className = 'close';
    close.addEventListener('click', () => {
        removeFilter(close);
    });
    let icon = document.createElement('img');
    icon.src = 'images/icon-remove.svg';
    close.appendChild(icon);

    filter_tablet.appendChild(filter);
    filter_tablet.appendChild(close);
    filter_list.appendChild(filter_tablet);
}

function applyFilter() {
    jobs_container.innerHTML = ''; // Clear existing jobs
    const filteredJobs = getFilter_arr(jobs, filterList);
    filteredJobs.forEach(job => {
        renderJob(job, job.new, job.featured);
    });
}

fetchData('./data.json');
