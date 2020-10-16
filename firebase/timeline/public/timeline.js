google.charts.load('current', {'packages':['timeline']});

export default {
	data:function(){
		return{
		}
	},
	methods:{
		draw_timeline(){
			var data = new google.visualization.DataTable();
			data.addColumn({ type: 'string', id: 'President' });
		        data.addColumn({ type: 'date', id: 'Start' });
		        data.addColumn({ type: 'date', id: 'End' });
		        data.addRows([
				          [ 'Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
				          [ 'Adams',      new Date(1797, 2, 4),  new Date(1801, 2, 4) ],
				          [ 'Jefferson',  new Date(1801, 2, 4),  new Date(1809, 2, 4) ]
				]);
				//一個づつ追加するにはdata.addRow(["","","",""])
			var chart = new google.visualization.Timeline(document.getElementById('gchart'));
			chart.draw(data);
		}
	},
	template:`
		<div>
			<button v-on:click="draw_timeline">Draw Timeline</button>
			<div id="gchart" style="width: 900px; height: 1000px;"></div>
		</div>
		`
}
