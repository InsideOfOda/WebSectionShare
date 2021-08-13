import gchart from "./gchart.js"
import forms from "./forms.js"

var storage = firebase.storage();
var storageRef = storage.ref();

export default {
	components:{
		gchart,
		forms
	},
	data: function(){
		return{
		}
	},
	methods:{
	},
	template:`
		<div class="container">
	          <div class="row">
		  <forms></forms>
		    <div class="waves-effect waves-light btn col s3">Ball Position</div> 
		    <div class="col s12" style="max-width:100%; overflow: auto;">
	              <div id="gchart"></div>
	            </div> 
	          </div>
		</div>
		`

}

