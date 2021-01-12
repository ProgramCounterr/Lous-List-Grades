console.log("LousListGrades' content script is running!");

let courseNames = document.querySelectorAll('td.CourseName'); // returns an array of td elements

function setAttributes(element, attrs) {
    for(key in attrs) {
        element.setAttribute(key, attrs[key]);
    }
}
// UPDATEME: update this with actual chart from VA Grades
// let gradesChart = document.createElement('svg');
// setAttributes(gradesChart, {"width": "50", "height": "50"});
// let circle = document.createElement('circle');
// setAttributes(circle, {"cx": 50, "cy": 50, "r": 40, "stroke": "green", "stroke-width": 4, "fill": "yellow"});
// gradesChart.appendChild(circle);

for(courseName of courseNames) {
    // UPDATEME: update this with actual chart from VA Grades
    let gradesChart = document.createElement('td');
    gradesChart.textContent = "Show grades";

    courseName.parentElement.appendChild(gradesChart);
}