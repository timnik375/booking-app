// let daysCurrentMonth = document.querySelectorAll('.current');

const form = document.querySelector('form');
let todayDate = null;

let finalSum = 0;


let state = {
	month: new Date().getMonth(),
	year: new Date().getFullYear(),
}

function _addBookStart(daysCurrentMonthArray, target) {
	daysCurrentMonthArray.forEach(elem => elem.classList.remove('start'));
	daysCurrentMonthArray.forEach(elem => elem.classList.remove('fp'));
	target.classList.add('start');
	target.classList.add('fp');

	document.querySelector('.book_date_start').innerText = target.id.substr(0,10);
}

function _addBookFinish(daysCurrentMonthArray, target) {
	target.classList.add('finish');
	document.querySelector('.book_date_finish').innerText = target.id.substr(0,10);

	_addBookRange(daysCurrentMonthArray)
}

function _addBookRange(daysCurrentMonthArray) {
	daysCurrentMonthArray.forEach((elem, index) => {

		if (index + 1 > parseInt(document.querySelector('.book_date_start').innerText.substr(0,2))) {
			if(index + 1 < parseInt(document.querySelector('.book_date_finish').innerText.substr(0,2))) {
				elem.classList.add('range');
				elem.classList.add('fp');
			}
		}
	})
}

function _getBookPrice(priceFinal) {
	if (document.querySelectorAll('.start').length && document.querySelectorAll('.finish').length) {
		let datesFP = document.querySelectorAll('.fp');
		let numFP = 0;

		datesFP.forEach((elem) => {
			numFP += parseFloat(elem.nextSibling.innerText);
		})

		if (!isNaN(numFP)) {
			priceFinal.innerText = `${numFP} BYN`;
		}
	}
}

function datesForGrid(year, month) {
	const gridSize = 42;

	let dates = [];
	let firstDay = new Date(year, month).getDay() - 1;
	let totalDaysInMonth = new Date(year, month + 1, 0).getDate();
	let totalDaysInPrevMonth = new Date(year, month, 0).getDate();

	for(let i = 1; i <= firstDay; i++) {
		let prevMonthDate = totalDaysInPrevMonth - firstDay + i;
		let key = new Date(state.year, state.month -1, prevMonthDate).toLocaleString();
		dates.push({key: key, date: prevMonthDate, monthClass:'prev'});
	}

	let today = new Date();
	for(let i = 1; i <= totalDaysInMonth; i++) {
		let key = new Date(state.year, state.month, i).toLocaleString();
		let date = new Date(state.year, state.month, i);
		if(i === today.getDate() && state.month === today.getMonth() && state.year === today.getFullYear()) {
			if (date.getDay() === 6 || date.getDay() === 0) {
				dates.push({key: key, date: i, monthClass: 'current', todayClass: 'today', price: '30'})

			} else {
				dates.push({key: key, date: i, monthClass: 'current', todayClass: 'today', price: '10'})
			}
		} else{
			if (date.getDay() === 6 || date.getDay() === 0) {
				dates.push({key: key, date: i, monthClass: 'current', price: '30'})
			} else {
				dates.push({key: key, date: i, monthClass: 'current', price: '10'})
			}
		}
	}

	if(dates.length < gridSize) {
		let count = gridSize - dates.length;
		for(let i = 1; i <= count; i++) {
			let key = new Date(state.year, state.month + 1, i).toLocaleString();
			dates.push({key: key, date: i, monthClass:'next'});
		}
	}

	return dates;
}

async function render() {
	const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
	const daysOfWeek = ['Пн','Вт','Ср','Чт','Пт','Сб', 'Вс'];

	let calendarApp = document.querySelector('[data-app=calendar-app]');


	calendarApp.innerHTML = `
      <div class="calendar-nav">
        <h2>${months[state.month]} ${state.year}</h2>
        <div>
        	<button id="prev-month"></button>
        	<button id="next-month"></button>
		</div>
      </div>
      <div class='calendar-grid'>
        ${ daysOfWeek.map(day => `<div class="day_week">${day}</div>` ).join('') }
        ${ datesForGrid(state.year, state.month).map(date => `<div class="day_cur"><div id="${date.key}" class="day_num ${date.monthClass} ${date.todayClass ? date.todayClass : ''}">${date.date}</div><div class="price_cal">${ date.monthClass === 'current' ? date.price + ' BYN' : ''}</div></div>`).join('') }
      </div>
  `;

	if (document.querySelectorAll('.today').length) {
		todayDate = document.querySelector('.today').id
	}

	await getReservations();
}

function showCalendar(prevNextIndicator) {
	let date = new Date(state.year, state.month + prevNextIndicator);

	state.year = date.getFullYear();
	state.month = date.getMonth();
	render();
}

showCalendar(0);

// let dayUser = null;
// let numCur = document.querySelectorAll('.current');

document.addEventListener('click', function(e) {
	if(e.target.id === 'prev-month') {
		showCalendar(-1);
	}
	if(e.target.id === 'next-month') {
		showCalendar(1);
	}

	// if (e.target.classList.contains('next')) {
	// 	dayUser = e.target.innerText
	// 	showCalendar(1);
	// 	for (let i = 0; i < numCur.length; i++) {
	// 		if (numCur[i].innerText === dayUser) {
	// 			numCur[i].classList.add('start');
	// 			i = numCur.length;
	// 		}
	// 	}
	// 	dayUser = null;
	// }

	let startDateBookDisplay = document.querySelector('.book_date_start');
	let nums = document.querySelectorAll('.current');
	let priceFinal = document.querySelector('.final_price');
	let startDateCalendar = document.querySelector('.start');

	if (e.target.classList.contains('current') && !e.target.classList.contains('range')) {

		if (startDateBookDisplay.innerText === 'Выберите дату заселения') {
			let today = new Date();
			let userStart = new Date(`${e.target.id.substr(0,10).split('/').reverse().join('-')}T14:00:00.000`);
			if (today <= userStart){
				_addBookStart(nums, e.target);
			} else {
				console.log('Смотри другую дату')
			}

		} else {
			let userStart = startDateCalendar !== null ? new Date(`${startDateCalendar.id.substr(0,10).split('/').reverse().join('-')}T14:00:00.000`) : new Date(`${startDateBookDisplay.innerText.split('/').reverse().join('-')}T14:00:00.000`);
			if (!e.target.classList.contains('start')) {
				let userFinish = new Date(`${e.target.id.substr(0,10).split('/').reverse().join('-')}T14:00:00.000`);
				if (userStart <= userFinish){
					nums.forEach(elem => elem.classList.remove('finish'));
					_addBookFinish(nums, e.target);
				} else if (userStart > userFinish) {
					_addBookStart(nums, e.target);

					_addBookRange(nums);

				} else {
					console.log('Смотри другую дату')
				}
			}
		}

		_getBookPrice(priceFinal);
	}

	if (e.target.classList.contains('range')) {
		nums.forEach(elem => elem.classList.remove('finish'));
		nums.forEach(elem => elem.classList.remove('fp'));
		nums.forEach(elem => elem.classList.remove('range'));

		_addBookFinish(nums, e.target);

		startDateCalendar.classList.add('fp');

		_getBookPrice(priceFinal);
	}

	if (e.target.classList.contains('close')) {
		if (e.target.previousElementSibling.classList.contains('book_date_start')) {
			nums.forEach(elem => elem.classList.remove('start'));

			e.target.previousElementSibling.innerText = 'Выберите дату заселения'

			nums.forEach(elem => elem.classList.remove('range'));

			nums.forEach(elem => {
				if (!elem.classList.contains('finish')) {
					elem.classList.remove('fp')
				}
			});
		}

		if (e.target.previousElementSibling.classList.contains('book_date_finish')) {
			e.target.previousElementSibling.innerText = 'Выберите дату выселения'

			nums.forEach(elem => {
				if (!elem.classList.contains('start')) {
					elem.classList.remove('fp')
				}
			});
			nums.forEach(elem => elem.classList.remove('range'));
			nums.forEach(elem => elem.classList.remove('finish'));
		}

		priceFinal.innerText = '0 BYN';
		finalSum = 0;
	}
});

form.addEventListener('submit', formSend);

async function formSend(e) {
	e.preventDefault();

	let error = formValidate(form);
	let formData = new FormData(form);

	if (error === 0) {

		document.querySelector('#date').value = `${document.querySelector('.start').getAttribute('id').substr(0,10)}|${document.querySelector('.finish').getAttribute('id').substr(0,10)}`;

		form.submit();

		alert('Success!');
		// form.reset();
		document.querySelector('.final_price').innerText = '0 BYN';
		finalSum = 0;
		document.querySelector('.__select__title').innerText = 'Выберите время заселения';
		// render()
	} else {
		alert('Заполните все поля')
	}
}

function formValidate() {
	let error = 0;
	let formReq = document.querySelectorAll('._req');

	for (let i = 0; i < formReq.length ; i++) {
		const input = formReq[i];
		formRemoveError(input);

		if (input.classList.contains('email_input')) {
			if (emailTest(input)) {
				formAddError(input);
				error++;
			}
		} else if (input.classList.contains('final_price') && input.innerText === '0 BYN') {
			formAddError(input);
			error++;
		} else if (input.classList.contains('book_date_start') && input.innerText === 'Выберите дату заселения') {
			formAddError(input.parentNode);
			error++;
		} else if (input.classList.contains('book_date_finish') && input.innerText === 'Выберите дату выселения') {
			formAddError(input.parentNode);
			error++;
		} else {
			if (input.value === '') {
				formAddError(input);
				error++
			}
		}
	}

	if (selectSingle_title.innerText === 'Выберите время заселения') {
		formAddError(selectSingle)
		error++
	}

	return error;
}

function formAddError(input) {
	input.classList.add('_error');
}

function formRemoveError(input) {
	input.classList.remove('_error');
}

function emailTest(input) {
	return	!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

const selectSingle = document.querySelector('.__select');
const selectSingle_title = selectSingle.querySelector('.__select__title');
const selectSingle_labels = selectSingle.querySelectorAll('.__select__label');
const selectSingle_input = selectSingle.querySelectorAll('.__select__input');

selectSingle_title.addEventListener('click', () => {
	if ('active' === selectSingle.getAttribute('data-state')) {
		selectSingle.setAttribute('data-state', '');

		selectSingle_input.forEach((elem) => {
			elem.removeAttribute("disabled");
		})



	} else {
		selectSingle.setAttribute('data-state', 'active');

		if (!document.querySelectorAll('.start').length || !document.querySelectorAll('.finish').length) {
			selectSingle_input.forEach((elem) => {
				elem.setAttribute("disabled", "disabled");
			})
		}

		if (document.querySelector('.book_date_start').innerText !== 'Введите дату заселения') {
			let startDateCalendar = document.querySelector('.start');

			if (parseFloat(startDateCalendar.id.substr(12,2))) {
				selectSingle_input.forEach((elem) => {
					if (parseFloat(elem.value.substr(0,2)) < parseFloat(startDateCalendar.id.substr(12,2))) {
						elem.setAttribute("disabled", "disabled");
					}
				})
			}

		}

		if (document.querySelector('.book_date_finish').innerText !== 'Выберите дату выселения') {
			let finishDateCalendar = document.querySelector('.finish');

			if (parseFloat(finishDateCalendar.id.substr(12,2))) {
				selectSingle_input.forEach((elem) => {
					if (parseFloat(elem.value.substr(0,2)) >= parseFloat(finishDateCalendar.id.substr(12,2))) {
						elem.setAttribute("disabled", "disabled");
					}
				})
			}
		}
	}
});

for (let i = 0; i < selectSingle_labels.length; i++) {
	selectSingle_labels[i].addEventListener('click', (e) => {
		selectSingle_title.textContent = e.target.textContent;
		selectSingle.setAttribute('data-state', '');
	});
}

async function getReservations() {
	let reservations = null;

	await fetch('/back').then((res) => {
		res.json().then((data) => {
			reservations = data

			let daysCur = document.querySelectorAll('.current');

			reservations.forEach((item) => {
				daysCur.forEach((elem) => {
					if (parseFloat(item.date.substr(3,2)) === parseFloat(elem.id.substr(3,2))) {
						if (parseFloat(item.date.substr(0,2)) <= parseFloat(elem.id.substr(0,2))) {
							if (parseFloat(item.date.substr(11,2)) > parseFloat(elem.id.substr(0,2))) {
								elem.nextSibling.innerText = item.name
							}
						}

						if (parseFloat(item.date.substr(11,2)) === parseFloat(elem.id.substr(0,2))) {
							elem.id = `${item.date.substr(11,10)}, ${item.time}`;
						} else if (parseFloat(item.date.substr(0,2)) === parseFloat(elem.id.substr(0,2))) {
							elem.id = `${item.date.substr(0,10)}, ${item.time}`;
						}
					}
				})
			})
		})
	});


	// if (reservations === null) {
	// 	await getReservations()
	// }


}
