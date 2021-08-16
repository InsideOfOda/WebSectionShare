export default {
  data: function() {
	 return{
		 survey_name:'',
		 yes_or_no:true,
		 level:3,
		 opinion_text:''
	 }
  },
  methods:{
	save_opinion(){
		var self = this;
		var event = "";

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_name).collection("opinion");
		event_ref.add({
			opinion: self.opinion_text,
			timestamp: firebase.firestore.Timestamp.fromDate(new Date())
		})
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
	push_level(){
		var self = this;

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_name).collection("level");
		event_ref.add({
				answer: self.level,
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
		<div> 
                  <div class="row">
	            <div class="col s12">
		      <blockquote><pre>{{ survey_name }}</pre></blockquote>
		    </div>
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
		    <div class="row">
		      <form action="#" class="col s9">
		        <p class="range-field">
		          <input type="range" id="test5" v-model="level"  min="1" max="5" />
		        </p>
	              </form>
	              <div class="col s3  btn waves-effect waves-light blue" v-on:click="push_level">決定:{{ level }}</div>
		    </div>
		    <div class="row valign-wrapper">
		      <div class="input-field col s11">
		        <i class="material-icons prefix">mode_edit</i>
		        <textarea id="textarea1" class="materialize-textarea" v-model="opinion_text" ></textarea>
		      </div>
	              <div class="btn-floating waves-effect waves-light blue" v-on:click="save_opinion">
		        <i class="material-icons prefix">send</i>
		      </div> 
		    </div>
                  </div>
                </div>
		`	
}

