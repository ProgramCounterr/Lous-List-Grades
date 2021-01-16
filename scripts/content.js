const courseNameElements = document.querySelectorAll('td.CourseName'); // returns an array of td elements

// TODO: add some type of storage


for(courseNameElement of courseNameElements) {
    // add a button to each course that will show grades when clicked
    const showGradesButton = document.createElement('button');
    showGradesButton.classList.add('show-grades');
    showGradesButton.textContent = "Show Grades";

    showGradesButton.addEventListener('click', (e) => {
        // get course number without any whitespace (e.g. 'CS1110')
        let courseNum = (e.target).parentElement // get td.CourseName element of the clicked button
            .previousElementSibling.textContent.replace(' ', '').trim();
        const rowElement = (e.target).parentElement.parentElement // course row (that contains courseNum and courseName elements)
            .nextElementSibling.nextElementSibling;
        
        if(showGradesButton.textContent === "Show Grades") {
            showGradesButton.textContent = "Hide Grades";
            rowElement.style.display = "table-row"; // show rowElement

            if(!rowElement.firstElementChild) { // if nothing has been appended to rowElement yet
                const cell = document.createElement('td');
                cell.setAttribute('colspan', '8');
                rowElement.appendChild(cell);
                cell.textContent = "Loading grade data..."; // change just the plain text in the row element
            
                //TODO: check if course is in storage
                // course not cached
                    // FIXME: Error 429 Too Many Requests
                    // fetch(`https://cors-anywhere.herokuapp.com/https://vagrades.com/api/uvaclass/${courseNum}`)
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

                const gradeLabels = {
                    'A+': 4.0, 'A':4.0, 'A-':3.7, 
                    'B+': 3.3, 'B': 3.0, 'B-': 2.7, 
                    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 
                    'D+': 1.3, 'D': 1.0, 'D-': 0.7, 
                    'DR': 0.0, 'F': 0.0, 'W': 0.0
                };

                async function fetchCourseJSON(courseNum) {
                    const response = await fetch(`http://localhost/projects/lous-list-grades/${courseNum}.php`);
                    if(response.ok) {
                        const course = await response.json();
                        return course;
                    }
                    else {
                        throw new Error('ERROR:', response.statusText);
                    }
                }
                fetchCourseJSON(courseNum).then(course => {
                    if(course.sections.length > 0) {
                        rowElement.textContent = ""; // remove child nodes
                        
                        // get section data from course object
                        let section = course.sections[course.sections.length-1];
                        let sectionGradeDistr = (() => { // get grade distribution and gpa
                            let gpa = 0;
                            let totalCount = 0;
                            let gradeDistr = [];
                            for([letter, weight] of Object.entries(gradeLabels)) {
                                gradeDistr.push(section[letter]);
                                if(letter !== 'DR' && letter !== 'W') {
                                    gpa += weight * section[letter];
                                    totalCount += section[letter];
                                }
                            }
                    
                            gpa /= totalCount;
                            gpa = Math.round((gpa + Number.EPSILON) * 100) / 100; // round to 2 decimal places (if necessary)
                    
                            return {'gpa': gpa, 'distr': gradeDistr};
                        })();

                        // create the select element next to the chart container
                        const selectContainerElement = document.createElement('td');
                        selectContainerElement.setAttribute('colspan', '4');
                        const selectElement = document.createElement('select');
                        selectElement.classList.add('section-picker');
                        for(let section of course.sections) {
                            // e.g. section.semester = "Fall2011"
                            // arrange semester with year in front
                            let semester = (() => {
                                let semester = section.semester;
                                // NOTE: atm, only data for Fall and Spring semesters are accessible
                                if(semester.indexOf("Fall") == 0) {
                                    let year = semester.slice(4);
                                    semester = `${year} Fall`;
                                }
                                else if(semester.indexOf("Spring") == 0) {
                                    let year = semester.slice(6);
                                    semester = `${year} Spring`;
                                }
                                return semester;
                            })();
                            const option = document.createElement('option');
                            option.textContent = `${semester} Section ${section.section} ${section.instructor}`;
                            selectElement.appendChild(option);
                        }
                        // have last section selected by default
                        selectElement.children[selectElement.children.length-1].selected = true;
                        // append
                        selectContainerElement.appendChild(selectElement);
                        rowElement.appendChild(selectContainerElement);

                        // setup chart
                        const chartContainerElement = document.createElement('td');
                        chartContainerElement.setAttribute('colspan', '4');
                        // make chart element and append to rowElement
                        makeBarChart(courseNum, chartContainerElement, rowElement, 
                        Object.keys(gradeLabels), sectionGradeDistr.distr, `GPA: ${sectionGradeDistr.gpa}`);

                    } 
                    else { // course object has no sections
                        cell.textContent = 'No data for this course available';
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    cell.textContent = 'Unable to retrieve data for this class';
                });
            }
        }

        else if(showGradesButton.textContent === "Hide Grades") { // if chart is already showing
            showGradesButton.textContent = "Show Grades";
            // hide the chart
            rowElement.style.display = "none";
        }
        e.stopPropagation(); // do not activate click event of any parent elements of the button
    });

    courseNameElement.appendChild(showGradesButton);
}