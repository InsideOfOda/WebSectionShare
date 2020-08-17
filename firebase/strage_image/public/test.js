var storage = firebase.storage();

Vue.component('storage-ref',{
	data:function(){
		return{
			img_src:''
		}
	},
	methods:{
		storage_ref(){
			var self=this;

			storage.ref().child('sample.jpg').getDownloadURL().then(function(url) {
				self.img_src = url;
			}).catch(function(error) {
			//Do something when catch error
			});
		}
	},
	mounted: function(){
		this.storage_ref()
		},
	template:'<div> <img v-bind:src= img_src> </div>'
})

var app = new Vue({ el : '#app' });
