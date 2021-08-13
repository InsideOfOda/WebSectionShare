export default {
  data: function() {
	 return{
		 survey_name:'',
		 yes_or_no:true,
		 opinion_text:''
	 }
  },
  methods:{
	save_opinion(){
		var self = this;
		var event = "";

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_name).collection("opinion");
		event_ref.add({opinion: self.opinion_text})
		.catch((error) => {
			console.log(error);
		});
		self.opinion_text="";

	},
	push_yes_or_no(bool_data){
		var self = this;

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_name).collection("yes_or_no");
		event_ref.add({
				answer: bool_data,
				timestamp: firebase.firestore.Timestamp.fromDate(new Date())
			})
		.catch((error) => {
			console.log(error);
		});

	},
  },
  mounted: function(){
	var self = this;
	
	var elems1 = document.querySelectorAll('.collapsible');
	var instances1 = M.Collapsible.init(elems1);

	firebase.firestore().collection("summary").doc("current_survey").onSnapshot((doc) => {
		self.survey_name = doc.data().name;
	});
  },
  template:`
		<div class="container"> 
                  <div class="row">
	            <div class="card col s12">{{ survey_name }}</div>
		    <div class="card blue lighten-4 col s5 btn waves-effect waves-light" v-on:click="push_yes_or_no(true)">
	              <div class="col s12 center-align">
		        YES
	              </div>
		    </div>
		    <div class="col s2"></div>
		    <div class="card red lighten-4 col s5 btn waves-effect waves-light" v-on:click="push_yes_or_no(false)">
	              <div class="col s12 center-align">
		        NO
	              </div>
		    </div>
		    <div class="input-field col s12">
		      <i class="material-icons prefix">mode_edit</i>
		      <textarea id="textarea1" class="materialize-textarea" v-model="opinion_text" ></textarea>
		    </div>
	            <div class="row">
	              <div class="col s3 offset-s9  btn waves-effect waves-light blue" v-on:click="save_opinion">保存</div>
	            </div>
                  </div>
                </div>
		`	
}

