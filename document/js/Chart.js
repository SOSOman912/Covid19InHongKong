function makeBarChart (_targetInfo) {
    d3.csv("/data/filter-3",function(d){
        if(d["Age"] < 10) {
            if (Object1["0-9"]) {
                Object1["0-9"] = Object1["0-9"] + 1
            } else {
                Object1["0-9"] = 1;
            }
            d["Age"] = "0-9";
        } else if (d["Age"] > 10 && d["Age"] < 20) {
             if (Object1["10-19"]) {
                Object1["10-19"] = Object1["10-19"] + 1
            } else {
                Object1["10-19"] = 1;
            }
            d["Age"] = "10-19";
        } else if (d["Age"] > 20 && d["Age"] < 30) {
             if (Object1["20-29"]) {
                Object1["20-29"] = Object1["20-29"] + 1
            } else {
                Object1["20-29"] = 1;
            }
            d["Age"] = "20-29";
        } else if (d["Age"] > 30 && d["Age"] < 40) {
            d["Age"] = "30-39";
        } else if (d["Age"] > 40 && d["Age"] < 50) {
            d["Age"] = "40-49";
        } else if (d["Age"] > 50 && d["Age"] < 60) {
            d["Age"] = "50-59";
        } else if (d["Age"] > 60) {
            d["Age"] = ">60";
        }

    }).then(data => {
            console.log(data);
            // color = d3.scaleOrdinal().domain(data)

            // switch (_targetInfo) {
            //     default:
            //     pie = d3.pie().sort(null).value(d => d["Age"]);

            //     const arcs = pie(data);       

            //     svg.append("g")
            //         .attr("stroke","white")
            //         .selectAll("path")
            //         .data(arcs)
            //         .join("path")
            //         .attr("fill", d=> color(d["Age"]))
            //         .attr("d", arcs)
            //         .append("title")
            //             .text(d=> `${d["Age"]}`)
            // }
        }
    )
}

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var D = date.getDate();
    var Y = date.getFullYear();
    var M = date.getMonth();

    var session = "AM";

    var month=new Array();
	  month[0]="Jan";
	  month[1]="Feb";
	  month[2]="Mar";
	  month[3]="Apr";
	  month[4]="May";
	  month[5]="Jun";
	  month[6]="Jul";
	  month[7]="Aug";
	  month[8]="Sep";
	  month[9]="Oct";
	  month[10]="Nov";
	  month[11]="Dec";
	    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = D + " " +month[M] + " " + Y + " " + h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay2").innerText = time;
    document.getElementById("MyClockDisplay2").textContent = time;
    
    setTimeout(showTime, 1000);
}

var DateX,ConfirmedCaseY;
var Object1 = [];

var margin = {top:20,right:100,bottom:20,left:100},
    ContainerWidth = document.getElementById("BarChart1").offsetWidth,
    ContainerHeight = document.getElementById("BarChart1").offsetHeight,
    width = ContainerWidth ,
    height = ContainerHeight 

var svg = d3.select("#BarChart1")
.append("svg")
.attr("width", width)
.attr("height", height + margin.top + margin.bottom)

showTime();
makeBarChart();