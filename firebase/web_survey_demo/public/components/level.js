google.charts.load('current', {'packages':['bar']});
google.charts.load('current', {'packages':['timeline']});

export default {
  data: function() {
	 return{
		 survey_data:[],
		 level:'3',
		 result:[],
		 sum_level:[0,0,0,0,0],
	 }
  },
  methods:{
	push_level(){
		var self = this;

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name).collection("level");
		event_ref.add({
				answer: self.level,
				timestamp: firebase.firestore.Timestamp.fromDate(new Date())
			})
		.catch((error) => {
			console.log(error);
		});

	},
	set_snapshot(){
		var self=this;
		var survey_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name);

		survey_ref.collection("level")
		.orderBy("timestamp" , "asc").onSnapshot((querySnapshot) => {
			self.result.length=0;
			self.sum_level=[0,0,0,0,0];
			querySnapshot.forEach((doc) => {
				if(self.result.length == 0){
					self.result.push([doc.data().answer, doc.data().timestamp.toDate(), doc.data().timestamp.toDate()]);
				} else {
					self.result.push([doc.data().answer, self.result[self.result.length-1][2], doc.data().timestamp.toDate() ]);
				}
				self.sum_level[doc.data().answer - 1]++
			});
			self.draw_timeline();
			self.draw_bar_chart();
		});
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
			legend: { position: 'none' },
		};

		//get element and draw
       		var chart = new google.charts.Bar(document.getElementById('barchart'));
       		chart.draw(data, google.charts.Bar.convertOptions(options));
	},
	draw_timeline(){
		var self=this;

		var dataTable = new google.visualization.DataTable();

		dataTable.addColumn({ type: 'string', id: 'Answer' });
		dataTable.addColumn({ type: 'date', id: 'Start' });
		dataTable.addColumn({ type: 'date', id: 'End' });

		dataTable.addRows(self.result);

		var container = document.getElementById('timeline');
		var chart = new google.visualization.Timeline(container);
		chart.draw(dataTable);
	}

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
		<div class="container" v-if="survey_data.level"> 
                  <div class="row">
		    <div class="row" v-if="survey_data.level">
		      <form action="#" class="col s9">
		        <p class="range-field">
		          <input type="range" id="test5" v-model="level"  min="1" max="5" />
		        </p>
	              </form>
	              <div class="col s3  btn waves-effect waves-light blue" v-on:click="push_level">決定:{{ level }}</div>
		    </div>
		    <div class="row valign-wrapper">
		      <div class="col s5">
	                <div id="barchart"></div>
	              </div> 
		      <div class="col s7">
	                <div id="timeline"></div>
	              </div> 
		    </div>
                  </div>
                </div>
		`	
}

