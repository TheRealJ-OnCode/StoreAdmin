// controlSliderButtons = () => {
//     const slider = this.getElement(".slider");
//     const slides = this.getAllElement(".slide");
//     let currentSlide = 0;
//     this.getElement(".slide-right").addEventListener("click", nextSlide)
//     this.getElement(".slide-left").addEventListener("click", prevSlide)
//     this.getElement(".back-to-edit").addEventListener("click", this.backToEdit)
//     function updateSlide() {
//         slider.style.transform = `translateX(${-currentSlide * 100}%)`;
//     }
//     function nextSlide() {
//         currentSlide = (currentSlide + 1) % slides.length;
//         updateSlide()
//
//     }
//     function prevSlide() {
//         if (currentSlide > 0) {
//             currentSlide = (currentSlide - 1) % slides.length
//             updateSlide()
//         }
//
//
//     }
// }
//
//controlSliderButtons()
//
