/** @format */

let colors = [
	"#e6194b",
	"#3cb44b",
	"#ffe119",
	"#4363d8",
	"#f58231",
	"#911eb4",
	"#46f0f0",
	"#f032e6",
	"#bcf60c",
	"#fabebe",
	"#008080",
	"#e6beff",
	"#9a6324",
	"#fffac8",
	"#800000",
	"#aaffc3",
	"#808000",
	"#ffd8b1",
	"#808080",
	"#ffffff",
];

let DATA =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

fetch(DATA)
	.then((data) => data.json())
	.then((jsonData) => {
		var w = 1000,
			h = 600,
			legendSize = 15;

		let keys = [...new Set(jsonData.children.map((object) => object.name))];

		let colorScale = d3.scaleOrdinal().domain(keys).range(colors);

		let svg = d3
			.select("#chart")
			.append("svg")
			.attr("id", "svg")
			.attr("width", w)
			.attr("height", h);

		let hierarchyData = d3.hierarchy(jsonData);

		hierarchyData = hierarchyData
			.copy()
			.sum((d) => d.value)
			.sort(
				(a, b) =>
					d3.descending(a.data.category, b.data.category) ||
					d3.descending(a.value, b.value)
			);

		d3.treemap().size([w, h])(hierarchyData);

		textSplitter = function (string) {
			let strArr = string.split(" ");
			let newArr = [];
			for (let i = 0; i < strArr.length; i++) {
				if (i % 2 === 0 && i < strArr.length - 1) {
					newArr.push(strArr[i].concat(" " + strArr[i + 1]));
				} else if (i === strArr.length - 1 && i % 2 === 0) {
					newArr.push(strArr[i]);
				}
			}
			return newArr;
		};

		let svgB = svg
			.selectAll("g")
			.data(hierarchyData.leaves())
			.enter()
			.append("g")
			.attr("transform", function (d) {
				return "translate(" + d.x0 + "," + d.y0 + ")";
			});
		//.attr("x", (d) => d.x0)
		//.attr("y", (d) => d.y0);

		svgB
			.append("rect")
			.attr("class", "tile")
			.attr("data-name", (d) => d.data.name)
			.attr("data-category", (d) => d.data.category)
			.attr("data-value", (d) => d.value)
			.attr("stroke", "white")
			.attr("fill", (d) => colorScale(d.data.category))
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.on("mouseover", handleMouseOver)
			.on("mouseout", handleMouseOut);

		function handleMouseOver(event, d) {
			d3.select("#tooltip")
				.attr("data-value", d.value)
				.style("left", event.pageX + "px")
				.style("top", event.pageY + "px")
				.style("opacity", 0.8)
				.html(
					"Name: " +
						d.data.name +
						"<br>Category: " +
						d.data.category +
						"<br>Value: " +
						d.value
				);
		}

		function handleMouseOut(event, d) {
			d3.select("#tooltip").style("opacity", 0);
		}

		let tooltip = d3
			.select("#chart")
			.append("div")
			.attr("id", "tooltip")
			.style("opacity", 0);

		svgB
			.append("text")
			.selectAll("tspan")
			.data(function (d) {
				return textSplitter(d.data.name);
			})
			.enter()
			.append("tspan")
			.attr("class", "rectLabel")
			.attr("x", 5)
			.attr("y", function (d, i) {
				return 15 + i * 10;
			})
			.text(function (d) {
				return d;
			});

		let svgLegend = d3
			.select("#chart")
			.append("svg")
			.attr("id", "legendSvg")
			.attr("width", w)
			.attr("height", h);

		let legend = svgLegend.append("g").attr("id", "legend");

		legend
			.selectAll("rect")
			.data(keys)
			.enter()
			.append("rect")
			.attr("x", (d, i) => {
				return 0.35 * w + (i % 3) * 150;
			})
			.attr("y", function (d, i) {
				return 20 + Math.floor(i / 3) * 30;
			})
			.attr("width", legendSize)
			.attr("height", legendSize)
			.attr("fill", (d) => colorScale(d));

		legend
			.selectAll("text")
			.data(keys)
			.enter()
			.append("text")
			.attr("class", "legendText")
			.attr("x", (d, i) => {
				return legendSize + 5 + 0.35 * w + (i % 3) * 150;
			})
			.attr("y", function (d, i) {
				return legendSize - 3 + 20 + Math.floor(i / 3) * 30;
			})
			.text((d) => d);
	});
