google.charts.load('current', {'packages':['line']});
google.charts.load('current', {'packages':['corechart']});

export default {
  data: function() {
	 return{
		survey_data:[],
		yes_or_no:[],
		y_n_array:[],
		sum_yes:0,
		sum_no:0,
	 }
  },
  methods:{
	push_yes_or_no(bool_data){
		var self = this;

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name).collection("yes_or_no");
		event_ref.add({
				answer: bool_data,
				timestamp: firebase.firestore.Timestamp.fromDate(new Date())
			})
		.catch((error) => {
			console.log(error);
		});

	},
	set_snapshot(){
		var self=this;
		var survey_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name);

		survey_ref.collection("yes_or_no")
		.orderBy("timestamp" , "asc").onSnapshot((querySnapshot) => {
			self.yes_or_no.length=0;
			self.y_n_array.length=0;
			self.sum_yes=0;
			self.sum_no=0;
			querySnapshot.forEach((doc) => {
				self.yes_or_no.push(doc.data());
				if(doc.data().answer){
					self.sum_yes++;
				}else{
					self.sum_no++;
				}
				self.y_n_array.push([doc.data().timestamp.toDate(), self.sum_yes, self.sum_no]);
			});
			self.draw_pi_chart();
			self.draw_line_chart();
		});
	},
	draw_pi_chart(){

		var self=this;

		var data = new google.visualization.arrayToDataTable([
			['Answer', 'Total'],
			['Yes', self.sum_yes],
			['No', self.sum_no]
		]);
			
		//setting
       		var options = {
			pieHole: 0.3,
			legend: 'none',
			pieSliceText: 'label'
		};

		//get element and draw
       		var chart = new google.visualization.PieChart(document.getElementById('piechart'));
       		chart.draw(data, options);
      
	},
	draw_line_chart(){
		var self=this;

		var data = new google.visualization.DataTable();
		data.addColumn('date', 'Time');
		data.addColumn('number', 'YES');
		data.addColumn('number', 'NO');

		data.addRows(self.y_n_array);

       		var options = {
			legend:{
				position: 'none'
			},
		};

       		var chart = new google.charts.Line(document.getElementById('linechart'));
       		chart.draw(data, google.charts.Line.convertOptions(options));
			
	},
  },
  mounted: function(){
	var self = this;

	firebase.firestore().collection("summary").doc("current_survey")
	.onSnapshot(async(doc) => {
		self.survey_data = await doc.data();
		self.set_snapshot();
	})
  },
  template:`
		<div class="container" v-if="survey_data.yes_or_no"> 
                  <div class="row">
		    <div class="row">
		      <div class="card blue col s5 btn waves-effect waves-light" v-on:click="push_yes_or_no(true)">
	                <div class="col s12 center-align">
		          YES(現在:{{ sum_yes }})
	                </div>
		      </div>
		      <div class="card red col s5 offset-s2 btn waves-effect waves-light" v-on:click="push_yes_or_no(false)">
	                <div class="col s12 center-align">
		          NO(現在:{{ sum_no }})
	                </div>
		      </div>
		    </div>

		    <div class="row valign-wrapper">
		      <div class="col s6">
	                <div id="piechart"></div>
		      </div>
		      <div class="col s6">
	                <div id="linechart"></div>
	              </div> 
	            </div> 
                  </div>
                </div>
		`	
}

