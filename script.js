const inputField = document.querySelector('input');
const ul = document.querySelector('ul');
const appMain = document.querySelector('.app');
const itemList = document.querySelector('.item-list');

function debounce(fn, debounceTime) {
	let timeOut = 0;

	return (...args) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            fn(...args);
        }, debounceTime)
    }
}

async function getRepositories(val) {
	try {
		const response = await fetch(`https://api.github.com/search/repositories?q=${val}`);

		if (!response.ok) {
			throw new Error('Network error: ' + response.status);
		}

		const data = await response.json();

		return data.items;
	} catch(error) {
		console.log('Error: ' + error.message)
	}
}

async function saveRepositories(val) {
	const repos = await getRepositories(val);

	if (val.trim() === '') {
    	ul.innerHTML = '';
    	return;
    }

    ul.innerHTML = '';

    const maxItems = 5;
	let itemsCount = 0;

    repos.forEach(el => {
    	const item = document.createElement('li');
		item.textContent = el.name;
		item.classList.add('suggestion-item');

		item.addEventListener('click', function() {
			inputField.value = '';
			ul.innerHTML = '';
			const listItem = document.createElement('li');
			const closeBtn = document.createElement('span');
			closeBtn.innerHTML = '&times;';
			closeBtn.classList.add('close-btn');
			listItem.classList.add('list-item');

			function createItemWithNames() {
				const itemElement = document.createElement('div');
        		return itemElement;
			}

			const itemName = createItemWithNames();
			const itemOwner = createItemWithNames();
			const itemStars = createItemWithNames();
			itemName.textContent = `Name: ${el.name}`;
			itemOwner.textContent = `Owner: ${el.owner.login}`;
			itemStars.textContent = `Stars: ${el.stargazers_count}`;

			listItem.appendChild(itemName);
			listItem.appendChild(itemOwner);
			listItem.appendChild(itemStars);

			listItem.appendChild(closeBtn);
			itemList.appendChild(listItem);

			closeBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				listItem.remove();
			});
		});

		function appendItems(item) {
			if (itemsCount < maxItems) {
				ul.appendChild(item);
				itemsCount++;
			}
		}

		appendItems(item);

		 });
}

const debouncedFn = debounce(saveRepositories, 300);

inputField.addEventListener('input', (e) => {
	debouncedFn(e.target.value);
});