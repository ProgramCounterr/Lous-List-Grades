console.log("LousListGrades' content script is running!"); // DEBUGGING

const courseNameElements = document.querySelectorAll('td.CourseName'); // returns an array of td elements

// TODO: add some type of storage


for(courseNameElement of courseNameElements) {
    // add a button to each course that will show grades when clicked
    const showGradesButton = document.createElement('button');
    showGradesButton.textContent = "Show Grades";

    showGradesButton.addEventListener('click', (e) => {
        // get course number without any whitespace (e.g. 'CS1110')
        let courseNum = (e.target).parentElement // get td.CourseName element of the clicked button
            .previousElementSibling.textContent.replace(' ', '').trim();
        const chartRowElement = (e.target).parentElement.parentElement // course row (that contains courseNum and courseName elements)
            .nextElementSibling.nextElementSibling;
        
        if(showGradesButton.textContent === "Show Grades") {
            showGradesButton.textContent = "Hide Grades";
            if(!chartRowElement.firstElementChild) {// if chart has not been rendered yet
                chartRowElement.textContent = "Loading grade data..."; // change just the plain text in the row element
            }
            chartRowElement.style.display = "block";
            
            //TODO: check if course is in storage
             // course not cached
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


            const gradeLabels = {
                'A+': 4.0, 'A':4.0, 'A-':3.7, 
                'B+': 3.3, 'B': 3.0, 'B-': 2.7, 
                'C+': 2.3, 'C': 2.0, 'C-': 1.7, 
                'D+': 1.3, 'D': 1.0, 'D-': 0.7, 
                'DR': 0.0, 'F': 0.0, 'W': 0.0
            };
            async function fetchCourseJSON(courseNum) {
                const response = await fetch('http://localhost/projects/lous-list-grades/' + courseNum + '.php');
                if(response.ok) {
                    const course = await response.json();
                    return course;
                }
                else {
                    throw new Error('ERROR:', response.statusText);
                }
            }
            let sectionNum = 0;
            fetchCourseJSON(courseNum).then(course => {
                if(course.sections.length > 0) {
                    chartRowElement.childNodes[0].nodeValue = ""; // just change plain text - setting textContent would remove child nodes

                    if(!chartRowElement.firstElementChild) { // check that chart doesn't already exists
                        //create canvas element
                        const canvasElement = document.createElement('canvas');
                        canvasElement.setAttribute('id', courseNum);
                        // create responsive container element
                        const chartContainerElement = document.createElement('td');
                        chartContainerElement.classList.add('chart-container');
                        chartContainerElement.style.cssText = "position: relative; height: 20px; width: 200px;";
                        chartContainerElement.style.height = "40vh";
                        chartContainerElement.style.width = "40vw";
                        // append elements
                        chartContainerElement.appendChild(canvasElement);
                        chartRowElement.appendChild(chartContainerElement);
                    }
                    
                    let section = course.sections[sectionNum];
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

                    const ctx = document.getElementById(courseNum).getContext('2d');
                    let myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(gradeLabels),
                            datasets: [{
                                label: 'count', 
                                data: sectionGradeDistr.distr,
                                backgroundColor: [...Object.keys(gradeLabels)].fill('rgb(130, 202, 157)'), // make all bars green
                                borderWidth: 1
                            }]
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'GPA: ' + sectionGradeDistr.gpa,
                                fontSize: 26
                            },
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });

                }
                else {
                    chartRowElement.textContent = 'No data for this course available';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                chartRowElement.textContent = 'No data available for this class';
            });
            
        }

        else if(showGradesButton.textContent === "Hide Grades") {
            showGradesButton.textContent = "Show Grades";
            // hide the chart
            chartRowElement.style.display = "none";
        }
        e.stopPropagation(); // do not activate click event of any parent elements of the button
    });
    showGradesButton.style.cssText = "float: right; cursor: pointer";

    courseNameElement.appendChild(showGradesButton);
}