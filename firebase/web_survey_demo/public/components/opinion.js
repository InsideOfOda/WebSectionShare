
export default {
  data: function() {
	 return{
		 survey_data:[],
		 opinion_text:'',
		 user_name:'',
		 opinion:[]
	 }

  },
  methods:{
	save_opinion(){
		var self = this;
		var event = "";

		var event_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name).collection("opinion");
		event_ref.add({
			opinion: self.opinion_text,
			name: self.user_name,
			timestamp: firebase.firestore.Timestamp.fromDate(new Date())
		})
		.catch((error) => {
			console.log(error);
		});
		self.opinion_text="";

	},
	set_snapshot(){
		var self=this;
		var survey_ref = firebase.firestore().collection("survey_data").doc(self.survey_data.name);

		survey_ref.collection("opinion")
		.orderBy("timestamp" , "desc").limit(5).onSnapshot((querySnapshot) => {
			self.opinion.length=0;
			querySnapshot.forEach(function(doc){
				var data=doc.data();
				var date = data.timestamp.toDate();
				data.timestamp = date.getHours() + ":"  + date.getMinutes();
				self.opinion.push(data);
			});
		});

	},
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
		<div class="container"> 
		  <div class="col s12 valign-wrapper">
		    <div class="input-field col s5">
		      <textarea id="textarea1" class="materialize-textarea" v-model="user_name" ></textarea>
		      <label for="textarea1">name</label>
		    </div>
		    <div class="col s7">さん</div>
		  </div>
		  <div class="row valign-wrapper">
		    <div class="row input-field col s11">
		      <i class="material-icons prefix">mode_edit</i>
		      <textarea id="textarea2" class="materialize-textarea" v-model="opinion_text" ></textarea>
		      <label for="textarea2">message</label>
		    </div>
	            <div class="btn-floating waves-effect waves-light blue" v-on:click="save_opinion">
		      <i class="material-icons prefix">send</i>
		    </div> 
		  </div>
	  	  <div class="col s12 z-depth-1" v-if="survey_data.opinion">
	            <table>
	              <thead>
	                <tr>
		          <th>時刻</th>
		          <th>名前</th>
		          <th>内容</th>
		        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="log in opinion"> 
                         <td> {{ log.timestamp }} </td>
                         <td> {{ log.name }} </td>
                         <td> {{ log.opinion }} </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
		`	
}

