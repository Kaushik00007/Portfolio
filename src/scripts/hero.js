// hero.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Select hero image element
  const heroImg = document.querySelector(".hero-img img");
  let currentImageIndex = 1; // Tracks current image in sequence
  const totalImages = 10; // Total number of images for cycling
  let scrollTriggerInstance = null; // Stores ScrollTrigger instance for cleanup

  // Cycle through images every 250ms
  setInterval(() => {
    // Increment image index, reset to 1 if it exceeds totalImages
    currentImageIndex =
      currentImageIndex >= totalImages ? 1 : currentImageIndex + 1;
    // Update hero image source
    heroImg.src = `/images/hero/img${currentImageIndex}.jpg`;
  }, 250);

  // Initialize animations with ScrollTrigger
  const initAnimations = () => {
    // Kill existing ScrollTrigger instance to prevent duplicates
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Create new ScrollTrigger instance
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder", // Element that triggers animation
      start: "top bottom", // Animation starts when top of trigger hits bottom of viewport
      end: "top top", // Animation ends when top of trigger hits top of viewport
      onUpdate: (self) => {
        const progress = self.progress; // Scroll progress (0 to 1)
        // Animate hero image properties based on scroll progress
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`, // Move up from -110% to 0%
          scale: 0.25 + 0.75 * progress, // Scale from 0.25 to 1
          rotation: -15 + 15 * progress, // Rotate from -15deg to 0deg
        });
      },
    });
  };

  // Run animations on page load
  initAnimations();

  // Re-run animations on window resize to recalculate trigger points
  window.addEventListener("resize", () => {
    initAnimations();
  });

  // ==========================================
  // Resume Modal Window Controller
  // ==========================================
  const resumeLink = document.querySelector(".resume-link");
  const resumeModal = document.getElementById("resume-modal");
  const resumeCloseBtn = document.getElementById("resume-close-btn");
  const resumeIframe = document.getElementById("resume-iframe");
  const resumeSaveBtn = document.getElementById("resume-save-btn");
  const resumePrintBtn = document.getElementById("resume-print-btn");

  if (resumeLink && resumeModal && resumeCloseBtn && resumeIframe) {
    // Extract Google Drive File ID dynamically from the primary resume-link
    const getDriveId = (url) => {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    };

    const driveId = getDriveId(resumeLink.getAttribute("href"));

    // Intercept clicking the resume link
    resumeLink.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent navigating away to Google Drive

      if (driveId) {
        // Dynamic lazy loading for iframe
        if (resumeIframe.src === "about:blank" || !resumeIframe.src) {
          resumeIframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
        }

        // Dynamic link for Save/Download button
        if (resumeSaveBtn) {
          resumeSaveBtn.href = `https://drive.google.com/uc?export=download&id=${driveId}`;
        }

        // Dynamic behavior for Print button (opens native viewer in separate tab for perfect print)
        if (resumePrintBtn) {
          resumePrintBtn.onclick = () => {
            window.open(`https://drive.google.com/file/d/${driveId}/preview`, "_blank");
          };
        }
      }

      // Lock scrolling using global Lenis instance
      if (window.lenis) {
        window.lenis.stop();
      }

      // Activate the modal window
      resumeModal.classList.add("active");

      // Set initial states for elements
      gsap.set(".resume-modal-overlay", { opacity: 0 });
      gsap.set(".resume-window", {
        opacity: 0,
        scale: 0.3,
        rotation: -15,
        y: 200
      });

      // Animate the background blur/overlay fade
      gsap.to(".resume-modal-overlay", {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      // Animate the window opening: rotates, scales, and bounces slightly into place
      gsap.to(".resume-window", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
      });
    });

    // Close Modal handler with premium reverse animations
    const closeResumeModal = () => {
      // Unlock scrolling
      if (window.lenis) {
        window.lenis.start();
      }

      // Animate window sliding/scaling out
      gsap.to(".resume-window", {
        opacity: 0,
        scale: 0.3,
        rotation: 15,
        y: 200,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
          resumeModal.classList.remove("active");
        }
      });

      // Animate backdrop overlay fading out
      gsap.to(".resume-modal-overlay", {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });
    };

    // Bind close events
    resumeCloseBtn.addEventListener("click", closeResumeModal);

    const overlay = document.querySelector(".resume-modal-overlay");
    if (overlay) {
      overlay.addEventListener("click", closeResumeModal);
    }

    // Close on Escape keypress
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && resumeModal.classList.contains("active")) {
        closeResumeModal();
      }
    });
  }
});
