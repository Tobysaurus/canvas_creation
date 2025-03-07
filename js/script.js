document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".item");
    const overlay = document.querySelector(".image-overlay");
    const overlayImage = document.querySelector(".overlay-image");
    const textbox = document.querySelector(".textbox");

    // No scrolling => topBarHeight for name offset if desired
    const topBarHeight = 0;

    // =============== 1. Positioning Images ===============
    images.forEach((img) => {
        img.onload = function () {
            const dateString = img.getAttribute("data-date");
            const { width, height } = getImageSizeFromDate(dateString, img);

            // set image's width & height
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            img.style.opacity = 1;

            // random top => clamp so image is fully on screen
            let randomTop = topBarHeight + Math.random() * (window.innerHeight - height - 20 - topBarHeight);
            let randomLeft = Math.random() * (window.innerWidth - width - 20);

            // ensure no negative positions if the screen is small
            randomTop = Math.max(0, randomTop);
            randomLeft = Math.max(0, randomLeft);

            img.style.top = `${randomTop}px`;
            img.style.left = `${randomLeft}px`;
        };
        // Force the browser to re-check the image
        img.src = img.src;
    });

    // =============== 2. Calculating Image Size by Date ===============
    function getImageSizeFromDate(dateString, img) {
        const today = new Date();
        const imageDate = new Date(dateString);

        const timeDiff = today - imageDate;
        const diffInDays = timeDiff / (1000 * 3600 * 24);

        const minArea = 5000;
        const maxArea = 25000;
        const scaledArea =
            minArea + (maxArea - minArea) * Math.max(0, 1 - diffInDays / 3650);

        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let width = Math.sqrt(scaledArea * aspectRatio);
        let height = width / aspectRatio;

        const maxWidth = window.innerWidth * 0.2;
        const maxHeight = window.innerHeight * 0.3;

        width = Math.min(Math.max(width, 150), maxWidth);
        height = Math.min(Math.max(height, 150), maxHeight);

        return { width, height };
    }

    // =============== 3. "Chaos" Text (Optional) ===============
    function createTextItem(textContent, className = "", linkHref = "") {
        const textItem = document.createElement("div");
        textItem.classList.add("item", "text-item");

        if (className) {
            textItem.classList.add(className);
        }
        if (linkHref) {
            const link = document.createElement("a");
            link.href = linkHref;
            link.textContent = textContent;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            textItem.appendChild(link);
        } else {
            textItem.textContent = textContent;
        }
        document.body.appendChild(textItem);
    }

    // Add the "remix" text
    createTextItem("remix", "italic-text");

    // Position it randomly
    const textItems = document.querySelectorAll(".text-item");
    textItems.forEach((textItem) => {
        const tw = textItem.clientWidth;
        const th = textItem.clientHeight;
        let rx = Math.random() * (window.innerWidth - tw - 20);
        let ry = topBarHeight + Math.random() * (window.innerHeight - th - 20 - topBarHeight);

        rx = Math.max(0, rx);
        ry = Math.max(0, ry);

        textItem.style.left = `${rx}px`;
        textItem.style.top = `${ry}px`;
        textItem.style.opacity = "1";
    });

    // "Chaos" => re-randomize images
    const chaosText = document.querySelector(".text-item.italic-text");
    if (chaosText) {
        chaosText.addEventListener("click", function () {
            const imagesToShuffle = document.querySelectorAll(".item:not(.text-item)");
            imagesToShuffle.forEach((img) => {
                const w = parseFloat(img.style.width) || 50;
                const h = parseFloat(img.style.height) || 50;

                let newTop = Math.random() * (window.innerHeight - h - 20 - topBarHeight);
                let newLeft = Math.random() * (window.innerWidth - w - 20);

                newTop = Math.max(0, newTop);
                newLeft = Math.max(0, newLeft);

                img.style.top = `${newTop}px`;
                img.style.left = `${newLeft}px`;
            });
        });
    }

    // =============== 4. Overlay for Enlarged Images ===============
    let originalX, originalY, originalWidth, originalHeight;
    const galleryItems = document.querySelectorAll(".item");

    galleryItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            if (e.target.tagName !== "IMG") return;

            const imageSrc = e.target.src;
            const rect = e.target.getBoundingClientRect();
            originalX = rect.left + window.scrollX;
            originalY = rect.top + window.scrollY;
            originalWidth = rect.width;
            originalHeight = rect.height;

            overlayImage.src = imageSrc;
            overlayImage.style.position = "absolute";
            overlayImage.style.top = `${originalY}px`;
            overlayImage.style.left = `${originalX}px`;
            overlayImage.style.width = `${originalWidth}px`;
            overlayImage.style.height = `${originalHeight}px`;
            overlayImage.style.transformOrigin = "center center";
            overlayImage.style.opacity = "1";

            // Show overlay
            overlay.style.display = "flex";

            // Animate to center
            setTimeout(() => {
                overlayImage.style.top = "50%";
                overlayImage.style.left = "50%";
                overlayImage.style.width = "80vw";
                overlayImage.style.height = "auto";
                overlayImage.style.transform = "translate(-50%, -50%) scale(1)";
                if (textbox) textbox.style.opacity = "1";
            }, 10);
        });
    });

    // Close overlay when clicking outside
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlayImage.style.top = `${originalY}px`;
            overlayImage.style.left = `${originalX}px`;
            overlayImage.style.width = `${originalWidth}px`;
            overlayImage.style.height = `${originalHeight}px`;
            overlayImage.style.transform = "translate(0, 0)";

            setTimeout(() => {
                overlay.style.display = "none";
                overlayImage.style.opacity = "0";
            }, 500);
        }
    });

    // =============== 5. Slide-Out Menu Logic ===============
    const menuButton = document.querySelector('.menu-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuContent = document.querySelector('.menu-content');
    const closeButton = document.querySelector('.close-button');

    // Open the menu
    menuButton.addEventListener('click', () => {
        menuOverlay.classList.add('open');
        menuButton.classList.add('hide');
    });

    // Close the menu (X)
    closeButton.addEventListener('click', () => {
        menuOverlay.classList.remove('open');
        menuButton.classList.remove('hide');
    });

    // Close if user clicks outside .menu-content
    menuOverlay.addEventListener('click', (e) => {
        if (!menuContent.contains(e.target) && e.target !== closeButton) {
            menuOverlay.classList.remove('open');
            menuButton.classList.remove('hide');
        }
    });
});
