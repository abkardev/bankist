'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

///////////////////////////////////////
// Modal window
const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//button scrolling
btnScrollTo.addEventListener('click', function(e) {
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect()); //calculate the x,y from current position to the top of viewport

    console.log('Current scroll (x,y)', window.pageXOffset, window.pageYOffset); //count scroll movement x,y calculate thespace from top to current scroll position
    console.log(
        'Hieght/Width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    ); //calculate the viewport size x,y

    //scrolling
    // window.scrollTo(
    //     s1coords.left + window.pageXOffset,
    //     s1coords.top + window.pageYOffset
    // );
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });

    section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////
//page navigation
// document.querySelectorAll('.nav__link').forEach(function(el) {
//     el.addEventListener('click', function(e) {
//         e.preventDefault();
//         const id = this.getAttribute('href');
//         // console.log(id);
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
// });

//event delegation
document.querySelector('.nav__links').addEventListener('click', function(e) {
    e.preventDefault();

    //match strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        // console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

//tapped content
tabsContainer.addEventListener('click', e => {
    const clicked = e.target.closest('.operations__tab');

    //Guard Clause
    if (!clicked) return;
    console.log(clicked);
    //remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

    //Activate tab
    clicked.classList.add('operations__tab--active');

    //activate content
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

//menu fade animation
//if we want add more argument we use this keyword ..if there are more arguments we pass it as array or object ...
const handelHover = function(e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};
//pass an argument into handler ...only pass one argument.
//using bind method to pass this.keyword's value  as an argumnet
nav.addEventListener('mouseover', handelHover.bind(0.5));
nav.addEventListener('mouseout', handelHover.bind(1));

//Sticky Navigation
// const initalCoords = section1.getBoundingClientRect();
// console.log('initalCoords', initalCoords);

// window.addEventListener('scroll', function() {
//     console.log('window.scrollY', window.scrollY);

//     if (window.scrollY > initalCoords.top) nav.classList.add('sticky');
//     else nav.classList.remove('sticky');
// });

//Sticky Navigation Intersection Observer API
// const obsCallBack = function(entries, observer) {
//     entries.forEach(entry => {
//         console.log(entry);
//     });
// };

// const obsOptions = {
//     root: null,
//     threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function(entries) {
    const [entry] = entries;
    console.log(entry);

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal Sections

const revealSection = function(entries, observer) {
    const [entry] = entries;
    console.log(entry);

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

//lazy loading img
const imgTargets = document.querySelectorAll('img[data-src]');
const loading = function(entries, observer) {
    const [entry] = entries;
    console.log(entry);

    if (!entry.isIntersecting) return;

    // replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    });
    observer.observe(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    //create dots
    const createDots = function() {
        slides.forEach(function(_, i) {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activateDot = function(slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));
        document
            .querySelector(`.dots__dot[data-slide="${slide}"`)
            .classList.add('dots__dot--active');
    };
    const goToSlide = function(slide) {
        slides.forEach(
            (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        );
    };

    //next slide
    const nextSlide = function() {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };
    const prevSlide = function() {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }

        goToSlide(curSlide);
        activateDot(curSlide);
    };
    //function
    const init = function() {
        goToSlide(0);
        createDots();
        activateDot(0);
    };
    init();

    //event handler
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'we use cookie for improved functionality and analyrics'

// message.innerHTML = `we use cookie for improved functionality and analyrics. <button class="btn btn--close-cookie">Go it!</button>`;
// header.prepend(message); //insert or move element as first child
header.append(message); //insert or move element as last child
// header.append(message.cloneNode(true));

// header.before(message); //add before element as sibiling
// header.after(message); //add after element as sibiling

//delete elements
// document
//     .querySelector('.btn--close-cookie')
//     .addEventListener('click', function() {
//         // message.remove();
//         //other way to delete
//         message.parentElement.removeChild(message);
//     });

//styling

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// message.style.height = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// message.style.height =
//     Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
// document.documentElement.style.setProperty('--color-primary', 'lightblue');

//Attributes

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//non-standered
//if attrebute undifined , we use getAttribute

console.log(logo.designer);
console.log(logo.getAttribute('designer'));
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//attribute data
console.log(logo.dataset.versionNumber);

//classes

logo.classList.add('c', 'd'); //we can add more classes at once
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//dont use
// logo.className ='';

//add and remove event listener
// const h1 = document.querySelector('h1');
// const h1Alert = function() {
//     alert('you are reading the headline');
//     alert('the second event type');
//     // h1.removeEventListener('mouseenter', h1Alert);
// };

// h1.addEventListener('mouseenter', h1Alert);
// h1.addEventListener('mouseenter', function(e) {
//     alert('you are reading the headline');
// });

// h1.onmouseenter = function(e) {
//     alert('the second event type');
// };

//other way to remvove event
// setTimeout(() => h1.removeEventListener('mouseenter', h1Alert), 3000);

//event propagation in practise
// const randomInt = (min, max) =>
//     Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//     `rgba(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)}`;

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Link', e.currentTarget);
//     //stop propagation
//     // e.stopPropagation(); it's not good idea to practice stop propagation ..use it only if you want to fix bug in complex app
// });
// document.querySelector('.nav__links').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Links', e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function(e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Nav', e.currentTarget);
// });

//DOM Traversing
const h1 = document.querySelector('h1');

//Going downwards : child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'grey';

//going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
//it's going to be used many times for event delegation ..closest it using for find parent
// h1.closest('.header').style.background = 'var(--color-secondary)';
// h1.closest('h1').style.background = 'var(--color-primary)';

//going sideways :siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);
console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el) {
//     if (el !== h1) el.style.transform = 'scale(0.5)';
// });