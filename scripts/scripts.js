$(document).ready(function () {
    let currentIndex = 0;
    const slides = $('.slide');
    const dots = $('.dot');
    const totalSlides = slides.length;
  
    function showSlide(index) {
      slides.removeClass('active').eq(index).addClass('active');
      dots.removeClass('active').eq(index).addClass('active');
      currentIndex = index;
    }
  
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % totalSlides;
      showSlide(nextIndex);
    }
  
    let timer = setInterval(nextSlide, 3000);
  
    dots.on('click', function () {
      const index = $(this).data('index');
      showSlide(index);
      clearInterval(timer);
      timer = setInterval(nextSlide, 3000); // reset timer
    });

    $(".gallery-img").click(function () {
        let src = $(this).attr("src");
        let caption = $(this).data("caption");
        $("#overlay-img").attr("src", src);
        $("#caption-text").text(caption);
        $("#overlay").fadeIn();
      });
      
      $("#close, #overlay").click(function (e) {
        // Avoid closing when clicking on images or text
        if (e.target.id === "overlay" || e.target.id === "close") {
          $("#overlay").fadeOut();
        }
      });
      
  });
  