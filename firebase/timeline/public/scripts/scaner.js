export default{
	data: function(){
		return{
			video_src:''
		}
	},
	mounted(){
		var self=this;
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          		navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
            			//self.video_src = window.URL.createObjectURL(stream);
				self.video_src = stream;
          		})
			.catch(err => {
				self.video_src = err;
			})
		}
		else
			self.video_src = 'https下で試してNe';
	},
	template:`
	        <div>
		  <!-- <video v-bind:src= video_src autoplay> </video> -->
		  <video :srcObject.prop="video_src" autoplay> </video>
		  <div>{{ video_src }}</div>
	        </div>
		`
}

