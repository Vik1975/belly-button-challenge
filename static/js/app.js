//Use the D3 library to read in samples.json from 
//the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then((importData) => {

	console.log(importData);

	var data = importData;

	//Add ID to dropdown menu
	var ids = data.names;

	ids.forEach((ids) => {
		d3.select("#selDataset").append("option").text(ids);
	})

	// Plot default charts for the first element of array
	function init() {

		// Choose data for the first element of array
		sampleData = data.samples[0];
		console.log(sampleData);

		// Select all sample_values, otu_ids and otu_labels of the element
		sampleValue = sampleData.sample_values;
		sampleId = sampleData.otu_ids;
		sampleLabel = sampleData.otu_labels;

		// Select the top 10 OTUs  with their sample_values, otu_ids and otu_labels
		sampleValueTop10 = sampleValue.slice(0, 10).reverse();
		sampleIdTop10 = sampleId.slice(0, 10).reverse();
		sampleLabelTop10 = sampleLabel.slice(0, 10).reverse();

		console.log(sampleIdTop10);
		console.log(sampleIdTop10);
		console.log(sampleLabelTop10);

		// Plot Bar Chart
		
		var traceBar = {
			x: sampleValueTop10,
			y: sampleIdTop10.map(Id => `OTU ${Id}`),
			text: sampleValueTop10,
			type: "bar",
			orientation: "h",
            marker: {
                color: "blue" 
              }
		};

		var barChart = [traceBar];

		var layoutBar = {
			title: ` Top 10 OTUs`,
			width: 450,
			height: 600
		}

		Plotly.newPlot("bar", barChart, layoutBar);

		// Create Bubble Chart
        var colorScale = d3.scaleOrdinal()
  .domain(sampleIdTop10)
  .range(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000']);
        var colors = sampleIdTop10.map(id => colorScale(id));
		var traceBubble = {
			x: sampleIdTop10,
			y: sampleValueTop10,
			text: sampleLabelTop10,
			mode: 'markers',
			marker: {
				color: colors,
				size: sampleValueTop10
			}
		};
		
		var bubbleChart = [traceBubble];
		
		var layoutBubble = {
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"}, 
			
		};
		
		Plotly.newPlot('bubble', bubbleChart, layoutBubble);

		// Get demographic Info
		demoInfo = data.metadata[0]
		console.log(demoInfo);

		//Display each key-value pair from the metadata JSON object somewhere on the page.
		Object.entries(demoInfo).forEach(
			([key, value]) => d3.select("#sample-metadata")
												.append("p").text(`${key.toUpperCase()}: ${value}`));
	
	    
	}
	init();

	d3.selectAll("#selDataset").on("change", updatePlot);

	// Function to update all the plots when a new sample is selected.
	function updatePlot() {

		// Use D3 to select the dropdown menu
			var chooseElement = d3.select("#selDataset");

		// Assign the value of the dropdown menu option to a variable
			var idNo = chooseElement.property("value");
			console.log(idNo);

		// Create dataset based on id chosen
			dataset = data.samples.filter(sample => sample.id === idNo)[0];
			console.log(dataset);

		// Select all sample_values, otu_ids and otu_labels of the selected test ID
			sampleValues = dataset.sample_values;
			sampleIds = dataset.otu_ids;
			sampleLabels= dataset.otu_labels;

		// Select the top 10 OTUs with their sample_values, otu_ids and otu_labels
		top10Values = sampleValues.slice(0, 10).reverse();
		top10Ids = sampleIds.slice(0, 10).reverse();
		top10Labels = sampleLabels.slice(0, 10).reverse();

		// Bar Chart Updated
		var colorsBar = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000'];

        Plotly.restyle("bar", {
            x: [top10Values],
            y: [top10Ids.map(Id => `OTU ${Id}`)],
            text: [top10Labels],
			"marker.color": [colorsBar],
        });
        var colorScale = d3.scaleOrdinal()
        .domain(sampleIdTop10)
        .range(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000']);

        var colors = sampleIds.map(id => colorScale(id));

		// Bubble Chart Updated
		
        Plotly.restyle('bubble', {
            x: [sampleIds],
            y: [sampleValues],
            text: [sampleLabels],
            "marker.color": [colors],
            "marker.size": [sampleValues]
        });
		
		dataInfo = data.metadata.filter(sample => sample.id == idNo)[0];

		// Clear out current contents in the panel
		d3.select("#sample-metadata").html("");

		//Display each key-value pair from the metadata JSON object somewhere on the page.
		Object.entries(dataInfo).forEach(([key, value]) => d3.select("#sample-metadata")
		.append("p").text(`${key}: ${value}`));
        
	}
});
