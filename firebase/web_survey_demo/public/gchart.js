google.charts.load('current', {'packages':['bar']});
google.charts.load('current', {'packages':['line']});
google.charts.load('current', {'packages':['corechart']});


export default {
	data: function(){
		return{
			survey_name:'',
			yes_or_no:[],
			y_n_array:[],
			sum_yes:0,
			sum_no:0,
			level:[],
			sum_level:[0,0,0,0,0],
			opinion:[]
		}
	},
  	mounted: function(){
		var self = this;

		firebase.firestore().collection("summary").doc("current_survey")
		.onSnapshot(async(doc) => {
			self.survey_name = await doc.data().name;
			self.set_snapshot();
		})


  	},
	methods:{
		set_snapshot(){
			var self=this;
			var survey_ref = firebase.firestore().collection("survey_data").doc(self.survey_name);

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

			survey_ref.collection("level")
			.onSnapshot((querySnapshot) => {
				self.level.length=0;
				self.sum_level=[0,0,0,0,0];
				querySnapshot.forEach((doc) => {
					self.level.push(doc.data());
					self.sum_level[doc.data().answer - 1]++
				});
				self.draw_bar_chart();
			});

			survey_ref.collection("opinion")
			.orderBy("timestamp" , "desc").limit(5).onSnapshot((querySnapshot) => {
				self.opinion.length=0;
				querySnapshot.forEach(function(doc){
					var data=doc.data();
					var date = data.timestamp.toDate();
					data.timestamp = date.getHours() + ":"  + date.getMinutes();
					self.opinion.push(data);
				});
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
		draw_bar_chart(){
			var self=this;

			var data = new google.visualization.arrayToDataTable([
				['Answer', 'Total'],
				['1', self.sum_level[0] ],
				['2', self.sum_level[1] ],
				['3', self.sum_level[2] ],
				['4', self.sum_level[3] ],
				['5', self.sum_level[4] ],
			]);
			
			//setting
        		var options = {
				legend: 'none'
			};

			//get element and draw
        		var chart = new google.visualization.BarChart(document.getElementById('barchart'));
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
				}
			};

        		var chart = new google.charts.Line(document.getElementById('linechart'));
        		chart.draw(data, google.charts.Line.convertOptions(options));
			
		}
	},
	template:`
		<div> 
                  <div class="row">
		    <div class="col s12 valign-wrapper">
		      <div class="col s8">
	                <div id="piechart"></div>
		      </div>
		      <div class="col s4">
		        <div class="col s12 z-depth-1">YES : {{ sum_yes }}<br>NO : {{ sum_no }}</div> 
		      </div>
	            </div> 
		    <div class="col s6">
	              <div id="linechart"></div>
	            </div> 
		    <div class="col s6">
	              <div id="barchart"></div>
	            </div> 
	  	    <div class="col s6 z-depth-1">
	              <table>
	                <thead>
	                  <tr>
		            <th>時刻</th>
		            <th>内容</th>
		          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="log in opinion"> 
                           <td> {{ log.timestamp }} </td>
                           <td> {{ log.opinion }} </td>
                          </tr>
                        </tbody>
                      </table>
	            </div>
                  </div>
                </div>
		`
}



