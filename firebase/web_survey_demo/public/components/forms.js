import y_or_n from "./y_or_n.js"
import level from "./level.js"
import opinion from "./opinion.js"

export default {
  data: function() {
	 return{
		 survey_data:[],
	 }
  },
  components:{
	y_or_n,
	level,
	opinion
  },
  methods:{
  },
  mounted: function(){
	var self = this;

	firebase.firestore().collection("summary").doc("current_survey").onSnapshot((doc) => {
		self.survey_data = doc.data();
	});
  },
  template:`
		<div> 
		  <div class="card">
                    <div class="row">
		      <div class="col s12">
		        <blockquote>{{ survey_data.name }}</blockquote>
	              </div>
                    </div>
		    <y_or_n></y_or_n>
		    <level></level>
		  </div>
		  
		  <div class="card">
		    <opinion></opinion>
		  </div>  
                </div>
		`	
}

