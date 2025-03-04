document.addEventListener("DOMContentLoaded", function () {
    const items = [];
    const placedItems = [];
    const images = document.querySelectorAll(".item");
    const overlay = document.querySelector(".image-overlay");
    const overlayImage = document.querySelector(".overlay-image");
    const textbox = document.querySelector(".textbox");

    // We define the height of the top bar
    const topBarHeight = 60; // same as .top-bar height in CSS

    // =============== 1. Positioning Images ===============
    images.forEach((img) => {
        img.onload = function () {
            const dateString = img.getAttribute("data-date");
            const { width, height } = getImageSizeFromDate(dateString, img);

            // set image's width & height
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            img.style.opacity = 1;

            // random top, ensuring images appear BELOW the top bar
            const randomTop = topBarHeight + Math.random() * (window.innerHeight - topBarHeight - height - 20);
            // random left
            const randomLeft = Math.random() * (window.innerWidth - width - 20);

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
        const scaledArea = minArea + (maxArea - minArea) * Math.max(0, 1 - diffInDays / 3650);

        const aspectRatio = img.naturalWidth / img.naturalHeight;
        let width = Math.sqrt(scaledArea * aspectRatio);
        let height = width / aspectRatio;

        const maxWidth = window.innerWidth * 0.2;
        const maxHeight = window.innerHeight * 0.3;

        width = Math.min(Math.max(width, 150), maxWidth);
        height = Math.min(Math.max(height, 150), maxHeight);

        return { width, height };
    }

    // =============== 3. Creating Text Items Dynamically ===============
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
        items.push(textItem);
    }

    // Only “click this for chaos” is random. 
    // The top links are in .top-bar (HTML).
    createTextItem("click this for chaos", "italic-text");

    // =============== 4. "click this for chaos" => re-randomize images only ===============
    const chaosText = document.querySelector(".text-item.italic-text");
    if (chaosText) {
        chaosText.addEventListener("click", function () {
            // Re-randomize positions for all images (but not text items).
            const imagesToShuffle = document.querySelectorAll(".item:not(.text-item)");
            imagesToShuffle.forEach((img) => {
                const w = parseFloat(img.style.width) || 50;
                const h = parseFloat(img.style.height) || 50;

                // random top => below top bar
                const newTop = topBarHeight + Math.random() * (window.innerHeight - topBarHeight - h - 20);
                const newLeft = Math.random() * (window.innerWidth - w - 20);

                img.style.top = `${newTop}px`;
                img.style.left = `${newLeft}px`;
            });
        });
    }

    // =============== 5. Position the newly created text item below top bar ===============
    const textItems = document.querySelectorAll(".text-item");
    textItems.forEach((textItem) => {
        // skip if it's in top bar (not applicable here, but just in case)
        const tw = textItem.clientWidth;
        const th = textItem.clientHeight;

        const rx = Math.random() * (window.innerWidth - tw - 20);
        const ry = topBarHeight + Math.random() * (window.innerHeight - topBarHeight - th - 20);

        textItem.style.left = `${rx}px`;
        textItem.style.top = `${ry}px`;
        textItem.style.opacity = "1";
    });

    // =============== 6. Overlay for Enlarged Images ===============
    let originalX, originalY, originalWidth, originalHeight;

    const galleryItems = document.querySelectorAll(".item");
    galleryItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            // Ensure we clicked an actual image
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

    // Close overlay when clicking outside the enlarged image
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
});
