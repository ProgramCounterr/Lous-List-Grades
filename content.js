console.log("LousListGrades' content script is running!"); // DEBUGGING

let courseNames = document.querySelectorAll('td.CourseName'); // returns an array of td elements

// REMOVE?
// function setAttributes(element, attrs) {
//     for(key in attrs) {
//         element.setAttribute(key, attrs[key]);
//     }
// }

for(courseName of courseNames) {
    // add a button to each course that will show grades when clicked
    let showGradesButton = document.createElement('button');
    showGradesButton.textContent = "Show Grades"
    showGradesButton.addEventListener('click', (e) => {
        console.log(e.target);
        if(showGradesButton.textContent === "Show Grades") {
            showGradesButton.textContent = "Hide Grades";
            // TODO: render with actual chart from VA Grades
            // get course number without any whitespace (e.g. 'CS1110')
            let courseNum = (e.target).parentElement // get td.CourseName element of the clicked button
                .previousElementSibling.textContent.replace(' ', '').trim();
            let course = {};
            // FIXME: Error 429 Too Many Requests
            fetch('https://cors-anywhere.herokuapp.com/https://vagrades.com/api/uvaclass/' + courseNum)
                .then(response => response.json())
                .then(data => {
                    course = data;
                    console.log(course); // DEBUGGING
                });
        }
        else if(showGradesButton.textContent === "Hide Grades") {
            showGradesButton.textContent = "Show Grades";
            // TODO: hide the chart
        }
        e.stopPropagation(); // do not activate click event of any parent elements of the button
    });
    showGradesButton.style.cssText = 
        "float: right; text-decoration: underline; color: blue; outline: none; border: none; background-color: transparent; cursor: pointer";

    courseName.appendChild(showGradesButton);
}