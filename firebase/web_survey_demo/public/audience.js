import gchart from "./gchart.js"
import forms from "./forms.js"

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
		  <gchart></gchart>
	          </div>
		</div>
		`

}

