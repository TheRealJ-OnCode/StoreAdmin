import {getElement,getAllElement} from "../helpers/DOM.utils";
export const controlSliderButtons = () => {
        const slider = getElement(".slider");
        const slides = getAllElement(".slide");
        let currentSlide = 0;
        getElement(".slide-right").addEventListener("click", nextSlide)
        getElement(".slide-left").addEventListener("click", prevSlide)

        function updateSlide() {
            slider.style.transform = `translateX(${-currentSlide * 100}%)`;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlide()

        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide = (currentSlide - 1) % slides.length
                updateSlide()
            }


        }
    }