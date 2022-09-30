async function buildPlot() {
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");

    const yMinAccessor = (d) => d.temperatureMin;
    const yMaxAccessor = (d) => d.temperatureHigh;
    // adding const d.temperatureHigh

    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const boundHeight = dimension.boundedHeight + 10
    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yTempLowScaler = d3.scaleLinear()
        .domain(d3.extent(data, yMinAccessor))
        .range([dimension.boundedHeight, 0]);

    const yTempHighScaler = d3.scaleLinear()
        .domain(d3.extent(data, yMaxAccessor))
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0, dimension.boundedWidth]);

    var lineMinGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTempLowScaler(yMinAccessor(d)));

    var lineMaxGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTempHighScaler(yMaxAccessor(d)));

    bounded.append("path")
        .attr("d",lineMinGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","blue")
    // path for min temperature

    bounded.append("path")
        .attr("d",lineMaxGenerator(data))
        .attr("transform","translate(100, 10)")
        .attr("fill","none")
        .attr("stroke","red")
    // path for max temperature

    var x_axis = d3.axisBottom()
        .scale(xScaler);
    // adding x-axis

    var y_axis = d3.axisLeft()
        .scale(yTempLowScaler);
    // adding y-axis

    bounded.append("g")
        .attr("transform", "translate(100, " + boundHeight + ")")
        .call(x_axis);

    bounded.append("g")
        .attr("transform", "translate(100, 10)")
        .call(y_axis);

}

buildPlot();