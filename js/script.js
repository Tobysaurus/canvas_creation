document.addEventListener("DOMContentLoaded", function () {
    const items = [];
    const placedItems = [];
    const images = document.querySelectorAll(".item");
    const overlay = document.querySelector('.image-overlay');
    const overlayImage = document.querySelector('.overlay-image');
    const textbox = document.querySelector('.textbox');

    images.forEach((img, index) => {
        img.onload = function () {
            const dateString = img.getAttribute("data-date");
            const { width, height } = getImageSizeFromDate(dateString, img);
            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
            img.style.opacity = 1; // Make image visible once dimensions are set
            img.style.top = `${Math.random() * (window.innerHeight - height)}px`; // Random top position
            img.style.left = `${Math.random() * (window.innerWidth - width)}px`; // Random left position
        };

        img.src = img.src; // Ensure images are loaded
    });

    // Function to calculate image size based on date
    function getImageSizeFromDate(dateString, img) {
        const today = new Date();
        const imageDate = new Date(dateString);

        const timeDiff = today - imageDate;
        const diffInDays = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

        const minArea = 5000; // Older images
        const maxArea = 25000; // Newest images

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

    // Function to create and add a text item to the page with optional class for styling
    function createTextItem(textContent, className = '', linkHref = '') {
        const textItem = document.createElement('div');
        textItem.classList.add('item', 'text-item'); // Always add base classes

        if (className) {
            textItem.classList.add(className); // Add any additional class like 'italic-text'
        }

        if (linkHref) {
            const link = document.createElement('a');
            link.href = linkHref;
            link.textContent = textContent;
            textItem.appendChild(link); // Append the link inside the div
        } else {
            textItem.textContent = textContent; // Directly set text if no link
        }

        document.body.appendChild(textItem);
        items.push(textItem); // Add the text item to the items array
    }

    // Example of adding normal, italicized, and link text items dynamically
    createTextItem('Architecture portfolio', '', 'https://drive.google.com/file/d/1EcakcLBTHmU2aIF6EBkQ4q43UA_spymR/view?usp=sharing'); // Add a link item
    createTextItem('click this for chaos', 'italic-text'); // Add italicized version
    createTextItem('UI/UX portfolio', '', 'https://drive.google.com/file/d/162EAinzIp3gJpUL3y20MuOvlUyglq4ju/view?usp=sharing'); // Add a link item
    createTextItem('Content editing', '', 'https://www.nationalgallery.sg/'); // Add a link item
    createTextItem('Research report sample', '', 'https://drive.google.com/file/d/1UGQcKoL4quUWV3GaSfVLHWwP7u0Tr6wr/view?usp=sharing');
    createTextItem('Resume', '', 'https://drive.google.com/file/d/1h0WFqV1uw9QhjCt8RV4erWrC_6P8PjSv/view?usp=sharing'); 

    // Add click event listener to refresh the page when "chaos" is clicked
    const chaosText = document.querySelector('.text-item.italic-text');
    if (chaosText) {
        chaosText.addEventListener('click', function () {
            window.location.reload(); // Refresh the page
        });
    }

    // Position text items randomly within the viewport
    items.forEach(item => {
        const itemWidth = item.clientWidth;
        const itemHeight = item.clientHeight;

        let randomX = Math.random() * (window.innerWidth - itemWidth - 20); // Added 20px padding
        let randomY = Math.random() * (window.innerHeight - itemHeight - 20); // Added 20px padding

        item.style.left = `${randomX}px`;
        item.style.top = `${randomY}px`;

        placedItems.push({ x: randomX, y: randomY, width: itemWidth, height: itemHeight });
    });

    // Smooth fade-in animation
    items.forEach(item => item.style.opacity = '1');
});

// code for overlay starts here

document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector('.image-overlay');
    const overlayImage = document.querySelector('.overlay-image');
 // **comment: temporarily removing the entire textbox for now   const textbox = document.querySelector('.textbox');
    const galleryItems = document.querySelectorAll('.item');

    let originalX, originalY, originalWidth, originalHeight; // Define variables in higher scope

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const imageSrc = e.target.src;
     // **      const imageText = e.target.getAttribute('data-text') || '';

            // Show the overlay and update the textbox
     //**       overlay.classList.add("active"); // Ensure overlay is visible
      //**      textbox.textContent = imageText ? imageText : "No description available"; // Update textbox with image text

            // Get original image position and store in global variables
            const rect = e.target.getBoundingClientRect();
            originalX = rect.left + window.scrollX;
            originalY = rect.top + window.scrollY;
            originalWidth = rect.width;
            originalHeight = rect.height;

            // Set overlay image properties
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
                textbox.style.opacity = "1";
            }, 10);
        });
    });


    // Close overlay when clicking outside the image
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            // Animate back to original position
            overlayImage.style.top = `${originalY}px`;
            overlayImage.style.left = `${originalX}px`;
            overlayImage.style.width = `${originalWidth}px`;
            overlayImage.style.height = `${originalHeight}px`;
            overlayImage.style.transform = "translate(0, 0)";

            setTimeout(() => {
                overlay.style.display = "none";
                overlayImage.style.opacity = "0"; // Fade out smoothly
            }, 500);
        }
    });
});
