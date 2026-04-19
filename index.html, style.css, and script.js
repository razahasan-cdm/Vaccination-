<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaccination Entry System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="container">
        <h2>Children Vaccination Entry</h2>
        
        <form id="vaccineForm">
            <div class="form-grid">
                <input type="text" id="name" placeholder="Child Name" required>
                <input type="text" id="fatherName" placeholder="Father's Name" required>
                <input type="date" id="dob" required>
                <input type="text" id="address" placeholder="Address" required>
            </div>

            <div class="vaccine-dates">
                <label>BCG Date: <input type="date" id="bcg"></label>
                <label>Penta 1: <input type="date" id="penta1"></label>
                <label>Penta 2: <input type="date" id="penta2"></label>
                <label>Penta 3: <input type="date" id="penta3"></label>
                <label>MR 1: <input type="date" id="mr1"></label>
                <label>MR 2: <input type="date" id="mr2"></label>
                <label>DTP: <input type="date" id="dtp"></label>
            </div>

            <button type="submit" class="btn-add">Add Record</button>
            <button type="button" class="btn-export" onclick="exportToExcel()">Download Excel</button>
        </form>

        <hr>

        <div class="table-container">
            <table id="vaccineTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Father Name</th>
                        <th>DOB</th>
                        <th>Age (Mos)</th>
                        <th>Address</th>
                        <th>BCG</th>
                        <th>Penta 1</th>
                        <th>Penta 2</th>
                        <th>Penta 3</th>
                        <th>MR 1</th>
                        <th>MR 2</th>
                        <th>DTP</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
// script.js
const vaccineForm = document.getElementById('vaccineForm');
const tableBody = document.getElementById('tableBody');

vaccineForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const dobValue = new Date(document.getElementById('dob').value);
    const today = new Date();
    
    // Calculate Age in Months
    const ageInMonths = (today.getFullYear() - dobValue.getFullYear()) * 12 + (today.getMonth() - dobValue.getMonth());
    
    // Get values
    const data = {
        name: document.getElementById('name').value,
        father: document.getElementById('fatherName').value,
        dob: document.getElementById('dob').value,
        age: ageInMonths,
        address: document.getElementById('address').value,
        bcg: document.getElementById('bcg').value || "N/A",
        p1: document.getElementById('penta1').value || "N/A",
        p2: document.getElementById('penta2').value || "N/A",
        p3: document.getElementById('penta3').value || "N/A",
        mr1: document.getElementById('mr1').value || "N/A",
        mr2: document.getElementById('mr2').value || "N/A",
        dtp: document.getElementById('dtp').value || "N/A"
    };

    const status = calculateStatus(dobValue, data);
    addRow(data, status);
    vaccineForm.reset();
});

function calculateStatus(dob, data) {
    const today = new Date();
    const diffDays = (today - dob) / (1000 * 60 * 60 * 24);
    const ageMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());

    // Logic for Penta 1 (45 days)
    if (data.p1 === "N/A") {
        if (diffDays > 55) return "Defaulter"; // 45 + 10 days grace
        if (diffDays >= 45) return "Due";
    }

    // Logic for MR 1 (9 months)
    if (data.mr1 === "N/A") {
        if (ageMonths > 9 || (ageMonths === 9 && today.getDate() > 10)) return "Defaulter";
        if (ageMonths === 9) return "Due";
    }

    // Logic for DTP (18 months)
    if (data.dtp === "N/A") {
        if (ageMonths > 18 || (ageMonths === 18 && today.getDate() > 10)) return "Defaulter";
        if (ageMonths === 18) return "Due";
    }

    return ""; // Blank if not due or late
}

function addRow(d, status) {
    const row = `<tr>
        <td>${d.name}</td><td>${d.father}</td><td>${d.dob}</td><td>${d.age}</td>
        <td>${d.address}</td><td>${d.bcg}</td><td>${d.p1}</td><td>${d.p2}</td>
        <td>${d.p3}</td><td>${d.mr1}</td><td>${d.mr2}</td><td>${d.dtp}</td>
        <td class="${status.toLowerCase()}">${status}</td>
    </tr>`;
    tableBody.innerHTML += row;
}

function exportToExcel() {
    const table = document.getElementById("vaccineTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Vaccination_List" });
    XLSX.writeFile(wb, "Vaccination_Report.xlsx");
}
body { font-family: Arial, sans-serif; background-color: #f4f7f6; padding: 20px; }
.container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.vaccine-dates { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; font-size: 0.9em; }
.btn-add { background: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; }
.btn-export { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
.table-container { margin-top: 30px; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f8f9fa; }
.due { background-color: #fff3cd; color: #856404; font-weight: bold; }
.defaulter { background-color: #f8d7da; color: #721c24; font-weight: bold; }
