document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csv-file');
    const csvLabel = document.getElementById('csv-label');
    const excelFileInput = document.getElementById('excel-file');
    const excelLabel = document.getElementById('excel-label');
    const inputPrompt = document.getElementById('input-prompt');

    // inputPrompt.disabled = true;

    // Event listener for CSV file input
    csvFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            csvLabel.textContent = fileName;  // Update label with the file name
            excelFileInput.disabled = true;   // Disable the Excel input
            excelLabel.classList.add('disabled'); // Add disabled class to grey out label
        } else {
            csvLabel.textContent = "Upload CSV File"; // Reset label if no file is selected
            excelFileInput.disabled = false;  // Re-enable the Excel input
            excelLabel.classList.remove('disabled'); // Remove disabled class
        }
    });

    // Event listener for Excel file input
    excelFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            excelLabel.textContent = fileName;  // Update label with the file name
            csvFileInput.value = "";            // Unselect CSV file
            csvLabel.textContent = "Upload CSV File"; // Reset CSV label
            csvFileInput.disabled = true;   // Disable CSV input
            csvLabel.classList.add('disabled'); // Add disabled class to grey out label
        } else {
            excelLabel.textContent = "Upload Excel File"; // Reset label if no file is selected
        }

        // Disable CSV input if Excel file is selected
        csvFileInput.disabled = this.files.length > 0;   
        if (csvFileInput.disabled) {
            csvLabel.classList.add('disabled'); // Add disabled class to grey out label
        } else {
            csvLabel.classList.remove('disabled'); // Remove disabled class
        }
    });
    
    inputPrompt.addEventListener('focus', function() {
        if (this.disabled) {
            alert("Please select a SQL Server and upload a file before entering text."); // Show alert if textarea is disabled
            this.blur(); // Remove focus to prevent typing
        }
    });
});

function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand("copy");
    alert("Copied to clipboard!"); // Optional: alert message
}
