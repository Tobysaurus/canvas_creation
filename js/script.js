document.addEventListener('DOMContentLoaded', () => {
    const items = Array.from(document.querySelectorAll('.item')); // Store items once
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placedItems = [];

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
            textItem.textContent = textContent;
        }

        document.body.appendChild(textItem);
        items.push(textItem); // Add the text item to the items array
    }

    // Example of adding normal, italicized, and link text items dynamically
    createTextItem('write', '', 'https://www.example.com'); // Add a link item
    createTextItem('chaos', 'italic-text'); // Add italicized version
    createTextItem('record', '', 'https://www.example.com'); // Add a link item
    createTextItem('design', '', 'https://www.example.com'); // Add a link item

    // Add click event listener to refresh the page when "chaos" is clicked
    const chaosText = document.querySelector('.text-item.italic-text');
    if (chaosText) {
        chaosText.addEventListener('click', function () {
            window.location.reload(); // Refresh the page
        });
    }

    items.forEach(item => {
        const itemWidth = item.clientWidth;
        const itemHeight = item.clientHeight;

        // Place the item within the viewport bounds
        let randomX = Math.random() * (viewportWidth - itemWidth - 20); // Added 20px padding to prevent overlap with the edges
        let randomY = Math.random() * (viewportHeight - itemHeight - 20); // Added 20px padding to prevent overlap with the edges

        item.style.left = `${randomX}px`;
        item.style.top = `${randomY}px`;

        placedItems.push({ x: randomX, y: randomY, width: itemWidth, height: itemHeight });
    });

    // Smooth fade-in animation
    requestAnimationFrame(() => {
        items.forEach(item => item.style.opacity = '1');
    });
});
