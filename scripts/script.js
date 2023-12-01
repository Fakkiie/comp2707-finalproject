// Fetch and display files from the server
document.addEventListener('DOMContentLoaded', function () {
    fetch('php-files/display_files.php')
        .then(response => response.json())
        .then(data => {
            displayFiles(data);
        })
        .catch(error => console.error('Error fetching files:', error));

    // Display the fetched files in the HTML
    function displayFiles(files) {
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        if (uploadedFilesContainer) {
            uploadedFilesContainer.innerHTML = '';

            files.forEach(file => {
                const fileCard = createFileCard(file);
                uploadedFilesContainer.appendChild(fileCard);
            });
        }
    }

    // Create a card element for each file
    // Create a card element for each file
    function createFileCard(file) {
    const fileCard = document.createElement('div');
    fileCard.classList.add('file-upload-card');

    const titleElement = document.createElement('h3');
    titleElement.textContent = file.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = file.description;

    const linkElement = document.createElement('a');

    // Check if file.id is defined before creating the download link
    if (file.id !== undefined) {
        linkElement.href = 'download.php?fileId=' + file.id;
        linkElement.textContent = 'Download';
        linkElement.download = file.file_name;
    } else {
        linkElement.textContent = 'Download (Not Available)';
        linkElement.style.color = 'gray';
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.dataset.fileId = file.id;

    //Append an event listener to the delete button
    deleteButton.addEventListener('click', function () {
        const fileId = this.dataset.fileId;
        deleteFile(fileId);
    });

    fileCard.appendChild(titleElement);
    fileCard.appendChild(descriptionElement);
    fileCard.appendChild(linkElement);
    fileCard.appendChild(deleteButton);

    return fileCard;
    }

    // Function to delete a file
    function deleteFile(fileId) {
    fetch('php-files/delete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: fileId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('File deleted successfully', data);

        const deletedCard = document.querySelector(`.file-upload-card button[data-file-id="${fileId}"]`).parentNode;
        if (deletedCard) {
            deletedCard.remove();
            console.log('File card removed from UI');
        }
    })
    .catch(error => console.error('Error deleting file:', error));
}
});



//Upload form submission
document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');

    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        //Upload file to the server
        fetch('php-files/upload.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            //Redirect to the specified URL after successful upload
            window.location.href = response.url;
        })
        .catch(error => console.error('Error uploading file:', error));
    });
});

//Search tutorials based on user input
function searchTutorials() {
    var input, filter, sections, i, j, resourceItems, resourceLink, resourceDescription, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    sections = document.querySelectorAll('.tutorial-card');

    sections.forEach(function (section) {
        resourceItems = section.querySelectorAll('.resource-item');

        for (i = 0; i < resourceItems.length; i++) {
            resourceLink = resourceItems[i].querySelector('a');
            resourceDescription = resourceItems[i].querySelector('p');
            txtValue = resourceLink.textContent || resourceLink.innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                resourceItems[i].style.display = '';
            } else {
                resourceItems[i].style.display = 'none';
            }
        }
    });
}

document.getElementById('searchInput').addEventListener('input', searchTutorials);

//Validate contact form before submission
function validateForm(event) {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    var nameRegex = /^[a-zA-Z\s]+$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
        console.log("Please enter a valid name");
        event.preventDefault();
        return;
    }

    if (!emailRegex.test(email)) {
        console.log("Please enter a valid email address");
        event.preventDefault();
        return;
    }

    if (message.trim() === "") {
        console.log("Please enter a message");
        event.preventDefault();
        return;
    }

    console.log("Form submitted successfully!");
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        //Check if a delete button was clicked
        if (event.target.classList.contains('delete-button')) {
            //Extract the file ID from the button's data attribute
            const fileId = event.target.dataset.fileId;

            //Call a function to delete data (AJAX request to the server)
            deleteFile(fileId);
        }
    });

    function deleteFile(fileId) {
        //Perform an AJAX request to your server to delete data
        fetch('delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileId: fileId }),
        })
        .then(response => response.json())
        .then(data => {
            //Handle the response
            console.log('File deleted successfully', data);
        })
        .catch(error => console.error('Error deleting file:', error));
    }
});
