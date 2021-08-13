var storage = firebase.storage();

export default {
  data: function() {
	 return{
		rule_texts: ''
	 }
  },
  props:['language'],
  methods:{
	sync_db() {
		var self = this;
		firebase.database().ref("game_rules/" + self.language).on('value' , function(snapshot){
  			self.rule_texts = snapshot.val();
		});
	}
  },
  mounted: function() {
		this.sync_db()
  },
	template:`
		<div class="container"> 
                  <div class="row">
        	    <div class="col s12">
          	      <div class="card" v-for="(value, name) in rule_texts">
            	        <div class="card-content" >
	      	          <span class="card-title">{{ name }}</span>
	      	          <p>{{ value }}</p>	      
	    	        </div>
	  	      </div>
		    </div>
                  </div>
                </div>
		`	
}
