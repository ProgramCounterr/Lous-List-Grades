console.log("LousListGrades' content script is running!"); // DEBUGGING

let courseNames = document.querySelectorAll('td.CourseName'); // returns an array of td elements

// TODO: replace with some type of storage
let courses = {};

for(courseName of courseNames) {
    // add a button to each course that will show grades when clicked
    let showGradesButton = document.createElement('button');
    showGradesButton.textContent = "Show Grades"
    showGradesButton.addEventListener('click', (e) => {
        if(showGradesButton.textContent === "Show Grades") {
            showGradesButton.textContent = "Hide Grades";
            // TODO: render with actual chart from VA Grades
            // get course number without any whitespace (e.g. 'CS1110')
            let courseNum = (e.target).parentElement // get td.CourseName element of the clicked button
                .previousElementSibling.textContent.replace(' ', '').trim();
            let course = {};
            if(courses.hasOwnProperty(courseNum)) { // course is cached
                course = courses[courseNum];
            }
            else { // course not cached
                // FIXME: Error 429 Too Many Requests
                // fetch('https://cors-anywhere.herokuapp.com/https://vagrades.com/api/uvaclass/' + courseNum)
                //     .then(response => {
                //         if(response.ok)
                //             return response.json();
                //         else
                //             throw new Error('Something went wrong');
                //     })
                //     .then(data => {
                //         course = data;
                //         download(data, 'json.txt', 'text/plain');
                //         courses[courseNum] = course;
                //     });
                

                // REMOVE: for development purposes only (limit API calls)
                courseNum = 'CS2501';
                fetch('http://localhost/projects/lous-list-grades/' + courseNum + '.php')
                    .then(response => {
                        console.log(response); // DEBUGGING
                        if(response.ok)
                            return response.json();
                        else
                            throw new Error('ERROR:', response.statusText);
                    })
                    .then(data => {
                        course = data;
                        courses[courseNum] = course;
                    });

            }
            console.log('Course object:', course); // DEBUGGING
        }

        else if(showGradesButton.textContent === "Hide Grades") {
            showGradesButton.textContent = "Show Grades";
            // TODO: hide the chart
        }
        console.log('Courses object:', courses); // DEBUGGING
        e.stopPropagation(); // do not activate click event of any parent elements of the button
    });
    showGradesButton.style.cssText = "float: right; cursor: pointer";

    courseName.appendChild(showGradesButton);
}