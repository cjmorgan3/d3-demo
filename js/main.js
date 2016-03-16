/* 575 boilerplate main.js */
//execute script when window is loaded
window.onload = function(){
	var w = 900, h = 500;

    //container block
    var container = d3.select("body") //get the <body> element from the DOM
    	.append("svg") //put a new svg in the body
        .attr("width", w) //assign the width
        .attr("height", h) //assign the height
        .attr("class", "container") //always assign a class (as the block name) for styling and future selection

    //rectangle block
    var rectangle = container.append("rect") //put a new rect in the svg
    	.datum(400)
    	.attr("width", function(d) { //rect width
    		return d*2;
    	})
    	.attr("height", function(d){ //rect height
    		return d;
    	})
    	.attr("class", "rectangle")
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50); //position from top on the y (vertical) axis
	console.log(container);

    //array of Vermont cities and their populations
    var cityPop = [
        {
            city: 'Rutland',
            population: 16495
        },
        { 
            city: 'Burlington',
            population: 42417
        },
        {
            city: 'Montpelier',
            population: 7855
        },
        {
            city: 'Barre',
            population: 9052
        }
    ];

    var x = d3.scale.linear() //create the scale
        .range([90, 740]) //output min and max
        .domain([0, 3]); //input min and max

    //find the minimum value of the array
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });

    //find the maximum value of the array
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });

    //scale for circles center y coordinate
    var y = d3.scale.linear()
        .range([450, 95])
        .domain([0, 50000]); //was minPop, maxPop

    //set the colors based on a gradient
    var color = d3.scale.linear()
        .range([
            "#ffe066",
            "#ffcc00"
        ])
        .domain([
            minPop, 
            maxPop
        ]);


    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") //inspect the HTML--holy crap, there's some circles there
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.1;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the scale generator with the index to place each circle horizontally
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.population);
        })
        .style("fill", function(d, i){ //add a fill based on the color scale generator
            return color(d.population);
        })
        .style("stroke", "#000"); //black circle stroke

    //create y axis generator
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    //create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);
    
    //create a text element and add the title
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("City Populations of Vermont");

    //create circle labels
    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population);
        });

    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.1 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });

    //create format generator
    var format = d3.format(",");

    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            return x(i) + Math.sqrt(d.population * 0.1 / Math.PI) + 5;
        })
        .attr("dy", "15") //vertical offset
        .text(function(d){
            return "Pop. " + format(d.population); //use format generator to format numbers
        });

    yAxis(axis);
};