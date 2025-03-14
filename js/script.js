
// burger-menu
const burgerMenu = document.querySelector('.burger-menu'),
	header = document.querySelector('.header'),
	menu = document.querySelector('.header__menu-wrapper');

burgerMenu.addEventListener('click', (e) => {
	burgerMenu.classList.toggle('_active');
	menu.classList.toggle('_active');
	document.body.classList.toggle('_lock');
	header.classList.toggle('_open-menu');
});

// A function that moves elements to other blocks depending on the size of the screen. (Used when adapting the page to different devices.)
function dynamicAdaptiv() {
	class DynamicAdapt {
		constructor(type) {
			this.type = type
		}

		init() {
			// массив объектов
			this.оbjects = []
			this.daClassname = '_dynamic_adapt_'
			// массив DOM-элементов
			this.nodes = [...document.querySelectorAll('[data-da]')]

			// наполнение оbjects обьектами
			this.nodes.forEach((node) => {
				const data = node.dataset.da.trim()
				const dataArray = data.split(',')
				const оbject = {}
				оbject.element = node
				оbject.parent = node.parentNode
				оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
				оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
				оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
				оbject.index = this.indexInParent(оbject.parent, оbject.element)
				this.оbjects.push(оbject)
			})
			this.arraySort(this.оbjects)

			// массив уникальных медиа-запросов
			this.mediaQueries = this.оbjects
				.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
				.filter((item, index, self) => self.indexOf(item) === index)
			// навешивание слушателя на медиа-запрос
			// и вызов обработчика при первом запуске
			this.mediaQueries.forEach((media) => {
				const mediaSplit = media.split(',')
				const matchMedia = window.matchMedia(mediaSplit[0])
				const mediaBreakpoint = mediaSplit[1]

				// массив объектов с подходящим брейкпоинтом
				const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
				matchMedia.addEventListener('change', () => {

					this.mediaHandler(matchMedia, оbjectsFilter)
				})
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
		}

		// Основная функция
		mediaHandler(matchMedia, оbjects) {
			if (matchMedia.matches) {
				оbjects.forEach((оbject) => {
					// оbject.index = this.indexInParent(оbject.parent, оbject.element);
					this.moveTo(оbject.place, оbject.element, оbject.destination)
				})
			} else {
				оbjects.forEach(({ parent, element, index }) => {
					if (element.classList.contains(this.daClassname)) {
						this.moveBack(parent, element, index)
					}
				})
			}
		}

		// Функция перемещения
		moveTo(place, element, destination) {
			element.classList.add(this.daClassname)
			if (place === 'last' || place >= destination.children.length) {
				destination.append(element)
				return
			}
			if (place === 'first') {
				destination.prepend(element)
				return
			}
			destination.children[place].before(element)
		}

		// Функция возврата
		moveBack(parent, element, index) {
			element.classList.remove(this.daClassname)
			if (parent.children[index] !== undefined) {
				parent.children[index].before(element)
			} else {
				parent.append(element)
			}
		}

		// Функция получения индекса внутри родителя
		indexInParent(parent, element) {
			return [...parent.children].indexOf(element)
		}

		// Функция сортировки массива по breakpoint и place
		// по возрастанию для this.type = min
		// по убыванию для this.type = max
		arraySort(arr) {
			if (this.type === 'min') {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return -1
						}
						if (a.place === 'last' || b.place === 'first') {
							return 1
						}
						return 0
					}
					return a.breakpoint - b.breakpoint
				})
			} else {
				arr.sort((a, b) => {
					if (a.breakpoint === b.breakpoint) {
						if (a.place === b.place) {
							return 0
						}
						if (a.place === 'first' || b.place === 'last') {
							return 1
						}
						if (a.place === 'last' || b.place === 'first') {
							return -1
						}
						return 0
					}
					return b.breakpoint - a.breakpoint
				})
				return
			}
		}
	}

	let da = new DynamicAdapt('max');
	da.init();
}

dynamicAdaptiv()



// open/close menu on mobile
const menuLinks = document.querySelectorAll('.header-menu__link');

if (menuLinks) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onClickToLink)

		function onClickToLink(e) {
			e.preventDefault()
			if (document.documentElement.dataset.mobileMode === 'true') {
				const menuContent = menuLink.nextElementSibling;
				menuLink.classList.toggle('_active')
				_slideToggle(menuContent)
			}


			function _slideUp(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = target.offsetHeight + 'px';
					target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					window.setTimeout(() => {
						target.style.display = 'none';
						target.style.removeProperty('height');
						target.style.removeProperty('padding-top');
						target.style.removeProperty('padding-bottom');
						target.style.removeProperty('margin-top');
						target.style.removeProperty('margin-bottom');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}
			}

			function _slideDown(target, duration = 500) {
				if (!target.classList.contains('_slide')) {
					target.classList.add('_slide');

					target.style.removeProperty('display');
					let display = window.getComputedStyle(target).display;
					if (display === 'none')
						display = 'block'

					target.style.display = display;
					let height = target.offsetHeight;
					target.style.overflow = 'hidden';
					target.style.height = 0;
					target.style.paddingTop = 0;
					target.style.paddingBottom = 0;
					target.style.marginTop = 0;
					target.style.marginBottom = 0;
					target.offsetHeight;
					target.style.transitionProperty = 'height, margin, padding';
					target.style.transitionDuration = duration + 'ms';
					target.style.height = height + 'px';
					target.style.removeProperty('padding-top');
					target.style.removeProperty('padding-bottom');
					target.style.removeProperty('margin-top');
					target.style.removeProperty('margin-bottom');
					window.setTimeout(() => {
						target.style.removeProperty('height');
						target.style.removeProperty('overflow');
						target.style.removeProperty('transition-duration');
						target.style.removeProperty('transition-property');
						target.classList.remove('_slide');
					}, duration);
				}

			}

			function _slideToggle(target, duration = 500) {
				if (window.getComputedStyle(target).display === 'none') {
					return _slideDown(target, duration);
				} else {
					_slideUp(target, duration);
				}
			}
		}

	});


}


//  set html tag atribute "mobile-mode" on screens < 991.98px
let mql = window.matchMedia("(max-width: 991.98px)");
window.addEventListener('resize', mobileModeFunction)

function mobileModeFunction() {
	if (mql.matches) {
		document.documentElement.dataset.mobileMode = true
	} else {
		document.documentElement.dataset.mobileMode = false
	}
}

mobileModeFunction()


// change header on scroll
const headerChanging = document.querySelector('.header-changing');

if (headerChanging) {
	window.addEventListener('scroll', onScrollFunction)

	function onScrollFunction(e) {

		let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop

		if (scrollPosition > 10) {
			header.classList.add('_active')
		} else {
			header.classList.remove('_active')
		}
	}
}



// dropdown menu
const MatchMedia = {
	mobile: window.matchMedia(`(width <= 797.98px)`),
}
class BaseComponent {
	constructor() {
		if (this.constructor === BaseComponent) {
			throw new Error('Невозможно создать экземпляр абстрактного класса BaseComponent!')
		}
	}

	getProxyState(initialState) {
		return new Proxy(initialState, {
			get: (target, prop) => {
				return target[prop]
			},
			set: (target, prop, newValue) => {
				const oldValue = target[prop]

				target[prop] = newValue

				if (newValue !== oldValue) {
					this.updateUI()
				}

				return true
			},
		})
	}

	/**
	 * Перерисовка UI в ответ на обновление состояния
	 */
	updateUI() {
		throw new Error('Необходимо реализовать метод updateUI!')
	}
}
const rootSelector = '[data-js-select]'

class Select extends BaseComponent {
	selectors = {
		root: rootSelector,
		originalControl: '[data-js-select-original-control]',
		button: '[data-js-select-button]',
		dropdown: '[data-js-select-dropdown]',
		option: '[data-js-select-option]',
	}

	stateClasses = {
		isExpanded: 'is-expanded',
		isSelected: 'is-selected',
		isCurrent: 'is-current',
		isOnTheLeftSide: 'is-on-the-left-side',
		isOnTheRightSide: 'is-on-the-right-side',
	}

	stateAttributes = {
		ariaExpanded: 'aria-expanded',
		ariaSelected: 'aria-selected',
		ariaActiveDescendant: 'aria-activedescendant',
	}

	initialState = {
		isExpanded: false,
		currentOptionIndex: null,
		selectedOptionElement: null,
	}

	constructor(rootElement) {
		super()
		this.rootElement = rootElement
		this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl)
		this.buttonElement = this.rootElement.querySelector(this.selectors.button)
		this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown)
		this.optionElements = this.dropdownElement.querySelectorAll(this.selectors.option)
		this.state = this.getProxyState({
			...this.initialState,
			currentOptionIndex: this.originalControlElement.selectedIndex,
			selectedOptionElement: this.optionElements[this.originalControlElement.selectedIndex],
		})
		this.fixDropdownPosition()
		this.updateTabIndexes()
		this.bindEvents()
	}

	updateUI() {
		const {
			isExpanded,
			currentOptionIndex,
			selectedOptionElement,
		} = this.state

		const newSelectedOptionValue = selectedOptionElement.textContent.trim()

		const updateOriginalControl = () => {
			this.originalControlElement.value = newSelectedOptionValue
		}

		const updateButton = () => {
			this.buttonElement.textContent = newSelectedOptionValue
			this.buttonElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
			this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isExpanded)
			this.buttonElement.setAttribute(
				this.stateAttributes.ariaActiveDescendant,
				this.optionElements[currentOptionIndex].id
			)
		}

		const updateDropdown = () => {
			this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
		}

		const updateOptions = () => {
			this.optionElements.forEach((optionElement, index) => {
				const isCurrent = currentOptionIndex === index
				const isSelected = selectedOptionElement === optionElement

				optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent)
				optionElement.classList.toggle(this.stateClasses.isSelected, isSelected)
				optionElement.setAttribute(this.stateAttributes.ariaSelected, isSelected)
			})
		}

		updateOriginalControl()
		updateButton()
		updateDropdown()
		updateOptions()
	}

	toggleExpandedState() {
		this.state.isExpanded = !this.state.isExpanded
	}

	expand() {
		this.state.isExpanded = true
	}

	collapse() {
		this.state.isExpanded = false
	}

	fixDropdownPosition() {
		const viewportWidth = document.documentElement.clientWidth
		const halfViewportX = viewportWidth / 2
		const { width, x } = this.buttonElement.getBoundingClientRect()
		const buttonCenterX = x + width / 2
		const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX

		this.dropdownElement.classList.toggle(
			this.stateClasses.isOnTheLeftSide,
			isButtonOnTheLeftViewportSide
		)

		this.dropdownElement.classList.toggle(
			this.stateClasses.isOnTheRightSide,
			!isButtonOnTheLeftViewportSide
		)
	}

	updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
		this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1
		this.buttonElement.tabIndex = isMobileDevice ? -1 : 0
	}

	get isNeedToExpand() {
		const isButtonFocused = document.activeElement === this.buttonElement

		return (!this.state.isExpanded && isButtonFocused)
	}

	selectCurrentOption() {
		this.state.selectedOptionElement = this.optionElements[this.state.currentOptionIndex]
	}

	onButtonClick = () => {
		this.toggleExpandedState()
	}

	onClick = (event) => {
		const { target } = event

		const isButtonClick = target === this.buttonElement
		const isOutsideDropdownClick =
			target.closest(this.selectors.dropdown) !== this.dropdownElement

		if (!isButtonClick && isOutsideDropdownClick) {
			this.collapse()
			return
		}

		const isOptionClick = target.matches(this.selectors.option)

		if (isOptionClick) {
			this.state.selectedOptionElement = target
			this.state.currentOptionIndex = [...this.optionElements]
				.findIndex((optionElement) => optionElement === target)
			this.collapse()
		}
	}

	onArrowUpKeyDown = () => {
		if (this.isNeedToExpand) {
			this.expand()
			return
		}

		if (this.state.currentOptionIndex > 0) {
			this.state.currentOptionIndex--
		}
	}

	onArrowDownKeyDown = () => {
		if (this.isNeedToExpand) {
			this.expand()
			return
		}

		if (this.state.currentOptionIndex < this.optionElements.length - 1) {
			this.state.currentOptionIndex++
		}
	}

	onSpaceKeyDown = () => {
		if (this.isNeedToExpand) {
			this.expand()
			return
		}

		this.selectCurrentOption()
		this.collapse()
	}

	onEnterKeyDown = () => {
		if (this.isNeedToExpand) {
			this.expand()
			return
		}

		this.selectCurrentOption()
		this.collapse()
	}

	onKeyDown = (event) => {
		const { code } = event

		const action = {
			ArrowUp: this.onArrowUpKeyDown,
			ArrowDown: this.onArrowDownKeyDown,
			Space: this.onSpaceKeyDown,
			Enter: this.onEnterKeyDown,
		}[code]

		if (action) {
			event.preventDefault()
			action()
		}
	}

	onMobileMatchMediaChange = (event) => {
		this.updateTabIndexes(event.matches)
	}

	onOriginalControlChange = () => {
		this.state.selectedOptionElement = this.optionElements[this.originalControlElement.selectedIndex]
	}

	bindEvents() {
		MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange)
		this.buttonElement.addEventListener('click', this.onButtonClick)
		document.addEventListener('click', this.onClick)
		this.rootElement.addEventListener('keydown', this.onKeyDown)
		this.originalControlElement.addEventListener('change', this.onOriginalControlChange)
	}
}

class SelectCollection {
	constructor() {
		this.init()
	}

	init() {
		document.querySelectorAll(rootSelector).forEach((element) => {
			new Select(element)
		})
	}
}

new SelectCollection()


//scroll animation
const animItems = document.querySelectorAll('[data-anim-item]');

if (animItems) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		animItems.forEach(animItem => {

			const animItemHeigh = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 5;
			const scrollDistance = window.scrollY

			let animItemPoint = window.innerHeight - animItemHeigh / animStart;

			if (animItemHeigh > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((scrollDistance > animItemOffset - animItemPoint) && scrollDistance < (animItemOffset + animItemHeigh)) {
				animItem.classList.add('_show');

			}
			// else {
			// 	animItem.classList.remove('_show');
			// }
		});

	}

	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.scrollX || document.documentElement.scrollLeft,
			scrollTop = window.scrollY || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }

	}
	setTimeout(() => {
		animOnScroll();
	}, 300);

}
