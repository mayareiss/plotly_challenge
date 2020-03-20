
function inID(){
    var selectID = d3.select("#selDataset");
    d3.json("data/samples.json").then((sampleData)=>{
        var sampleNames = sampleData.names;
        sampleNames.forEach((x)=>{
            selectID.append("option").text(x).property("value",x);
        });

        var sampleOne = sampleNames[0];
        buildDemographics(sampleOne);
    });
}

function buildDemographics(sampleName){
    d3.json("data/samples.json").then((sampleData)=>{
        var metaData = sampleData.metadata;
        var results = metaData.filter(y => y.id == sampleName)
        console.log(results);
        var result = results[0];
        var demoData = d3.select("#sample-metadata");

        demoData.html("");
        Object.entries(result).forEach(function([key, value]) {
            console.log(key,value);
            var row = demoData.append("tr");
            row.append("td").html(`<strong><font size = '1'>${key}</font></strong>:`);
            row.append('td').html(`<font size ='1'>${value}</font>`);
            
        });
    });
}

function buildCharts(sample){
    d3.json("data/samples.json").then(function(data){
        var samples = data.samples;
        var resultsArray = samples.filter(function(data1){
            return data1.id === sample;
        })
        var result = resultsArray[0]
 
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;

 
        //create Bubble chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];

        var bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        }
        
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        
        var yticks = otu_ids.slice(0,10).map(function(otuID){
            return `OTU ${otuID}`
            }).reverse();

        var barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            // x: sample_values.slice(0,10),
            // y: otu_ids.slice(0,10),
            // text: otu_labels.slice(0,10),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };


        Plotly.newPlot("bar", barData, barLayout);
        
    })

}

//call function when new ID is selected
function optionChanged(newID){
    buildDemographics(newID);
    buildCharts(newID);

}
inID();