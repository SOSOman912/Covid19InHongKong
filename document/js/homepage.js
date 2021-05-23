

function UpdateBoard () {
	const DataBoard1Content = document.getElementById('DataBoard1Content');
	const DataBoard1Status = document.getElementById('DataBoard1Status');
	const DataBoard2Content = document.getElementById('DataBoard2Content');
	const DataBoard2Status = document.getElementById('DataBoard2Status');
	const DataBoard3Content = document.getElementById('DataBoard3Content');
	const DataBoard3Status = document.getElementById('DataBoard3Status');
	fetch("https://api.data.gov.hk/v2/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Flatest_situation_of_reported_cases_covid_19_eng.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%7D")
		.then(response => response.json())
		.then(data => {
			const TotalDistance = data[data.length - 1]['Number of confirmed cases'] - data[data.length - 2]['Number of confirmed cases'];
			const DeadDistance = data[data.length - 1]['Number of death cases'] - data[data.length - 2]['Number of death cases'];
			const dischargeDistance = data[data.length - 1]['Number of discharge cases'] - data[data.length - 2]['Number of discharge cases'];
			DataBoard1Content.innerHTML = data[data.length - 1]['Number of confirmed cases'];
			DataBoard2Content.innerHTML = data[data.length - 1]['Number of death cases'];
			DataBoard3Content.innerHTML = data[data.length - 1]['Number of discharge cases'];

			if (TotalDistance == 0) {
				DataBoard1Status.innerHTML = `<span class="glyphicon glyphicon-minus"></span>`
			} else {
				DataBoard1Status.innerHTML = `<span class="glyphicon glyphicon-arrow-up"></span>:    ` + TotalDistance
			}

			if (DeadDistance == 0) {
				DataBoard2Status.innerHTML = `<span class="glyphicon glyphicon-minus"></span>`
			} else {
				DataBoard2Status.innerHTML = `<span class="glyphicon glyphicon-arrow-up"></span>:    ` + DeadDistance
			}

			if (dischargeDistance == 0) {
				DataBoard3Status.innerHTML = `<span class="glyphicon glyphicon-minus"></span>`
			} else {
				DataBoard3Status.innerHTML = `<span class="glyphicon glyphicon-arrow-up"></span>:    ` + dischargeDistance
			}
		})
		.catch(err => console.log(err));
}

function UpdateInfectedDetail () {
	fetch("https://api.data.gov.hk/v2/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Fenhanced_sur_covid_19_eng.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%7D")
		.then(response => response.json())
		.then(data => {
			var LatestInfectedContainer = document.getElementById("LatestInfectedContainer");
			var LatestData = document.createElement("div");

			data.slice(-5).map(item => {
				let [Age,Case_classification,CaseNo,IsConfirmed,Data_onset,Gender,IsHKResident,Status,Report_data] = [document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5"),document.createElement("H5")];
				var div = document.createElement("div");
				var AgeText = document.createTextNode(item['Age']);
				var CaseText = document.createTextNode(item['Case classification*']);
				var CaseNoText = document.createTextNode(item['Case no.']);
				var IsConfirmedText = document.createTextNode(item['Confirmed/probable']);
				var OnsetText = document.createTextNode(item['Date of onset']);
				var GenderText = document.createTextNode(item['Gender']);
				var HKText = document.createTextNode(item['HK/Non-HK resident']);
				var StatusText = document.createTextNode(item['Hospitalised/Discharged/Deceased']);
				var ReportDataText = document.createTextNode(item['Report date']);


				Age.appendChild(AgeText);
				Case_classification.appendChild(CaseText);
				Report_data.appendChild(ReportDataText);
				CaseNo.appendChild(CaseNoText);
				IsConfirmed.appendChild(IsConfirmedText);
				Data_onset.appendChild(OnsetText);
				Gender.appendChild(GenderText);
				IsHKResident.appendChild(HKText);
				Status.appendChild(StatusText);

				div.appendChild(Age);
				div.appendChild(Case_classification);
				div.appendChild(CaseNo);
				div.appendChild(IsConfirmed);
				div.appendChild(Data_onset);
				div.appendChild(Gender);
				div.appendChild(IsHKResident);
				div.appendChild(Status);
				div.appendChild(Report_data);

				div.classList.add("InfectedInformation");

				LatestData.appendChild(div);
			})

			LatestInfectedContainer.appendChild(LatestData);
		})
}

function makeLineChart (_targetInfo) {
	d3.csv("/data/filter-2",function(d){
		var parser = d3.timeParse("%d/%m/%Y");
		d["As of date"] = parser(d["As of date"]);
		console.log(d);
		return(d)
	}).then(data => {
		switch (_targetInfo)
		{	
			case 'Number of confirmed cases':
				console.log(data);
				svg.selectAll("*").remove();
				DateX = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d["As of date"];}))
					.range([margin.left, width - margin.right]);
				svg.append("g")
					.attr("transform", "translate(0,"+ height + ")")
					.call(d3.axisBottom(DateX).tickFormat(d3.timeFormat("%m %Y")));

				ConfirmedCaseY = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return +d["Number of confirmed cases"]})])
					.range([height, margin.top]);

				svg.append("g")
					.attr("transform", "translate("+ margin.left +",0)")
					.call(d3.axisLeft(ConfirmedCaseY));

				path = svg.append("path")
					.datum(data)
					.attr("fill","none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
					.attr("d", d3.line()
						.x(function(d) { return DateX(d["As of date"])})
						.y(function(d) { return ConfirmedCaseY(d["Number of confirmed cases"])})
						)

				svg.append("text")
					.attr("x", (width / 2))
					.attr("y", 0 + (margin.top))
					.attr("text-anchor", "middle")
					.style("font-size", "16px")
					.style("text-decoration", "underline")
					.text("Number of confirmed cases Line Chart")
				break;

			case 'Number of death cases':
				console.log(data);
				svg.selectAll("*").remove();
				DateX = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d["As of date"];}))
					.range([margin.left, width - margin.right]);
				svg.append("g")
					.attr("transform", "translate(0,"+ height + ")")
					.call(d3.axisBottom(DateX).tickFormat(d3.timeFormat("%m %Y")));

				ConfirmedCaseY = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return +d["Number of death cases"]})])
					.range([height, margin.top]);

				svg.append("g")
					.attr("transform", "translate("+ margin.left +",0)")
					.call(d3.axisLeft(ConfirmedCaseY));

				path = svg.append("path")
					.datum(data)
					.attr("fill","none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
					.attr("d", d3.line()
						.x(function(d) { return DateX(d["As of date"])})
						.y(function(d) { return ConfirmedCaseY(d["Number of death cases"])})
						)

				svg.append("text")
					.attr("x", (width / 2))
					.attr("y", 0 + (margin.top))
					.attr("text-anchor", "middle")
					.style("font-size", "16px")
					.style("text-decoration", "underline")
					.text("Number of Dead cases Line Chart")
				break;

			case 'Number of discharge cases':
				console.log(data);
				svg.selectAll("*").remove();
				DateX = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d["As of date"];}))
					.range([margin.left, width - margin.right]);
				svg.append("g")
					.attr("transform", "translate(0,"+ height + ")")
					.call(d3.axisBottom(DateX).tickFormat(d3.timeFormat("%m %Y")));

				ConfirmedCaseY = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return +d["Number of discharge cases"]})])
					.range([height, margin.top]);

				svg.append("g")
					.attr("transform", "translate("+ margin.left +",0)")
					.call(d3.axisLeft(ConfirmedCaseY));

				path = svg.append("path")
					.datum(data)
					.attr("fill","none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
					.attr("d", d3.line()
						.x(function(d) { return DateX(d["As of date"])})
						.y(function(d) { return ConfirmedCaseY(d["Number of discharge cases"])})
						)

				svg.append("text")
					.attr("x", (width / 2))
					.attr("y", 0 + (margin.top))
					.attr("text-anchor", "middle")
					.style("font-size", "16px")
					.style("text-decoration", "underline")
					.text("Number of discharge cases Line Chart")
				break;	

			default:

				DateX = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d["As of date"];}))
					.range([margin.left, width - margin.right]);
				svg.append("g")
					.attr("transform", "translate(0,"+ height + ")")
					.call(d3.axisBottom(DateX).tickFormat(d3.timeFormat("%m %Y")));

				ConfirmedCaseY = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return +d["Number of confirmed cases"]})])
					.range([height, margin.top]);

				svg.append("g")
					.attr("transform", "translate("+ margin.left +",0)")
					.call(d3.axisLeft(ConfirmedCaseY));

				path = svg.append("path")
					.datum(data)
					.attr("fill","none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
					.attr("d", d3.line()
						.x(function(d) { return DateX(d["As of date"])})
						.y(function(d) { return ConfirmedCaseY(d["Number of confirmed cases"])})
						)

				svg.append("text")
					.attr("x", (width / 2))
					.attr("y", 0 + (margin.top))
					.attr("text-anchor", "middle")
					.style("font-size", "16px")
					.style("text-decoration", "underline")
					.text("Number of confirmed cases Line Chart")
				break;
		}
	});
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
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);
}
var path;
var DateX,ConfirmedCaseY;

var margin = {top:20,right:100,bottom:20,left:100},
	ContainerWidth = document.getElementById("LineChart1").offsetWidth,
	ContainerHeight = document.getElementById("LineChart1").offsetHeight,
	width = ContainerWidth ,
	height = ContainerHeight 

var svg = d3.select("#LineChart1")
.append("svg")
.attr("width", width)
.attr("height", height + margin.top + margin.bottom)

makeLineChart();
showTime();
UpdateBoard();
UpdateInfectedDetail();

var intervalID = window.setInterval(function(){
	UpdateBoard();
	UpdateInfectedDetail();
},3600000);