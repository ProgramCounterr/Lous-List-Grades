function makeBarChart(canvasID, chartContainerElement, labels, data, title) {
    //create canvas element
    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('id', canvasID);

    chartContainerElement.classList.add('chart-container');
    
    chartContainerElement.appendChild(canvasElement);

    const ctx = canvasElement.getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'count', 
                data: data,
                backgroundColor: [...labels].fill('rgb(130, 202, 157)'), // make all bars green
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: 26
            },
            maintainAspectRatio: false
        }
    });

    return myChart;
}