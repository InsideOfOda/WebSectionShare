google.charts.load('current', {'packages':['bar']});
google.charts.load('current', {'packages':['timeline']});
google.charts.load('current', {'packages':['corechart']});


export default {
	data: function(){
		return{
			refbox_data:[],
			game_event_data:[],
			ball_position_data:[],
			refbox_count: {
				HALT: 0,
				STOP: 0,
				NORMAL_START: 0,
				FORCE_START: 0,
				PREPARE_KICKOFF_YELLOW: 0,
				PREPARE_KICKOFF_BLUE: 0,
				PREPARE_PENALTY_YELLOW: 0,
				PREPARE_PENALTY_BLUE: 0,
				DIRECT_FREE_YELLOW: 0,
				DIRECT_FREE_BLUE: 0,
				INDIRECT_FREE_YELLOW: 0,
				INDIRECT_FREE_BLUE: 0,
				TIMEOUT_YELLOW: 0,
				TIMEOUT_BLUE: 0,
				GOAL_YELLOW: 0,
				GOAL_BLUE: 0,
				BALL_PLACEMENT_YELLOW: 0,
				BALL_PLACEMENT_BLUE: 0,
			},
			refbox_timestamp:[],
			long_term_stop:[]
		}
	},
	methods:{
		draw_bar_chart(){

			var self=this;

			var data = new google.visualization.DataTable();
        		data.addColumn('string', 'Events');
        		data.addColumn('number', 'counts');
			data.addColumn({type:'string', role:'style'});
			
			//initialized
			for(var key in self.refbox_count){
				self.refbox_count[key]=0
			}
			
			//calculate
			for(var key in self.refbox_data){
				const command_name = self.refbox_data[key].command_name;
				self.refbox_count[command_name] += 1;
			}

			//trasforme to google.visualization.DataTable
        		for(var key in self.refbox_count){
				if(key.search(/BLUE/) !== -1)
					data.addRow([key , self.refbox_count[key],'blue' ]);
				else if(key.search(/YELLOW/) !== -1)
					data.addRow([key , self.refbox_count[key],'yellow' ]);
				else	
					data.addRow([key , self.refbox_count[key],'gray' ]);
			}

			var view = new google.visualization.DataView(data);
			      view.setColumns([0, 1,
				            { calc: "stringify",
					      sourceColumn: 1,
					      type: "string",
					      role: "annotation" },
				              2]);

			//setting
        		var options = {
				title: 'Counts of events',
				vAxis: {
					title: 'Events'
				},
				hAxis:  {
					title: 'Number of counts'
				},
				bar: {groupWidth: '80%'},
				height: '600',
				width: '800'
				
			};

			//get element and draw
        		var chart = new google.visualization.BarChart(document.getElementById('gchart'));
        		chart.draw(view, options);
      
		},
		draw_timeline(){
			var self=this;

			var data = new google.visualization.DataTable();
      
			data.addColumn({ type: 'string', id: 'stage' });
			data.addColumn({ type: 'string', id: 'Comand name' });
        		data.addColumn({ type: 'number', id: 'Start' });
        		data.addColumn({ type: 'number', id: 'End' });
			
			for(var i = 2; i < self.refbox_data.length; i++){
				var stage=self.refbox_data[i].stage;
				var command_name=self.refbox_data[i].command_name;
				var start_time=self.refbox_data[i].timestamp * 0.001 ;
				var end_time;
				if(i != (self.refbox_data.length - 1) ){
					end_time=self.refbox_data[i+1].timestamp * 0.001 ;
					if( ((end_time - start_time) >= 30000) && (command_name === 'STOP' || command_name === 'HALT') ){
						self.long_term_stop.push({
							current_name: command_name,
							pre_name:	self.refbox_data[i-1].command_name,
							prepre_name: self.refbox_data[i-2].command_name,
							start_time: start_time
						});
						data.addRow([ command_name, stage, start_time, end_time ])
					}
				} else{
					end_time= start_time + 1;
				}
				//data.addRow([ command_name, stage, start_time, end_time ])
			}
			for(var i=0; i < self.game_event_data.length; i++){
				var game_event=self.game_event_data[i].event_name;
				var timestamp=self.game_event_data[i].timestamp *0.001;
				data.addRow([ 'GAME_EVENT', game_event, timestamp, timestamp + 50000 ]);
			}
			var options = {
        			//timeline: { showRowLabels: false },
        			//avoidOverlappingGridLines: false
				width : '4000',
				height: '800'
				//timeline: { showBarLabels: false }
      			};
			var chart = new google.visualization.Timeline(document.getElementById('gchart'));
			chart.draw(data,options);
		},
		draw_bubble(){
			var self=this;

			var data = new google.visualization.DataTable();
      
			data.addColumn({ type: 'string', id: 'No.' });
			data.addColumn({ type: 'number', id: 'X' });
        		data.addColumn({ type: 'number', id: 'Y' });
        		data.addColumn({ type: 'string', id: 'Team' });
			
			/*
			var data = new google.visualization.arrayToDataTable(
				['No.', 'X', 'Y', 'Team']
			);
			*/

			for(var i=0; i < self.ball_position_data.length; i++){
				//var no=String(self.ball_position_data[i].robot_number);
				var no=self.ball_position_data[i].robot_number;
				var x=Number(self.ball_position_data[i].position_x);
				var y=Number(self.ball_position_data[i].position_y);
				var team=self.ball_position_data[i].ball_holding_team;
				data.addRow([no,x,y,team]);
			}

			var options = {
				title:'ball_position',
				hAxis: {title: 'x', maxValue: 6000, minValue:-6000},
				vAxis: {title: 'y', maxValue: 6000, minValue:-6000},
				buble: {textStyle: {fontSize: 11}},
				sizeAxis: {maxSize: 10},
				height: '800',
				width: '800'
			};

			var chart = new google.visualization.BubbleChart(document.getElementById('gchart'));
			chart.draw(data,options);

			
		}
	}
}


