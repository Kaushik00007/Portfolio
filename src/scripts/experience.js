// experience.js

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = [];

  const initAnimations = () => {
    if (window.innerWidth <= 1000) {
      scrollTriggerInstances.forEach((instance) => {
        if (instance) instance.kill();
      });
      scrollTriggerInstances = [];
      return;
    }

    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    const experiences = gsap.utils.toArray(".experience-card");
    if (experiences.length === 0) return;

    const mainTrigger = ScrollTrigger.create({
      trigger: experiences[0],
      start: "top 40%",
      endTrigger: experiences[experiences.length - 1],
      end: "top 150%",
    });
    scrollTriggerInstances.push(mainTrigger);

    experiences.forEach((experience, index) => {
      const isLastCard = index === experiences.length - 1;
      const cardInner = experience.querySelector(".experience-card-inner");

      if (!isLastCard) {
        const pinTrigger = ScrollTrigger.create({
          trigger: experience,
          start: "top 35%",
          endTrigger: ".contact-cta",
          end: "top 90%",
          pin: true,
          pinSpacing: false,
        });
        scrollTriggerInstances.push(pinTrigger);

        const scrollAnimation = gsap.to(cardInner, {
          y: `-${(experiences.length - index) * 14}vh`,
          ease: "none",
          scrollTrigger: {
            trigger: experience,
            start: "top 35%",
            endTrigger: ".contact-cta",
            end: "top 90%",
            scrub: true,
          },
        });
        scrollTriggerInstances.push(scrollAnimation.scrollTrigger);
      }
    });
  };

  initAnimations();

  // Certificate button animations
  const certButtons = document.querySelectorAll(".view-cert-btn");
  certButtons.forEach(btn => {
    const aside = btn.closest(".experience-card-aside");
    const cert = aside.querySelector(".experience-card-certificate");
    gsap.set(cert, { xPercent: -50, yPercent: -50 });

    btn.addEventListener("click", () => {
      const logo = aside.querySelector(".experience-card-logo");
      
      const isShowingCert = btn.innerText.toUpperCase().includes("BACK");
      
      if (!isShowingCert) {
        // Swipe UP animation
        gsap.to(logo, { 
          y: -150, 
          opacity: 0, 
          scale: 0.9,
          duration: 0.6, 
          ease: "power2.inOut" 
        });
        
        gsap.fromTo(cert, 
          { yPercent: 50, opacity: 0, scale: 0.9 },
          { 
            yPercent: -50, 
            opacity: 1, 
            scale: 1, 
            xPercent: -50,
            duration: 0.6, 
            ease: "power2.inOut", 
            pointerEvents: "all" 
          }
        );
        btn.innerText = "BACK TO LOGO";
      } else {
        // Swipe DOWN animation back
        gsap.to(logo, { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.6, 
          ease: "power2.inOut" 
        });
        
        gsap.to(cert, { 
          yPercent: 50, 
          opacity: 0, 
          scale: 0.9,
          xPercent: -50,
          duration: 0.6, 
          ease: "power2.inOut", 
          pointerEvents: "none" 
        });
        btn.innerText = "VIEW CERTIFICATE";
      }
    });
  });

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
