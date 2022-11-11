async function build() {
    const nodes = await d3.csv("data/nodelist.csv");
    const projs = await d3.csv("data/edge-node.csv");
    const edges = await d3.csv("data/edgelist.csv");

    // console.table(nodes);
    // console.table(edges);
    function adjacencyMatrix(nodes,projs,edges) {
        var matrix = [];
        var edgeHash = {};
        edges.forEach(edge => {
            var id = edge.company+"-"+edge.programms;
            edgeHash[id] = edge;
        })

        for(let i=0; i<nodes.length; i++) {
            for(let j=0; j<projs.length; j++) {
                var uel = nodes[i];
                var bel = projs[j];
                var grid = {
                    id: uel.company+"-"+bel.programms,
                    x:j,
                    y:i,
                    programms: bel.type,
                    weight:0
                }
                if(edgeHash[grid.id]) {
                    grid.weight = parseInt(edgeHash[grid.id].value);
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 350,
            right: 10,
            bottom: 10,
            left: 350
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(nodes,projs,edges);
    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","grid")
        .attr("width",25)
        .attr("height",25)
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .style("fill", d=>d.programms === "satellite" ? "red" : d.programms === "fighter aircraft" ? "black" :
            d.programms === "missile" ? "cyan" : d.programms === "airline" ? "yellow" :
                d.programms === "Joint venture" ? "lime" : d.programms === "spacecraft" ? "darkblue" :
                    d.programms === "space program" ? "purple" : d.programms === "spaceflight company" ? "fuchsia" : "fuchsia")
        .style("fill-opacity", d=>d.weight*0.3)


    // programms text
    const namesX = wrapper
        .append("g")
        .attr("transform","translate(350,330)")
        .selectAll("text")
        .data(projs)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projs=>projs.programms)
        .style("text-anchor","right")
        .attr("transform", "rotate(270)");

    // companies text
    const namesY = wrapper
        .append("g")
        .attr("transform","translate(340,350)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.company)
        .style("text-anchor","end");

    // types text
    const namesX1 = wrapper
        .append("g")
        .attr("transform","translate(350,140)")
        .selectAll("text")
        .data(projs)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projs=>projs.type)
        .style("text-anchor","right")
        .style("","red")
        .attr("transform", "rotate(270)");

    // countries text
    const namesY1 = wrapper
        .append("g")
        .attr("transform","translate(75,350)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.country)
        .style("text-anchor","end");

    const value_text = wrapper
        .append("g")
        .attr("transform","translate(358,368)")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .text(d=>d.weight === 0 ? "" : d.weight)
        .style("text-anchor","center");
}

build();