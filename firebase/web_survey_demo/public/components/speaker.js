import gchart from "./gchart.js"

export default {
  data: function() {
	 return{
		survey_data:[],
		yes_or_no:true,
		level:true,
		opinion:true
	 }
  },
  components:{
	  gchart
  },
  methods:{
	pub_survey() {
		var self = this;
		var event = "";

		var event_ref = firebase.firestore().collection("summary").doc("current_survey");
		event_ref.set({
			name: self.survey_data.name,
			yes_or_no: self.survey_data.yes_or_no,
			level: self.survey_data.level,
			opinion: self.survey_data.opinion,
			timestamp: firebase.firestore.Timestamp.fromDate(new Date())
		});

	},
	reset_opinion(){
		var self=this;
		
		var opinion_ref=firebase.firestore().collection("survey_data").doc(new Date().toDateString()).collection("opinion");

		opinion_ref.get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				opinion_ref.doc(doc.id).delete();
			});
		});

	}
  },
  mounted: function() {
	var self = this;
	firebase.firestore().collection("summary").doc("current_survey")
	.get().then( async(doc) => {
		self.survey_data = await doc.data();
	})
  },
	template:`
		<div class="container"> 
                  <div class="row valign-wrapper">
		    <div class="input-field col s11">
		      <i class="material-icons prefix">mode_edit</i>
		      <textarea id="textarea1" class="materialize-textarea" v-model="survey_data.name" ></textarea>
		    </div>
	            <div class="btn-floating waves-effect waves-light blue" v-on:click="pub_survey">
		      <i class="material-icons prefix">send</i>
		    </div> 
                  </div>
		  <div class="row">
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="survey_data.yes_or_no"  />
		        <span>YES/NO</span>
		      </label>
	    	    </div>
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="survey_data.level" />
		        <span>5段階</span>
		      </label>
	    	    </div>
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="survey_data.opinion"  />
		        <span>自由記述</span>
		      </label>
	    	    </div>
		  </div>
		  <div class="row">
		    <div class="card red col s5 offset-s7 btn waves-effect waves-light" v-on:click="reset_opinion">
	              <div class="center-align">
		        Message Reset
	              </div>
		    </div>
		  </div>
		  <gchart></gchart>
                </div>
		`	
}
