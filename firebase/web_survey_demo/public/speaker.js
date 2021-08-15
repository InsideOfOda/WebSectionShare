import gchart from "./gchart.js"

export default {
  data: function() {
	 return{
		rule_texts: '',
		survey_name:'',
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
			name: self.survey_name,
			yes_or_no: self.yes_or_no,
			level: self.level,
			opinion: self.opinion,
			timestamp: firebase.firestore.Timestamp.fromDate(new Date())
		});

	}
  },
  mounted: function() {
	var self = this;
	firebase.firestore().collection("summary").doc("current_survey")
	.get().then((doc) => {
		self.survey_name = doc.data().name;
	})
  },
	template:`
		<div class="container"> 
                  <div class="row valign-wrapper">
		    <div class="input-field col s11">
		      <i class="material-icons prefix">mode_edit</i>
		      <textarea id="textarea1" class="materialize-textarea" v-model="survey_name" ></textarea>
		    </div>
	            <div class="btn-floating waves-effect waves-light blue" v-on:click="pub_survey">
		      <i class="material-icons prefix">send</i>
		    </div> 
                  </div>
		  <div class="row">
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="yes_or_no"  />
		        <span>YES/NO</span>
		      </label>
	    	    </div>
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="level" />
		        <span>5段階</span>
		      </label>
	    	    </div>
		    <div class="col s4">
		      <label>
		        <input type="checkbox" v-model="opinion"  />
		        <span>自由記述</span>
		      </label>
	    	    </div>
		  </div>
		  <gchart></gchart>
                </div>
		`	
}
